import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, optionalAuth, isAdminRole } from '../auth.js';
import { asyncHandler, ApiError } from '../util.js';

export const configsRoutes = Router();

const MAX_LEN = 50000;

function serialize(row, myRating) {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name,
    title: row.title,
    description: row.description || '',
    configText: row.config_text || '',
    videoText: row.video_text || '',
    hasConfig: Boolean(row.config_text && row.config_text.length),
    hasVideo: Boolean(row.video_text && row.video_text.length),
    avgRating: row.avg_rating != null ? Number(Number(row.avg_rating).toFixed(2)) : 0,
    ratingCount: Number(row.rating_count || 0),
    myRating: myRating || 0,
    createdAt: row.created_at,
  };
}

// Browse configs. sort=top (most rated) | new (last uploaded); q=search.
configsRoutes.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const sort = req.query.sort === 'new' ? 'new' : 'top';
    const q = (req.query.q || '').trim();
    const params = [];
    let where = '';
    if (q) {
      where = 'WHERE c.title LIKE ? OR c.description LIKE ? OR u.username LIKE ?';
      const like = `%${q}%`;
      params.push(like, like, like);
    }
    const order =
      sort === 'new'
        ? 'c.created_at DESC'
        : 'AVG(r.rating) DESC, COUNT(r.id) DESC, c.created_at DESC';

    const [rows] = await pool.query(
      `SELECT c.*, u.username AS author_name, AVG(r.rating) AS avg_rating, COUNT(r.id) AS rating_count
       FROM configs c
       JOIN users u ON u.id = c.author_id
       LEFT JOIN config_ratings r ON r.config_id = c.id
       ${where}
       GROUP BY c.id
       ORDER BY ${order}
       LIMIT 200`,
      params,
    );

    const mine = {};
    if (req.user && rows.length) {
      const ids = rows.map((r) => r.id);
      const [mr] = await pool.query(
        `SELECT config_id, rating FROM config_ratings WHERE user_id = ? AND config_id IN (${ids.map(() => '?').join(',')})`,
        [req.user.id, ...ids],
      );
      for (const m of mr) mine[m.config_id] = m.rating;
    }

    res.json({ configs: rows.map((r) => serialize(r, mine[r.id])) });
  }),
);

// Upload a config / video settings (public immediately).
configsRoutes.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const title = (req.body?.title || '').trim();
    const description = (req.body?.description || '').trim();
    const configText = String(req.body?.configText || '');
    const videoText = String(req.body?.videoText || '');

    if (title.length < 3) throw new ApiError(400, 'Give it a title (at least 3 characters).');
    if (!configText.trim() && !videoText.trim()) throw new ApiError(400, 'Add a config and/or video settings.');
    if (configText.length > MAX_LEN || videoText.length > MAX_LEN) throw new ApiError(400, 'Content is too large (50k char limit).');

    const [result] = await pool.query(
      'INSERT INTO configs (author_id, title, description, config_text, video_text) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, description || null, configText.trim() ? configText : null, videoText.trim() ? videoText : null],
    );
    const [rows] = await pool.query(
      'SELECT c.*, u.username AS author_name, NULL AS avg_rating, 0 AS rating_count FROM configs c JOIN users u ON u.id = c.author_id WHERE c.id = ?',
      [result.insertId],
    );
    res.status(201).json({ config: serialize(rows[0]) });
  }),
);

// Rate a config 1–5 (one rating per user; cannot rate your own).
configsRoutes.post(
  '/:id/rate',
  requireAuth,
  asyncHandler(async (req, res) => {
    const rating = Number(req.body?.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new ApiError(400, 'Rating must be 1–5.');
    const [rows] = await pool.query('SELECT author_id FROM configs WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'Config not found.');
    if (rows[0].author_id === req.user.id) throw new ApiError(400, 'You cannot rate your own config.');

    await pool.query(
      'INSERT INTO config_ratings (config_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)',
      [req.params.id, req.user.id, rating],
    );
    const [[agg]] = await pool.query('SELECT AVG(rating) AS avg, COUNT(*) AS cnt FROM config_ratings WHERE config_id = ?', [
      req.params.id,
    ]);
    res.json({
      avgRating: agg.avg != null ? Number(Number(agg.avg).toFixed(2)) : 0,
      ratingCount: Number(agg.cnt),
      myRating: rating,
    });
  }),
);

// Delete a config (author or admin).
configsRoutes.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT author_id FROM configs WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.json({ ok: true });
    if (rows[0].author_id !== req.user.id && !isAdminRole(req.user.role)) {
      throw new ApiError(403, 'You can only delete your own configs.');
    }
    await pool.query('DELETE FROM configs WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  }),
);
