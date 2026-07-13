import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { pool } from './db.js';

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, username: user.username, email: user.email },
    config.jwtSecret,
    { expiresIn: '30d' },
  );
}

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    role: row.role,
    createdAt: row.created_at,
    bannedUntil: row.banned_until || null,
  };
}

export function isAdminRole(role) {
  return role === 'admin' || role === 'owner';
}

/** Express middleware: require a valid bearer token; attaches req.user. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

/** Optional auth: attaches req.user if a valid token is present, else continues. */
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, config.jwtSecret);
    } catch {
      /* ignore invalid token for public routes */
    }
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || !isAdminRole(req.user.role)) {
    return res.status(403).json({ error: 'Admin privileges required.' });
  }
  next();
}

export function requireOwner(req, res, next) {
  if (!req.user || req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Owner privileges required.' });
  }
  next();
}

/** Block contribute actions for banned accounts (checks the DB for the live ban). */
export async function requireNotBanned(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT banned_until FROM users WHERE id = ?', [req.user.id]);
    const until = rows[0]?.banned_until;
    if (until && new Date(until).getTime() > Date.now()) {
      const isPerma = new Date(until).getFullYear() >= 9999;
      return res.status(403).json({
        error: isPerma
          ? 'Your account is permanently banned.'
          : `Your account is banned until ${new Date(until).toLocaleString()}.`,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}
