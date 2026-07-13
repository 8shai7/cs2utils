import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, optionalAuth, isAdminRole } from '../auth.js';
import { asyncHandler, ApiError, clamp01 } from '../util.js';
import { MAP_IDS, TYPE_IDS, TECHNIQUE_IDS, SIDE_IDS, detectMediaKind } from '../meta.js';
import { parseMapGuide, MAX_IMPORT } from '../parseMapGuide.js';
import { buildPracticePack, buildPracticePackFromNades } from '../mapGuidePractice.js';

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
    guideImportId: row.guide_import_id || null,
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

// Parse a CS2 Map Guide / annotation .txt without creating nades (preview).
nadesRoutes.post(
  '/map-guide/parse',
  requireAuth,
  asyncHandler(async (req, res) => {
    const text = req.body?.text;
    try {
      const parsed = parseMapGuide(text);
      res.json({
        map: parsed.map,
        mapName: parsed.mapName,
        skipped: parsed.skipped,
        totalNodes: parsed.totalNodes,
        maxImport: MAX_IMPORT,
        nades: parsed.nades,
      });
    } catch (err) {
      throw new ApiError(400, err.message || 'Could not parse map guide.');
    }
  }),
);

// Import parsed (or raw) CS2 Map Guide lineups as pending nades.
nadesRoutes.post(
  '/map-guide/import',
  requireAuth,
  asyncHandler(async (req, res) => {
    const b = req.body || {};
    const side = SIDE_IDS.includes(b.side) ? b.side : 't';
    const guideText = String(b.guideText || b.text || '').trim();

    let drafts;
    let mapForImport = null;
    if (Array.isArray(b.nades) && b.nades.length) {
      drafts = b.nades;
      mapForImport = drafts[0]?.map || null;
    } else if (guideText) {
      try {
        const parsed = parseMapGuide(guideText);
        drafts = parsed.nades;
        mapForImport = parsed.map;
      } catch (err) {
        throw new ApiError(400, err.message || 'Could not parse map guide.');
      }
    } else {
      throw new ApiError(400, 'Provide map guide text or a list of nades to import.');
    }

    if (drafts.length > MAX_IMPORT) {
      throw new ApiError(400, `Too many lineups (max ${MAX_IMPORT} per import).`);
    }

    let guideImportId = null;
    if (guideText && mapForImport && MAP_IDS.includes(mapForImport)) {
      const [guideResult] = await pool.query(
        `INSERT INTO map_guide_imports (author_id, map, file_name, guide_text) VALUES (?, ?, ?, ?)`,
        [req.user.id, mapForImport, String(b.fileName || '').slice(0, 160) || null, guideText],
      );
      guideImportId = guideResult.insertId;
    }

    const created = [];
    for (const draft of drafts) {
      const title = String(draft.title || '').trim();
      if (title.length < 3) continue;
      if (!MAP_IDS.includes(draft.map)) continue;
      if (!TYPE_IDS.includes(draft.type)) continue;
      if (!draft.start || !draft.end) continue;
      const technique = TECHNIQUE_IDS.includes(draft.technique) ? draft.technique : 'stand';
      const description = String(draft.description || '').trim() || null;

      const [result] = await pool.query(
        `INSERT INTO nades (author_id, map, type, side, technique, title, description, start_x, start_y, end_x, end_y, status, guide_import_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        [
          req.user.id,
          draft.map,
          draft.type,
          side,
          technique,
          title.slice(0, 160),
          description,
          clamp01(draft.start.x),
          clamp01(draft.start.y),
          clamp01(draft.end.x),
          clamp01(draft.end.y),
          guideImportId,
        ],
      );
      created.push(result.insertId);
    }

    if (!created.length) throw new ApiError(400, 'No valid lineups to import.');

    const placeholders = created.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT n.*, u.username AS author_name FROM nades n JOIN users u ON u.id = n.author_id
       WHERE n.id IN (${placeholders}) ORDER BY n.id ASC`,
      created,
    );
    res.status(201).json({
      count: created.length,
      guideImportId,
      nades: await withMedia(rows),
    });
  }),
);

// Build a "Try in game" practice pack (guide + cfg + Steam URL) from pasted text.
nadesRoutes.post(
  '/map-guide/practice-pack',
  requireAuth,
  asyncHandler(async (req, res) => {
    const text = String(req.body?.text || '').trim();
    let mapId = req.body?.map;
    if (!mapId && text) {
      try {
        mapId = parseMapGuide(text).map;
      } catch (err) {
        throw new ApiError(400, err.message || 'Could not parse map guide.');
      }
    }
    if (!MAP_IDS.includes(mapId)) throw new ApiError(400, 'Choose a valid map.');
    try {
      res.json({ pack: buildPracticePack({ mapId, guideText: text, importId: req.body?.importId || null }) });
    } catch (err) {
      throw new ApiError(400, err.message || 'Could not build practice pack.');
    }
  }),
);

// Practice pack for a previously imported map guide.
// Author/admin always; anyone if at least one linked nade is approved (Browse → Try in game).
nadesRoutes.get(
  '/map-guide/imports/:id/practice-pack',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM map_guide_imports WHERE id = ?', [req.params.id]);
    if (!rows.length) throw new ApiError(404, 'Map guide import not found.');
    const row = rows[0];
    const isOwner = req.user && (row.author_id === req.user.id || isAdminRole(req.user.role));
    if (!isOwner) {
      const [[{ count }]] = await pool.query(
        "SELECT COUNT(*) AS count FROM nades WHERE guide_import_id = ? AND status = 'approved'",
        [row.id],
      );
      if (!Number(count)) throw new ApiError(403, 'This guide is not public yet.');
    }
    try {
      res.json({
        pack: buildPracticePack({
          mapId: row.map,
          guideText: row.guide_text,
          importId: row.id,
        }),
        fileName: row.file_name,
      });
    } catch (err) {
      throw new ApiError(400, err.message || 'Could not build practice pack.');
    }
  }),
);

