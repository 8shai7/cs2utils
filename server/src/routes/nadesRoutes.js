import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, optionalAuth, isAdminRole } from '../auth.js';
import { asyncHandler, ApiError, clamp01 } from '../util.js';
import { MAP_IDS, TYPE_IDS, TECHNIQUE_IDS, SIDE_IDS, detectMediaKind } from '../meta.js';

export const nadesRoutes = Router();

function serializeMedia(row) {
  return {
    id: row.id,
    kind: row.kind,
    url: row.url,
    status: row.status,
    addedByName: row.added_by_name,
    createdAt: row.created_at,
  };
}

function serializeNade(row, media) {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.author_name,
    map: row.map,
    type: row.type,
    side: row.side,
    technique: row.technique,
    title: row.title,
    description: row.description || '',
    start: { x: row.start_x, y: row.start_y },
    end: { x: row.end_x, y: row.end_y },
    status: row.status,
    reviewedBy: row.reviewed_by,
    reviewNote: row.review_note || '',
    createdAt: row.created_at,
    media,
  };
}

/** Attach media rows to nade rows, optionally filtering to approved media only. */
async function withMedia(nadeRows, { onlyApproved = false } = {}) {
  if (nadeRows.length === 0) return [];
  const ids = nadeRows.map((n) => n.id);
  const placeholders = ids.map(() => '?').join(',');
  let sql = `SELECT * FROM nade_media WHERE nade_id IN (${placeholders})`;
  if (onlyApproved) sql += " AND status = 'approved'";
  sql += ' ORDER BY created_at ASC';
  const [mediaRows] = await pool.query(sql, ids);
  const byNade = new Map();
  for (const m of mediaRows) {
    if (!byNade.has(m.nade_id)) byNade.set(m.nade_id, []);
    byNade.get(m.nade_id).push(serializeMedia(m));
  }
  return nadeRows.map((n) => serializeNade(n, byNade.get(n.id) || []));
}

// Public: approved nades (with approved media only).
nadesRoutes.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { map, type } = req.query;
    let sql =
      "SELECT n.*, u.username AS author_name FROM nades n JOIN users u ON u.id = n.author_id WHERE n.status = 'approved'";
    const params = [];
    if (map && MAP_IDS.includes(map)) {
      sql += ' AND n.map = ?';
      params.push(map);
    }
    if (type && TYPE_IDS.includes(type)) {
      sql += ' AND n.type = ?';
      params.push(type);
    }
    sql += ' ORDER BY n.created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json({ nades: await withMedia(rows, { onlyApproved: true }) });
  }),
);

// The current user's own nades (all statuses, all media).
nadesRoutes.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      'SELECT n.*, u.username AS author_name FROM nades n JOIN users u ON u.id = n.author_id WHERE n.author_id = ? ORDER BY n.created_at DESC',
      [req.user.id],
    );
    res.json({ nades: await withMedia(rows) });
  }),
);

// Create a nade (enters review as pending).
nadesRoutes.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const b = req.body || {};
    const title = (b.title || '').trim();
    if (title.length < 3) throw new ApiError(400, 'Give the nade a title (at least 3 characters).');
    if (!MAP_IDS.includes(b.map)) throw new ApiError(400, 'Choose a valid map.');
    if (!TYPE_IDS.includes(b.type)) throw new ApiError(400, 'Choose a valid nade type.');
    const side = SIDE_IDS.includes(b.side) ? b.side : 't';
    const technique = TECHNIQUE_IDS.includes(b.technique) ? b.technique : 'stand';
    if (!b.start || !b.end) throw new ApiError(400, 'Set both the throw position and landing spot on the map.');

    const [result] = await pool.query(
      `INSERT INTO nades (author_id, map, type, side, technique, title, description, start_x, start_y, end_x, end_y, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        req.user.id,
        b.map,
        b.type,
        side,
        technique,
        title,
        (b.description || '').trim() || null,
        clamp01(b.start.x),
        clamp01(b.start.y),
        clamp01(b.end.x),
        clamp01(b.end.y),
      ],
    );

    const nadeId = result.insertId;
    const media = Array.isArray(b.media) ? b.media.filter((m) => m && m.url) : [];
    for (const m of media) {
      await pool.query(
        'INSERT INTO nade_media (nade_id, kind, url, added_by, added_by_name, status) VALUES (?, ?, ?, ?, ?, \'pending\')',
        [nadeId, m.kind || detectMediaKind(m.url), String(m.url).trim(), req.user.id, req.user.username],
      );
    }

    const [rows] = await pool.query(
      'SELECT n.*, u.username AS author_name FROM nades n JOIN users u ON u.id = n.author_id WHERE n.id = ?',
      [nadeId],
    );
    const [nade] = await withMedia(rows);
    res.status(201).json({ nade });
  }),
);

// Add media to a nade you own (or any if admin). Media enters review as pending.
nadesRoutes.post(
  '/:id/media',
  requireAuth,
  asyncHandler(async (req, res) => {
    const url = (req.body?.url || '').trim();
    if (!url) throw new ApiError(400, 'Enter a media URL or upload an image.');
    const [rows] = await pool.query('SELECT * FROM nades WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'Nade not found.');
    const nade = rows[0];
    if (nade.author_id !== req.user.id && !isAdminRole(req.user.role)) {
      throw new ApiError(403, 'You can only add media to your own nades.');
    }
    const kind = req.body?.kind || detectMediaKind(url);
    const [result] = await pool.query(
      "INSERT INTO nade_media (nade_id, kind, url, added_by, added_by_name, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [nade.id, kind, url, req.user.id, req.user.username],
    );
    const [mediaRows] = await pool.query('SELECT * FROM nade_media WHERE id = ?', [result.insertId]);
    res.status(201).json({ media: serializeMedia(mediaRows[0]) });
  }),
);

// Delete a nade (author or admin).
nadesRoutes.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM nades WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.json({ ok: true });
    const nade = rows[0];
    if (nade.author_id !== req.user.id && !isAdminRole(req.user.role)) {
      throw new ApiError(403, 'You can only delete your own nades.');
    }
    await pool.query('DELETE FROM nades WHERE id = ?', [nade.id]);
    res.json({ ok: true });
  }),
);

export { withMedia, serializeMedia };
