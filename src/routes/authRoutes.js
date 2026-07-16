import { Router } from 'express';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { pool } from '../db.js';
import { config } from '../config.js';
import { hashPassword, verifyPassword, signToken, publicUser, requireAuth, normalizeEmail } from '../auth.js';
import { asyncHandler, ApiError, EMAIL_RE } from '../util.js';
import { uploadToImgbb } from '../imgbb.js';
import { sendPasswordResetEmail, sendVerificationEmail, smtpConfigured } from '../mailer.js';
import { buildSteamLoginUrl, verifySteamAssertion, fetchSteamProfile } from '../steam.js';
import { createCaptcha, verifyCaptcha } from '../captcha.js';
import { validateRealEmail } from '../emailCheck.js';
import { rateLimit, clientIp } from '../rateLimit.js';

const sha256 = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

// Email verification is enforced only when SMTP is configured (so devs without a
// mail server aren't locked out) and not explicitly disabled.
function verificationActive() {
  return config.requireEmailVerification && smtpConfigured();
}

async function createVerification(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + config.emailVerifyTtlHours * 3600 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  await pool.query('INSERT INTO email_verifications (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [
    userId,
    sha256(token),
    expires,
  ]);
  return token;
}

async function sendVerification(userId, email) {
  const token = await createVerification(userId);
  const link = `${config.appUrl}/?verify=${token}`;
  try {
    await sendVerificationEmail({ email, link });
  } catch (err) {
    console.error('[auth] verification email failed:', err.message);
  }
}

// Require a CAPTCHA once an email has failed to log in this many times.
const LOGIN_CAPTCHA_THRESHOLD = 2;
const FAIL_TTL_MS = 15 * 60 * 1000;
const loginFailures = new Map(); // email -> { count, ts }

function failCount(email) {
  const entry = loginFailures.get(email);
  if (!entry) return 0;
  if (Date.now() - entry.ts > FAIL_TTL_MS) {
    loginFailures.delete(email);
    return 0;
  }
  return entry.count;
}
function bumpFail(email) {
  const count = failCount(email) + 1;
  loginFailures.set(email, { count, ts: Date.now() });
  return count;
}
function clearFail(email) {
  loginFailures.delete(email);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

const OWNER_EMAIL = normalizeEmail(config.ownerEmail);

export const authRoutes = Router();

authRoutes.post(
  '/register',
  asyncHandler(async (req, res) => {
    let { email, username, password, captchaToken, captchaAnswer } = req.body || {};
    const rawEmail = (email || '').trim().toLowerCase();
    email = normalizeEmail(rawEmail);
    username = (username || '').trim();

    // Anti-spam: a CAPTCHA is always required to register.
    if (!verifyCaptcha(captchaToken, captchaAnswer)) {
      return res.status(400).json({ error: 'Please complete the captcha to continue.', captchaRequired: true });
    }

    // Anti-spam: limit registrations per IP.
    const ipLimit = rateLimit(`register:${clientIp(req)}`, config.registerMaxPerHourPerIp, 3600 * 1000);
    if (!ipLimit.ok) {
      return res
        .status(429)
        .json({ error: 'Too many sign-ups from your network. Please try again later.', captchaRequired: true });
    }

    if (!EMAIL_RE.test(email)) throw new ApiError(400, 'Enter a valid email address.');
    if (username.length < 2) throw new ApiError(400, 'Username must be at least 2 characters.');
    if (username.length > 80) throw new ApiError(400, 'Username is too long.');
    if ((password || '').length < 6) throw new ApiError(400, 'Password must be at least 6 characters.');

    // Real-email check: reject disposable/temporary domains and non-deliverable domains.
    const emailCheck = await validateRealEmail(email);
    if (!emailCheck.ok) throw new ApiError(400, emailCheck.reason);

    const [existing] = await pool.query('SELECT email, username FROM users WHERE email = ? OR username = ?', [
      email,
      username,
    ]);
    if (existing.some((u) => u.email === email)) throw new ApiError(409, 'An account with that email already exists.');
    if (existing.some((u) => (u.username || '').toLowerCase() === username.toLowerCase())) {
      throw new ApiError(409, 'That username is already taken.');
    }

    const role = email === OWNER_EMAIL ? 'owner' : 'user';
    const passwordHash = await hashPassword(password);
    const needVerify = verificationActive() && email !== OWNER_EMAIL;
    const [result] = await pool.query(
      'INSERT INTO users (email, username, password_hash, role, email_verified) VALUES (?, ?, ?, ?, ?)',
      [email, username, passwordHash, role, needVerify ? 0 : 1],
    );

    if (needVerify) {
      await sendVerification(result.insertId, email);
      return res.status(201).json({
        verifyRequired: true,
        email,
        message: 'Account created! Check your email for a verification link to activate your account.',
      });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    const user = publicUser(rows[0]);
    res.status(201).json({ token: signToken(user), user });
  }),
);

// Verify an email using the token from the verification link. Logs the user in.
authRoutes.post(
  '/verify',
  asyncHandler(async (req, res) => {
    const token = req.body?.token || '';
    const [rows] = await pool.query(
      'SELECT * FROM email_verifications WHERE token_hash = ? AND used = 0 AND expires_at > NOW()',
      [sha256(token)],
    );
    if (!rows.length) throw new ApiError(400, 'This verification link is invalid or has expired.');
    const record = rows[0];
    await pool.query('UPDATE users SET email_verified = 1 WHERE id = ?', [record.user_id]);
    await pool.query('UPDATE email_verifications SET used = 1 WHERE id = ?', [record.id]);
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [record.user_id]);
    const user = publicUser(users[0]);
    res.json({ token: signToken(user), user });
  }),
);

// Resend a verification email (rate-limited, no account enumeration).
authRoutes.post(
  '/resend-verification',
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body?.email || '');
    const ipLimit = rateLimit(`resend:${clientIp(req)}`, 5, 3600 * 1000);
    const emailLimit = rateLimit(`resend-email:${email}`, 3, 3600 * 1000);
    if (email && EMAIL_RE.test(email) && ipLimit.ok && emailLimit.ok && verificationActive()) {
      const [rows] = await pool.query('SELECT id, email_verified FROM users WHERE email = ?', [email]);
      if (rows.length && !rows[0].email_verified) {
        await sendVerification(rows[0].id, email);
      }
    }
    res.json({ ok: true, message: 'If that account exists and is unverified, a new link is on its way.' });
  }),
);

