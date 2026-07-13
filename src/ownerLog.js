import { pool } from './db.js';

/**
 * Append a row to owner_logs. Never throws — logging must not break moderation.
 * Visible only via the owner-only Admin → Logs API.
 */
export async function writeOwnerLog({
  actor = null,
  action,
  entityType = null,
  entityId = null,
  summary = '',
  detail = null,
} = {}) {
  if (!action) return;
  try {
    let detailStr = null;
    if (detail != null) {
      try {
        detailStr = JSON.stringify(detail).slice(0, 4000);
      } catch {
        detailStr = String(detail).slice(0, 4000);
      }
    }
    await pool.query(
      `INSERT INTO owner_logs
        (actor_id, actor_name, actor_role, action, entity_type, entity_id, summary, detail)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        actor?.id ?? null,
        String(actor?.username || 'system').slice(0, 80),
        String(actor?.role || 'system').slice(0, 16),
        String(action).slice(0, 64),
        entityType ? String(entityType).slice(0, 32) : null,
        entityId != null && Number.isFinite(Number(entityId)) ? Number(entityId) : null,
        String(summary || '').slice(0, 500),
        detailStr,
      ],
    );
  } catch (err) {
    console.warn('[owner-log]', err.message);
  }
}

export async function listOwnerLogs({ limit = 100, offset = 0, action = '' } = {}) {
  const lim = Math.min(Math.max(Number(limit) || 100, 1), 500);
  const off = Math.max(Number(offset) || 0, 0);
  const params = [];
  let where = '';
  if (action) {
    where = 'WHERE action = ?';
    params.push(String(action).slice(0, 64));
  }
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM owner_logs ${where}`, params);
  const [rows] = await pool.query(
    `SELECT id, actor_id, actor_name, actor_role, action, entity_type, entity_id, summary, detail, created_at
     FROM owner_logs ${where}
     ORDER BY created_at DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...params, lim, off],
  );
  return {
    total: Number(total) || 0,
    logs: rows.map((r) => {
      let detail = null;
      if (r.detail) {
        try {
          detail = JSON.parse(r.detail);
        } catch {
          detail = r.detail;
        }
      }
      return {
        id: r.id,
        actorId: r.actor_id,
        actorName: r.actor_name,
        actorRole: r.actor_role,
        action: r.action,
        entityType: r.entity_type,
        entityId: r.entity_id,
        summary: r.summary,
        detail,
        createdAt: r.created_at,
      };
    }),
  };
}
