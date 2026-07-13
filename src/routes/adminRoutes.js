import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireAdmin, requireOwner, publicUser } from '../auth.js';
import { asyncHandler, ApiError } from '../util.js';
import { withMedia } from './nadesRoutes.js';
import { syncFromSource, checkCs2Build, importCommands } from '../commandsSync.js';
import { syncPros, importPros } from '../proSettings.js';
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

// Manually sync pro-player settings from the configured source (or HLTV).
adminRoutes.post(
  '/pros/sync',
  asyncHandler(async (_req, res) => {
    res.json(await syncPros({ force: true }));
  }),
);

// Browser-assisted imports: the admin passes the site's bot check in their own
// browser, then pastes the page content here for the server to parse.
adminRoutes.post(
  '/commands/import',
  asyncHandler(async (req, res) => {
    try {
      res.json(await importCommands(req.body?.content));
    } catch (err) {
      throw new ApiError(400, err.message);
    }
  }),
);

adminRoutes.post(
  '/pros/import',
  asyncHandler(async (req, res) => {
    try {
      res.json(await importPros(req.body?.content));
    } catch (err) {
      throw new ApiError(400, err.message);
    }
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

// Bulk approve/reject nades (must be registered before /nades/:id/review).
adminRoutes.post(
  '/nades/review-bulk',
  asyncHandler(async (req, res) => {
    const decision = req.body?.decision;
    if (decision !== 'approved' && decision !== 'rejected') throw new ApiError(400, 'Invalid decision.');
    const note = (req.body?.note || '').slice(0, 255);
    const ids = Array.isArray(req.body?.ids)
      ? [...new Set(req.body.ids.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))]
      : [];
    if (!ids.length) throw new ApiError(400, 'Select at least one nade.');
    if (ids.length > 1000) throw new ApiError(400, 'Too many nades (max 1000).');

    const placeholders = ids.map(() => '?').join(',');
    const [result] = await pool.query(
      `UPDATE nades SET status = ?, reviewed_by = ?, review_note = ? WHERE id IN (${placeholders}) AND status = 'pending'`,
      [decision, req.user.username, note || null, ...ids],
    );
    if (decision === 'approved') {
      await pool.query(
        `UPDATE nade_media SET status = 'approved' WHERE status = 'pending' AND nade_id IN (${placeholders})`,
        ids,
      );
    }
    res.json({ ok: true, updated: result.affectedRows || 0 });
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
  '/media/review-bulk',
  asyncHandler(async (req, res) => {
    const decision = req.body?.decision;
    if (decision !== 'approved' && decision !== 'rejected') throw new ApiError(400, 'Invalid decision.');
    const ids = Array.isArray(req.body?.ids)
      ? [...new Set(req.body.ids.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))]
      : [];
    if (!ids.length) throw new ApiError(400, 'Select at least one media item.');
    if (ids.length > 1000) throw new ApiError(400, 'Too many media items (max 1000).');

    const placeholders = ids.map(() => '?').join(',');
    const [result] = await pool.query(
      `UPDATE nade_media SET status = ? WHERE id IN (${placeholders}) AND status = 'pending'`,
      [decision, ...ids],
    );
    res.json({ ok: true, updated: result.affectedRows || 0 });
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

// Contact form submissions (admin view).
adminRoutes.get(
  '/contact',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 200');
    res.json({ messages: rows });
  }),
);

const PERMANENT_UNTIL = '9999-12-31 23:59:59';

// Ban a user for a number of hours, or permanently. Owner cannot be banned.
adminRoutes.post(
  '/users/:id/ban',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'User not found.');
    if (rows[0].role === 'owner') throw new ApiError(400, 'The owner cannot be banned.');

    const permanent = Boolean(req.body?.permanent);
    let until;
    if (permanent) {
      until = PERMANENT_UNTIL;
    } else {
      const hours = Number(req.body?.hours);
      if (!Number.isFinite(hours) || hours <= 0) throw new ApiError(400, 'Provide a positive ban duration in hours, or set permanent.');
      until = new Date(Date.now() + hours * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
    }
    await pool.query('UPDATE users SET banned_until = ? WHERE id = ?', [until, req.params.id]);
    const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json({ user: publicUser(updated[0]) });
  }),
);

adminRoutes.post(
  '/users/:id/unban',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'User not found.');
    await pool.query('UPDATE users SET banned_until = NULL WHERE id = ?', [req.params.id]);
    const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json({ user: publicUser(updated[0]) });
  }),
);

// --- Highlight report moderation ---
adminRoutes.get(
  '/highlights/reports',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query(
      `SELECT h.id, h.title, h.description, h.url, h.author_id, u.username AS author_name, h.created_at,
              r.id AS report_id, r.reason, r.reporter_name, r.created_at AS reported_at
       FROM highlight_reports r
       JOIN highlights h ON h.id = r.highlight_id
       JOIN users u ON u.id = h.author_id
       WHERE r.status = 'open'
       ORDER BY h.id, r.created_at ASC`,
    );
    const byHighlight = new Map();
    for (const row of rows) {
      if (!byHighlight.has(row.id)) {
        byHighlight.set(row.id, {
          id: row.id,
          title: row.title,
          description: row.description || '',
          url: row.url,
          authorId: row.author_id,
          authorName: row.author_name,
          createdAt: row.created_at,
          reports: [],
        });
      }
      byHighlight.get(row.id).reports.push({
        id: row.report_id,
        reason: row.reason || '',
        reporterName: row.reporter_name,
        reportedAt: row.reported_at,
      });
    }
    res.json({ highlights: [...byHighlight.values()] });
  }),
);

adminRoutes.get(
  '/highlights/reports/count',
  asyncHandler(async (_req, res) => {
    const [[{ count }]] = await pool.query(
      "SELECT COUNT(DISTINCT highlight_id) AS count FROM highlight_reports WHERE status = 'open'",
    );
    res.json({ count: Number(count) });
  }),
);

adminRoutes.post(
  '/highlights/:id/review',
  asyncHandler(async (req, res) => {
    const decision = req.body?.decision;
    if (decision !== 'keep' && decision !== 'delete') throw new ApiError(400, 'Invalid decision.');
    if (decision === 'delete') {
      await pool.query('DELETE FROM highlights WHERE id = ?', [req.params.id]);
    } else {
      await pool.query("UPDATE highlight_reports SET status = 'reviewed' WHERE highlight_id = ?", [req.params.id]);
    }
    res.json({ ok: true });
  }),
);
