import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireAdmin, requireOwner, publicUser } from '../auth.js';
import { asyncHandler, ApiError } from '../util.js';
import { withMedia } from './nadesRoutes.js';
import { syncFromSource, checkCs2Build, importCommands } from '../commandsSync.js';
import { syncPros, importPros } from '../proSettings.js';
import { getSettings, saveSettings } from '../settings.js';
import { writeOwnerLog, listOwnerLogs } from '../ownerLog.js';

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireAdmin);

const URL_OK = (u) => u === '' || /^https?:\/\/\S+$/i.test(u);

// Owner-only audit log (moderation / admin actions).
adminRoutes.get(
  '/owner-logs',
  requireOwner,
  asyncHandler(async (req, res) => {
    const limit = Number(req.query?.limit) || 100;
    const offset = Number(req.query?.offset) || 0;
    const action = (req.query?.action || '').trim();
    res.json(await listOwnerLogs({ limit, offset, action }));
  }),
);

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
    const settings = await saveSettings({ paypalUrl, steamTradeUrl });
    await writeOwnerLog({
      actor: req.user,
      action: 'settings.save',
      entityType: 'settings',
      summary: 'Updated site donate links',
      detail: { paypalUrl: Boolean(paypalUrl), steamTradeUrl: Boolean(steamTradeUrl) },
    });
    res.json(settings);
  }),
);

// Manually trigger a command-catalog sync from the configured remote source.
adminRoutes.post(
  '/commands/sync',
  asyncHandler(async (req, res) => {
    const result = await syncFromSource({ force: true });
    await writeOwnerLog({
      actor: req.user,
      action: 'commands.sync',
      entityType: 'commands',
      summary: result.synced ? `Synced commands catalog (${result.count ?? '?'})` : `Commands sync: ${result.reason || 'no change'}`,
      detail: result,
    });
    res.json(result);
  }),
);

// Manually re-check the current CS2 build (and re-sync if it changed).
adminRoutes.post(
  '/commands/check-cs2',
  asyncHandler(async (req, res) => {
    const result = await checkCs2Build({});
    await writeOwnerLog({
      actor: req.user,
      action: 'commands.check_cs2',
      entityType: 'commands',
      summary: `Checked CS2 build ${result.build || '?'}${result.changed ? ' (changed)' : ''}`,
      detail: result,
    });
    res.json(result);
  }),
);

// Manually sync pro-player settings from the configured source (or HLTV).
adminRoutes.post(
  '/pros/sync',
  asyncHandler(async (req, res) => {
    const result = await syncPros({ force: true });
    await writeOwnerLog({
      actor: req.user,
      action: 'pros.sync',
      entityType: 'pros',
      summary: result.synced ? `Synced ${result.count ?? '?'} pros from ${result.source || '?'}` : `Pros sync failed: ${result.reason || 'unknown'}`,
      detail: result,
    });
    res.json(result);
  }),
);

// Browser-assisted imports: the admin passes the site's bot check in their own
// browser, then pastes the page content here for the server to parse.
adminRoutes.post(
  '/commands/import',
  asyncHandler(async (req, res) => {
    try {
      const result = await importCommands(req.body?.content);
      await writeOwnerLog({
        actor: req.user,
        action: 'commands.import',
        entityType: 'commands',
        summary: `Imported ${result.count ?? '?'} commands`,
        detail: { count: result.count },
      });
      res.json(result);
    } catch (err) {
      throw new ApiError(400, err.message);
    }
  }),
);

adminRoutes.post(
  '/pros/import',
  asyncHandler(async (req, res) => {
    try {
      const result = await importPros(req.body?.content);
      await writeOwnerLog({
        actor: req.user,
        action: 'pros.import',
        entityType: 'pros',
        summary: `Imported ${result.count ?? '?'} pro players`,
        detail: { count: result.count },
      });
      res.json(result);
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
      `SELECT DISTINCT n.*, u.username AS author_name, COALESCE(NULLIF(u.avatar_url, ''), u.steam_avatar) AS author_avatar
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
    const [rows] = await pool.query('SELECT id, command_key, username, body FROM command_comments WHERE id = ?', [
      req.params.id,
    ]);
    if (!rows.length) throw new ApiError(404, 'Comment not found.');
    await pool.query('UPDATE command_comments SET status = ? WHERE id = ?', [decision, req.params.id]);
    const c = rows[0];
    await writeOwnerLog({
      actor: req.user,
      action: `comment.${decision === 'approved' ? 'approve' : 'reject'}`,
      entityType: 'comment',
      entityId: c.id,
      summary: `${decision === 'approved' ? 'Approved' : 'Rejected'} comment by ${c.username} on ${c.command_key}`,
      detail: { body: String(c.body || '').slice(0, 200) },
    });
    res.json({ ok: true });
  }),
);

// Hard-delete a comment (any status, including approved).
adminRoutes.delete(
  '/comments/:id',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      'SELECT id, command_key, username, body, status FROM command_comments WHERE id = ?',
      [req.params.id],
    );
    if (!rows.length) return res.json({ ok: true });
    const c = rows[0];
    await pool.query('DELETE FROM command_comments WHERE id = ?', [req.params.id]);
    await writeOwnerLog({
      actor: req.user,
      action: 'comment.delete',
      entityType: 'comment',
      entityId: c.id,
      summary: `Deleted comment by ${c.username} on ${c.command_key} (was ${c.status})`,
      detail: { body: String(c.body || '').slice(0, 200), status: c.status },
    });
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
    const updated = result.affectedRows || 0;
    await writeOwnerLog({
      actor: req.user,
      action: `nade.bulk_${decision === 'approved' ? 'approve' : 'reject'}`,
      entityType: 'nade',
      summary: `Bulk ${decision} ${updated} nade${updated === 1 ? '' : 's'}`,
      detail: { ids, updated, note: note || null },
    });
    res.json({ ok: true, updated });
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
    const nade = rows[0];
    await writeOwnerLog({
      actor: req.user,
      action: `nade.${decision === 'approved' ? 'approve' : 'reject'}`,
      entityType: 'nade',
      entityId: nade.id,
      summary: `${decision === 'approved' ? 'Approved' : 'Rejected'} nade “${nade.title}” (${nade.map}/${nade.type})`,
      detail: { note: note || null, previousStatus: nade.status },
    });
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
    const updated = result.affectedRows || 0;
    await writeOwnerLog({
      actor: req.user,
      action: `media.bulk_${decision === 'approved' ? 'approve' : 'reject'}`,
      entityType: 'media',
      summary: `Bulk ${decision} ${updated} media item${updated === 1 ? '' : 's'}`,
      detail: { ids, updated },
    });
    res.json({ ok: true, updated });
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
    const media = rows[0];
    await writeOwnerLog({
      actor: req.user,
      action: `media.${decision === 'approved' ? 'approve' : 'reject'}`,
      entityType: 'media',
      entityId: media.id,
      summary: `${decision === 'approved' ? 'Approved' : 'Rejected'} media #${media.id} on nade #${media.nade_id}`,
      detail: { nadeId: media.nade_id, kind: media.kind, previousStatus: media.status },
    });
    res.json({ ok: true });
  }),
);