// Returns a fresh CAPTCHA challenge for the login form.
authRoutes.get('/captcha', (_req, res) => {
  res.json(createCaptcha());
});

authRoutes.post(
  '/login',
  asyncHandler(async (req, res) => {
    let { email, password, captchaToken, captchaAnswer } = req.body || {};
    email = normalizeEmail(email);

    // After repeated failures, a CAPTCHA is required before checking credentials.
    if (failCount(email) >= LOGIN_CAPTCHA_THRESHOLD && !verifyCaptcha(captchaToken, captchaAnswer)) {
      return res.status(400).json({ error: 'Please complete the captcha to continue.', captchaRequired: true });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      bumpFail(email);
      return res
        .status(401)
        .json({ error: 'No account found with that email.', captchaRequired: failCount(email) >= LOGIN_CAPTCHA_THRESHOLD });
    }

    const row = rows[0];
    const ok = row.password_hash ? await verifyPassword(password || '', row.password_hash) : false;
    if (!ok) {
      bumpFail(email);
      return res
        .status(401)
        .json({ error: 'Incorrect password.', captchaRequired: failCount(email) >= LOGIN_CAPTCHA_THRESHOLD });
    }

    // Block sign-in until the email is verified (email accounts only).
    if (verificationActive() && row.email && !row.email_verified && email !== OWNER_EMAIL) {
      return res.status(403).json({
        error: 'Please verify your email first. Check your inbox for the verification link.',
        verifyRequired: true,
        email,
      });
    }

    clearFail(email);

    // Guarantee the configured owner email always keeps owner privileges.
    if (email === OWNER_EMAIL && row.role !== 'owner') {
      await pool.query('UPDATE users SET role = ? WHERE id = ?', ['owner', row.id]);
      row.role = 'owner';
    }

    const user = publicUser(row);
    res.json({ token: signToken(user), user });
  }),
);

authRoutes.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) throw new ApiError(404, 'Account not found.');
    res.json({ user: publicUser(rows[0]) });
  }),
);

// Change password (logged in): requires the current password.
authRoutes.post(
  '/password',
  requireAuth,
  asyncHandler(async (req, res) => {
    const currentPassword = req.body?.currentPassword || '';
    const newPassword = req.body?.newPassword || '';
    if (newPassword.length < 6) throw new ApiError(400, 'New password must be at least 6 characters.');
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) throw new ApiError(404, 'Account not found.');
    const ok = await verifyPassword(currentPassword, rows[0].password_hash);
    if (!ok) throw new ApiError(400, 'Your current password is incorrect.');
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [await hashPassword(newPassword), req.user.id]);
    res.json({ ok: true });
  }),
);