// Build a practice pack from approved nades (Browse → Try in game).
nadesRoutes.post(
  '/map-guide/practice-pack-from-nades',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const ids = Array.isArray(req.body?.nadeIds)
      ? req.body.nadeIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0)
      : [];
    if (!ids.length) throw new ApiError(400, 'Select at least one nade.');
    if (ids.length > 30) throw new ApiError(400, 'Too many nades (max 30).');

    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT n.*, u.username AS author_name FROM nades n
       JOIN users u ON u.id = n.author_id
       WHERE n.id IN (${placeholders}) AND n.status = 'approved'`,
      ids,
    );
    if (!rows.length) throw new ApiError(404, 'No approved nades found.');

    const mapId = rows[0].map;
    if (!rows.every((r) => r.map === mapId)) {
      throw new ApiError(400, 'All nades must be on the same map to open together in CS2.');
    }

    // Prefer the original imported guide text when every nade shares one import.
    const importIds = [...new Set(rows.map((r) => r.guide_import_id).filter(Boolean))];
    if (importIds.length === 1 && rows.every((r) => r.guide_import_id === importIds[0])) {
      const [guides] = await pool.query('SELECT * FROM map_guide_imports WHERE id = ?', [importIds[0]]);
      if (guides.length) {
        return res.json({
          pack: buildPracticePack({
            mapId: guides[0].map,
            guideText: guides[0].guide_text,
            importId: guides[0].id,
          }),
          source: 'import',
        });
      }
    }

    const nades = rows.map((r) => ({
      title: r.title,
      description: r.description || '',
      type: r.type,
      technique: r.technique,
      start: { x: r.start_x, y: r.start_y },
      end: { x: r.end_x, y: r.end_y },
    }));
    try {
      res.json({
        pack: buildPracticePackFromNades(mapId, nades, {
          loadName: `aimkit_${mapId}_browse_${ids[0]}`,
        }),
        source: 'nades',
      });
    } catch (err) {
      throw new ApiError(400, err.message || 'Could not build practice pack.');
    }
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
