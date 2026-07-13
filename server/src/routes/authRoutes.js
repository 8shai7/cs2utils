import { Router } from 'express';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { pool } from '../db.js';
import { config } from '../config.js';
import { hashPassword, verifyPassword, signToken, publicUser, requireAuth, normalizeEmail } from '../auth.js';
import { asyncHandler, ApiError, EMAIL_RE } from '../util.js';
import { uploadToImgbb } from '../imgbb.js';
import { sendPasswordResetEmail } from '../mailer.js';
import { buildSteamLoginUrl, verifySteamAssertion, fetchSteamProfile } from '../steam.js';

const sha256 = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

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
    let { email, username, password } = req.body || {};
    const rawEmail = (email || '').trim().toLowerCase();
    email = normalizeEmail(rawEmail);
    username = (username || '').trim();

    if (!EMAIL_RE.test(email)) throw new ApiError(400, 'Enter a valid email address.');
    if (username.length < 2) throw new ApiError(400, 'Username must be at least 2 characters.');
    if ((password || '').length < 6) throw new ApiError(400, 'Password must be at least 6 characters.');

    const [existing] = await pool.query('SELECT email, username FROM users WHERE email = ? OR username = ?', [
      email,
      username,
    ]);
    if (existing.some((u) => u.email === email)) throw new ApiError(409, 'An account with that email already exists.');
    if (existing.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      throw new ApiError(409, 'That username is already taken.');
    }

    const role = email === OWNER_EMAIL ? 'owner' : 'user';
    const passwordHash = await hashPassword(password);
    const [result] = await pool.query(
      'INSERT INTO users (email, username, password_hash, role) VALUES (?, ?, ?, ?)',
      [email, username, passwordHash, role],
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    const user = publicUser(rows[0]);
    res.status(201).json({ token: signToken(user), user });
  }),
);

authRoutes.post(
  '/login',
  asyncHandler(async (req, res) => {
    let { email, password } = req.body || {};
    email = normalizeEmail(email);

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) throw new ApiError(401, 'No account found with that email.');

    const row = rows[0];
    const ok = await verifyPassword(password || '', row.password_hash);
    if (!ok) throw new ApiError(401, 'Incorrect password.');

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
    if (EMAIL_RE.test(email)) {
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
