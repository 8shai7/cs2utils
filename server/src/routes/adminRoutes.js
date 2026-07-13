import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireAdmin, requireOwner, publicUser } from '../auth.js';
import { asyncHandler, ApiError } from '../util.js';
import { withMedia } from './nadesRoutes.js';
import { syncFromSource, checkCs2Build } from '../commandsSync.js';
import { getSettings, saveSettings } from '../settings.js';

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireAdmin);

const URL_OK = (u) => u === '' || /^https?:\/\/\S+$/i.test(u);

// Owner-only site settings (donate links). Visible to owner for editing.
adminRoutes.get(
  '/settings',
  requireOwner,
  asyncHandler(async (_req, res) => {
    res.json(await getSettings());
  }),
);

adminRoutes.post(
  '/settings',
  requireOwner,
  asyncHandler(async (req, res) => {
    const paypalUrl = (req.body?.paypalUrl || '').trim();
    const steamTradeUrl = (req.body?.steamTradeUrl || '').trim();
    if (!URL_OK(paypalUrl)) throw new ApiError(400, 'PayPal link must be a valid http(s) URL or empty.');
    if (!URL_OK(steamTradeUrl)) throw new ApiError(400, 'Steam trade link must be a valid http(s) URL or empty.');
    res.json(await saveSettings({ paypalUrl, steamTradeUrl }));
  }),
);

// Manually trigger a command-catalog sync from the configured remote source.
adminRoutes.post(
  '/commands/sync',
  asyncHandler(async (_req, res) => {
    const result = await syncFromSource({ force: true });
    res.json(result);
  }),
);

// Manually re-check the current CS2 build (and re-sync if it changed).
adminRoutes.post(
  '/commands/check-cs2',
  asyncHandler(async (_req, res) => {
    const result = await checkCs2Build({});
    res.json(result);
  }),
);

// Nades needing review: pending nades, or approved/rejected nades with pending media.
adminRoutes.get(
  '/nades/pending',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query(
      `SELECT DISTINCT n.*, u.username AS author_name
       FROM nades n
       JOIN users u ON u.id = n.author_id
       LEFT JOIN nade_media m ON m.nade_id = n.id
       WHERE n.status = 'pending' OR m.status = 'pending'
       ORDER BY n.created_at ASC`,
    );
    res.json({ nades: await withMedia(rows) });
  }),
);

adminRoutes.get(
  '/nades/pending/count',
  asyncHandler(async (_req, res) => {
    const [[{ nadeCount }]] = await pool.query(
      "SELECT COUNT(*) AS nadeCount FROM nades WHERE status = 'pending'",
    );
    const [[{ mediaCount }]] = await pool.query(
      "SELECT COUNT(*) AS mediaCount FROM nade_media WHERE status = 'pending'",
    );
    res.json({ count: Number(nadeCount) + Number(mediaCount) });
  }),
);

// --- Command comment moderation ---
adminRoutes.get(
  '/comments/pending',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query(
      "SELECT id, command_key, username, body, created_at FROM command_comments WHERE status = 'pending' ORDER BY created_at ASC",
    );
    res.json({
      comments: rows.map((c) => ({
        id: c.id,
        commandKey: c.command_key,
        username: c.username,
        body: c.body,
        createdAt: c.created_at,
      })),
    });
  }),
);

adminRoutes.get(
  '/comments/pending/count',
  asyncHandler(async (_req, res) => {
    const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM command_comments WHERE status = 'pending'");
    res.json({ count: Number(count) });
  }),
);

adminRoutes.post(
  '/comments/:id/review',
  asyncHandler(async (req, res) => {
    const decision = req.body?.decision;
    if (decision !== 'approved' && decision !== 'rejected') throw new ApiError(400, 'Invalid decision.');
    const [rows] = await pool.query('SELECT id FROM command_comments WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'Comment not found.');
    await pool.query('UPDATE command_comments SET status = ? WHERE id = ?', [decision, req.params.id]);
    res.json({ ok: true });
  }),
);

adminRoutes.post(
  '/nades/:id/review',
  asyncHandler(async (req, res) => {
    const decision = req.body?.decision;
    if (decision !== 'approved' && decision !== 'rejected') throw new ApiError(400, 'Invalid decision.');
    const note = (req.body?.note || '').slice(0, 255);

    const [rows] = await pool.query('SELECT * FROM nades WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'Nade not found.');

    await pool.query('UPDATE nades SET status = ?, reviewed_by = ?, review_note = ? WHERE id = ?', [
      decision,
      req.user.username,
      note || null,
      req.params.id,
    ]);
    if (decision === 'approved') {
      await pool.query("UPDATE nade_media SET status = 'approved' WHERE nade_id = ? AND status = 'pending'", [
        req.params.id,
      ]);
    }
    res.json({ ok: true });
  }),
);

adminRoutes.post(
  '/media/:mediaId/review',
  asyncHandler(async (req, res) => {
    const decision = req.body?.decision;
    if (decision !== 'approved' && decision !== 'rejected') throw new ApiError(400, 'Invalid decision.');
    const [rows] = await pool.query('SELECT * FROM nade_media WHERE id = ?', [req.params.mediaId]);
    if (!rows.length) throw new ApiError(404, 'Media not found.');
    await pool.query('UPDATE nade_media SET status = ? WHERE id = ?', [decision, req.params.mediaId]);
    res.json({ ok: true });
  }),
);

adminRoutes.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at ASC');
    res.json({ users: rows.map(publicUser) });
  }),
);

adminRoutes.post(
  '/users/:id/role',
  asyncHandler(async (req, res) => {
    const role = req.body?.role;
    if (role !== 'user' && role !== 'admin') throw new ApiError(400, 'Invalid role.');
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'User not found.');
    if (rows[0].role === 'owner') throw new ApiError(400, 'The owner role cannot be changed.');
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json({ user: publicUser(updated[0]) });
  }),
);
