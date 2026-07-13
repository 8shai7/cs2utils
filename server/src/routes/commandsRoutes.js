import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, optionalAuth } from '../auth.js';
import { asyncHandler, ApiError } from '../util.js';
import { getCatalog } from '../commandsSync.js';

export const commandsRoutes = Router();

const KEY_RE = /^[a-z0-9-]{2,64}$/;

function assertKey(key) {
  if (!KEY_RE.test(key || '')) throw new ApiError(400, 'Invalid command id.');
}

// The catalog itself (auto-synced from the seed or remote source).
commandsRoutes.get(
  '/catalog',
  asyncHandler(async (_req, res) => {
    res.json(await getCatalog());
  }),
);

// Social data for the whole catalog: recommend counts, the caller's own
// recommendations, and approved comments grouped by command key.
commandsRoutes.get(
  '/social',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const [countRows] = await pool.query(
      'SELECT command_key, COUNT(*) AS count FROM command_recommendations GROUP BY command_key',
    );
    const counts = {};
    for (const r of countRows) counts[r.command_key] = Number(r.count);

    let mine = [];
    if (req.user) {
      const [mineRows] = await pool.query(
        'SELECT command_key FROM command_recommendations WHERE user_id = ?',
        [req.user.id],
      );
      mine = mineRows.map((r) => r.command_key);
    }

    const [commentRows] = await pool.query(
      "SELECT id, command_key, username, body, created_at FROM command_comments WHERE status = 'approved' ORDER BY created_at DESC",
    );
    const comments = {};
    for (const c of commentRows) {
      if (!comments[c.command_key]) comments[c.command_key] = [];
      comments[c.command_key].push({ id: c.id, username: c.username, body: c.body, createdAt: c.created_at });
    }

    res.json({ counts, mine, comments });
  }),
);

// Toggle a recommendation for a command.
commandsRoutes.post(
  '/:key/recommend',
  requireAuth,
  asyncHandler(async (req, res) => {
    const key = req.params.key;
    assertKey(key);
    const [existing] = await pool.query(
      'SELECT id FROM command_recommendations WHERE command_key = ? AND user_id = ?',
      [key, req.user.id],
    );
    let recommended;
    if (existing.length) {
      await pool.query('DELETE FROM command_recommendations WHERE id = ?', [existing[0].id]);
      recommended = false;
    } else {
      await pool.query('INSERT INTO command_recommendations (command_key, user_id) VALUES (?, ?)', [
        key,
        req.user.id,
      ]);
      recommended = true;
    }
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM command_recommendations WHERE command_key = ?',
      [key],
    );
    res.json({ recommended, count: Number(count) });
  }),
);

// Add a comment on a command (enters review as pending).
commandsRoutes.post(
  '/:key/comments',
  requireAuth,
  asyncHandler(async (req, res) => {
    const key = req.params.key;
    assertKey(key);
    const body = (req.body?.body || '').trim();
    if (body.length < 2) throw new ApiError(400, 'Comment is too short.');
    if (body.length > 1000) throw new ApiError(400, 'Comment is too long (max 1000 characters).');
    await pool.query(
      "INSERT INTO command_comments (command_key, user_id, username, body, status) VALUES (?, ?, ?, ?, 'pending')",
      [key, req.user.id, req.user.username, body],
    );
    res.status(201).json({ ok: true, status: 'pending' });
  }),
);