// Forgot password: emails a reset link. Always responds ok (no account enumeration).
authRoutes.post(
  '/forgot',
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body?.email || '');
    // Anti email-bomb: cap reset emails per IP and per target address.
    const ipLimit = rateLimit(`forgot:${clientIp(req)}`, 5, 3600 * 1000);
    const emailLimit = rateLimit(`forgot-email:${email}`, 3, 3600 * 1000);
    if (EMAIL_RE.test(email) && ipLimit.ok && emailLimit.ok) {
      const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (rows.length) {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        await pool.query('INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [
          rows[0].id,
          sha256(token),
          expires,
        ]);
        const link = `${config.appUrl}/?reset=${token}`;
        try {
          await sendPasswordResetEmail({ email, link });
        } catch (err) {
          console.error('[auth] reset email failed:', err.message);
        }
      }
    }
    res.json({ ok: true });
  }),
);

// Reset password with a token from the emailed link.
authRoutes.post(
  '/reset',
  asyncHandler(async (req, res) => {
    const token = req.body?.token || '';
    const password = req.body?.password || '';
    if (password.length < 6) throw new ApiError(400, 'New password must be at least 6 characters.');
    const [rows] = await pool.query(
      'SELECT * FROM password_resets WHERE token_hash = ? AND used = 0 AND expires_at > NOW()',
      [sha256(token)],
    );
    if (!rows.length) throw new ApiError(400, 'This reset link is invalid or has expired.');
    const reset = rows[0];
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [await hashPassword(password), reset.user_id]);
    await pool.query('UPDATE password_resets SET used = 1 WHERE id = ?', [reset.id]);
    res.json({ ok: true });
  }),
);

// --- Steam OpenID login / linking ---
function steamRealm(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  return `${proto}://${req.get('host')}`;
}

// Start Steam login (creates/logs into a Steam account).
authRoutes.get('/steam', (req, res) => {
  const realm = steamRealm(req);
  res.redirect(buildSteamLoginUrl(realm, `${realm}/api/auth/steam/return`));
});

// Get a Steam link URL for the logged-in user (attach Steam to this account).
authRoutes.get(
  '/steam/link-url',
  requireAuth,
  asyncHandler(async (req, res) => {
    const realm = steamRealm(req);
    const state = jwt.sign({ link: true, userId: req.user.id }, config.jwtSecret, { expiresIn: '15m' });
    const returnTo = `${realm}/api/auth/steam/return?state=${encodeURIComponent(state)}`;
    res.json({ url: buildSteamLoginUrl(realm, returnTo) });
  }),
);

// Unlink Steam (only if the account still has email + password to log in with).
authRoutes.post(
  '/steam/unlink',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const u = rows[0];
    if (!u.steam_id) throw new ApiError(400, 'No Steam account is linked.');
    if (!u.email || !u.password_hash) {
      throw new ApiError(400, 'Add an email & password before unlinking Steam, so you can still log in.');
    }
    await pool.query('UPDATE users SET steam_id = NULL, steam_persona = NULL, steam_avatar = NULL WHERE id = ?', [u.id]);
    const [n] = await pool.query('SELECT * FROM users WHERE id = ?', [u.id]);
    res.json({ user: publicUser(n[0]) });
  }),
);

