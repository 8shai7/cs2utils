import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, optionalAuth, isAdminRole, requireNotBanned } from '../auth.js';
import { asyncHandler, ApiError } from '../util.js';

export const highlightsRoutes = Router();

const URL_RE = /^https?:\/\/\S+$/i;

function serialize(row) {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name,
    title: row.title,
    description: row.description || '',
    url: row.url,
    kind: row.kind,
    createdAt: row.created_at,
    reportedByMe: Boolean(row.reported_by_me),
  };
}

// Public list of highlights (newest first), optional search.
highlightsRoutes.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const q = (req.query.q || '').trim();
    const params = [];
    let mineJoin = '';
    if (req.user) {
      mineJoin = 'LEFT JOIN highlight_reports hr ON hr.highlight_id = h.id AND hr.reporter_id = ?';
      params.push(req.user.id);
    }
    let where = '';
    if (q) {
      where = 'WHERE h.title LIKE ? OR h.description LIKE ? OR u.username LIKE ?';
      const like = `%${q}%`;
      params.push(like, like, like);
    }
    const [rows] = await pool.query(
      `SELECT h.*, u.username AS author_name${req.user ? ', (hr.id IS NOT NULL) AS reported_by_me' : ''}
       FROM highlights h
       JOIN users u ON u.id = h.author_id
       ${mineJoin}
       ${where}
       ORDER BY h.created_at DESC
       LIMIT 200`,
      params,
    );
    res.json({ highlights: rows.map(serialize) });
  }),
);

// Upload a highlight (video URL).
highlightsRoutes.post(
  '/',
  requireAuth,
  requireNotBanned,
  asyncHandler(async (req, res) => {
    const title = (req.body?.title || '').trim();
    const description = (req.body?.description || '').trim();
    const url = (req.body?.url || '').trim();
    if (title.length < 3) throw new ApiError(400, 'Give your highlight a title (at least 3 characters).');
    if (!URL_RE.test(url)) throw new ApiError(400, 'Enter a valid video URL (YouTube, Medal, Streamable, .mp4, …).');

    const [result] = await pool.query(
      "INSERT INTO highlights (author_id, title, description, url, kind) VALUES (?, ?, ?, ?, 'video')",
      [req.user.id, title, description || null, url],
    );
    const [rows] = await pool.query(
      'SELECT h.*, u.username AS author_name FROM highlights h JOIN users u ON u.id = h.author_id WHERE h.id = ?',
      [result.insertId],
    );
    res.status(201).json({ highlight: serialize(rows[0]) });
  }),
);

// Report a highlight (one per user).
highlightsRoutes.post(
  '/:id/report',
  requireAuth,
  requireNotBanned,
  asyncHandler(async (req, res) => {
    const reason = (req.body?.reason || '').trim().slice(0, 500);
    const [rows] = await pool.query('SELECT id FROM highlights WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'Highlight not found.');
    await pool.query(
      "INSERT INTO highlight_reports (highlight_id, reporter_id, reporter_name, reason, status) VALUES (?, ?, ?, ?, 'open') ON DUPLICATE KEY UPDATE reason = VALUES(reason), status = 'open'",
      [req.params.id, req.user.id, req.user.username, reason || null],
    );
    res.status(201).json({ ok: true });
  }),
);

// Delete a highlight (author or admin).
highlightsRoutes.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT author_id FROM highlights WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.json({ ok: true });
    if (rows[0].author_id !== req.user.id && !isAdminRole(req.user.role)) {
      throw new ApiError(403, 'You can only delete your own highlights.');
    }
    await pool.query('DELETE FROM highlights WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  }),
);
