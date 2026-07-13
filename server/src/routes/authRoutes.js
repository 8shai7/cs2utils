import { Router } from 'express';
import { pool } from '../db.js';
import { config } from '../config.js';
import { hashPassword, verifyPassword, signToken, publicUser, requireAuth, normalizeEmail } from '../auth.js';
import { asyncHandler, ApiError, EMAIL_RE } from '../util.js';

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