authRoutes.get(
  '/steam/return',
  asyncHandler(async (req, res) => {
    // Link mode when a valid signed state is present.
    let linkUserId = null;
    if (req.query.state) {
      try {
        const s = jwt.verify(req.query.state, config.jwtSecret);
        if (s.link) linkUserId = s.userId;
      } catch {
        /* fall through to login mode */
      }
    }

    const steamId = await verifySteamAssertion(req.query);
    if (!steamId) return res.redirect(`${config.appUrl}/?steam_error=1`);
    const profile = await fetchSteamProfile(steamId);

    if (linkUserId) {
      const [used] = await pool.query('SELECT id FROM users WHERE steam_id = ?', [steamId]);
      if (used.length && used[0].id !== linkUserId) {
        return res.redirect(`${config.appUrl}/?steam_error=inuse`);
      }
      await pool.query('UPDATE users SET steam_id = ?, steam_persona = ?, steam_avatar = ? WHERE id = ?', [
        steamId,
        profile?.name || null,
        profile?.avatar || null,
        linkUserId,
      ]);
      return res.redirect(`${config.appUrl}/?steam=linked`);
    }

    let [rows] = await pool.query('SELECT * FROM users WHERE steam_id = ?', [steamId]);
    let user = rows[0];
    if (!user) {
      const base = (profile?.name || `steam_${steamId.slice(-6)}`).replace(/[^\w .-]/g, '').trim();
      const username = await uniqueUsername(base || `steam_${steamId.slice(-6)}`);
      const [result] = await pool.query(
        "INSERT INTO users (email, username, password_hash, role, steam_id, steam_persona, steam_avatar, avatar_url) VALUES (NULL, ?, NULL, 'user', ?, ?, ?, ?)",
        [username, steamId, profile?.name || null, profile?.avatar || null, profile?.avatar || null],
      );
      [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = rows[0];
    } else {
      await pool.query('UPDATE users SET steam_persona = ?, steam_avatar = ? WHERE id = ?', [
        profile?.name || null,
        profile?.avatar || null,
        user.id,
      ]);
    }

    const token = signToken(publicUser(user));
    res.redirect(`${config.appUrl}/?token=${encodeURIComponent(token)}`);
  }),
);

// Change username (email cannot be changed). Reissues the token so it stays in sync.
authRoutes.post(
  '/username',
  requireAuth,
  asyncHandler(async (req, res) => {
    const username = (req.body?.username || '').trim();
    if (username.length < 2) throw new ApiError(400, 'Username must be at least 2 characters.');
    if (username.length > 80) throw new ApiError(400, 'Username is too long.');
    const [ex] = await pool.query('SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id <> ?', [
      username,
      req.user.id,
    ]);
    if (ex.length) throw new ApiError(409, 'That username is already taken.');
    await pool.query('UPDATE users SET username = ? WHERE id = ?', [username, req.user.id]);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = publicUser(rows[0]);
    res.json({ user, token: signToken(user) });
  }),
);

// Set email + password for a Steam-only account. Email is immutable once set.
authRoutes.post(
  '/credentials',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const u = rows[0];
    if (u.email) throw new ApiError(400, 'Your email is already set and cannot be changed.');
    const email = normalizeEmail(req.body?.email || '');
    const password = req.body?.password || '';
    if (!EMAIL_RE.test(email)) throw new ApiError(400, 'Enter a valid email address.');
    if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters.');
    const [taken] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (taken.length) throw new ApiError(409, 'That email is already in use.');
    await pool.query('UPDATE users SET email = ?, password_hash = ? WHERE id = ?', [
      email,
      await hashPassword(password),
      u.id,
    ]);
    const [n] = await pool.query('SELECT * FROM users WHERE id = ?', [u.id]);
    const user = publicUser(n[0]);
    res.json({ user, token: signToken(user) });
  }),
);

// Set or clear the current user's profile image.
authRoutes.post(
  '/avatar',
  requireAuth,
  asyncHandler(async (req, res) => {
    const url = (req.body?.url || '').trim();
    if (url && !/^https?:\/\/\S+$/i.test(url) && !url.startsWith('/uploads/')) {
      throw new ApiError(400, 'Invalid image URL.');
    }
    if (url.length > 500) throw new ApiError(400, 'Image URL is too long.');
    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [url || null, req.user.id]);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    res.json({ user: publicUser(rows[0]) });
  }),
);

// Upload a profile image to ImgBB and save the hosted URL.
authRoutes.post('/avatar/upload', requireAuth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return next(new ApiError(400, err.message));
    if (!req.file) return next(new ApiError(400, 'No image uploaded.'));
    uploadToImgbb(req.file.buffer)
      .then(async (url) => {
        await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [url, req.user.id]);
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        res.json({ user: publicUser(rows[0]) });
      })
      .catch((e) => next(new ApiError(400, e.message)));
  });
});

// Profile: the current user's account plus contribution stats.
authRoutes.get(
  '/profile',
  requireAuth,
  asyncHandler(async (req, res) => {
    const uid = req.user.id;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [uid]);
    if (!rows.length) throw new ApiError(404, 'Account not found.');

    const [[{ nadesTotal }]] = await pool.query('SELECT COUNT(*) AS nadesTotal FROM nades WHERE author_id = ?', [uid]);
    const [[{ nadesApproved }]] = await pool.query(
      "SELECT COUNT(*) AS nadesApproved FROM nades WHERE author_id = ? AND status = 'approved'",
      [uid],
    );
    const [[{ nadesPending }]] = await pool.query(
      "SELECT COUNT(*) AS nadesPending FROM nades WHERE author_id = ? AND status = 'pending'",
      [uid],
    );
    const [[{ recommendations }]] = await pool.query(
      'SELECT COUNT(*) AS recommendations FROM command_recommendations WHERE user_id = ?',
      [uid],
    );
    const [[{ comments }]] = await pool.query('SELECT COUNT(*) AS comments FROM command_comments WHERE user_id = ?', [uid]);

    res.json({
      user: publicUser(rows[0]),
      stats: {
        nadesTotal: Number(nadesTotal),
        nadesApproved: Number(nadesApproved),
        nadesPending: Number(nadesPending),
        recommendations: Number(recommendations),
        comments: Number(comments),
      },
    });
  }),
);