// Hard-delete media (any status, including approved).
adminRoutes.delete(
  '/media/:mediaId',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT id, nade_id, kind, status FROM nade_media WHERE id = ?', [
      req.params.mediaId,
    ]);
    if (!rows.length) return res.json({ ok: true });
    const media = rows[0];
    await pool.query('DELETE FROM nade_media WHERE id = ?', [req.params.mediaId]);
    await writeOwnerLog({
      actor: req.user,
      action: 'media.delete',
      entityType: 'media',
      entityId: media.id,
      summary: `Deleted media #${media.id} on nade #${media.nade_id} (was ${media.status})`,
      detail: { nadeId: media.nade_id, kind: media.kind, status: media.status },
    });
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
  requireOwner,
  asyncHandler(async (req, res) => {
    const role = req.body?.role;
    if (role !== 'user' && role !== 'admin') throw new ApiError(400, 'Invalid role.');
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'User not found.');
    if (rows[0].role === 'owner') throw new ApiError(400, 'The owner role cannot be changed.');
    if (Number(rows[0].id) === Number(req.user.id)) throw new ApiError(400, 'You cannot change your own role.');
    const previous = rows[0].role;
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    await writeOwnerLog({
      actor: req.user,
      action: 'user.role',
      entityType: 'user',
      entityId: updated[0].id,
      summary: `${role === 'admin' ? 'Promoted' : 'Demoted'} ${updated[0].username} (${previous} → ${role})`,
      detail: { previous, role },
    });
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

adminRoutes.delete(
  '/contact/:id',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT id, name, email, subject FROM contact_messages WHERE id = ?', [
      req.params.id,
    ]);
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    if (rows.length) {
      await writeOwnerLog({
        actor: req.user,
        action: 'contact.delete',
        entityType: 'contact',
        entityId: rows[0].id,
        summary: `Deleted contact message from ${rows[0].name} <${rows[0].email}>`,
        detail: { subject: rows[0].subject || '' },
      });
    }
    res.json({ ok: true });
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
    await writeOwnerLog({
      actor: req.user,
      action: 'user.ban',
      entityType: 'user',
      entityId: updated[0].id,
      summary: permanent
        ? `Permanently banned ${rows[0].username}`
        : `Banned ${rows[0].username} until ${until}`,
      detail: { permanent, until, hours: permanent ? null : Number(req.body?.hours) },
    });
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
    await writeOwnerLog({
      actor: req.user,
      action: 'user.unban',
      entityType: 'user',
      entityId: updated[0].id,
      summary: `Unbanned ${updated[0].username}`,
    });
    res.json({ user: publicUser(updated[0]) });
  }),
);

// --- Highlight report moderation ---
adminRoutes.get(
  '/highlights/reports',
  asyncHandler(async (_req, res) => {
    const [rows] = await pool.query(
      `SELECT h.id, h.title, h.description, h.url, h.author_id, u.username AS author_name, COALESCE(NULLIF(u.avatar_url, ''), u.steam_avatar) AS author_avatar, h.created_at,
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
          authorAvatar: row.author_avatar || null,
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
    const [rows] = await pool.query(
      `SELECT h.id, h.title, u.username AS author_name, COALESCE(NULLIF(u.avatar_url, ''), u.steam_avatar) AS author_avatar FROM highlights h JOIN users u ON u.id = h.author_id WHERE h.id = ?`,
      [req.params.id],
    );
    if (decision === 'delete') {
      await pool.query('DELETE FROM highlights WHERE id = ?', [req.params.id]);
    } else {
      await pool.query("UPDATE highlight_reports SET status = 'reviewed' WHERE highlight_id = ?", [req.params.id]);
    }
    const h = rows[0];
    await writeOwnerLog({
      actor: req.user,
      action: `highlight.${decision}`,
      entityType: 'highlight',
      entityId: Number(req.params.id),
      summary: h
        ? `${decision === 'delete' ? 'Deleted' : 'Kept'} highlight “${h.title}” by ${h.author_name}`
        : `${decision === 'delete' ? 'Deleted' : 'Kept'} highlight #${req.params.id}`,
    });
    res.json({ ok: true });
  }),
);
