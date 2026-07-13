// Pro-player settings store + optional sync.
//
// Seeded from a curated list; can auto-refresh from a JSON feed
// (PRO_SETTINGS_SOURCE_URL) or a best-effort HLTV fetch. HLTV is
// Cloudflare-protected and typically blocks datacenter IPs, so when the live
// fetch is blocked the existing catalog/seed is kept.

import { pool } from './db.js';
import { config } from './config.js';
import { PRO_SEED } from './proSettingsSeed.js';
import { scrapeProSettings } from './scrapeProSettings.js';

async function getMeta(k) {
  const [rows] = await pool.query('SELECT v FROM app_meta WHERE k = ?', [k]);
  return rows.length ? rows[0].v || '' : '';
}
async function setMeta(k, v) {
  await pool.query('INSERT INTO app_meta (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [k, v == null ? null : String(v)]);
}

function slug(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function normalize(list, source) {
  const rows = [];
  const seen = new Set();
  let order = 0;
  for (const p of Array.isArray(list) ? list : []) {
    if (!p || !p.player) continue;
    const key = slug(p.player);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const dpi = p.dpi != null ? Number(p.dpi) : null;
    const sens = p.sens != null ? Number(p.sens) : null;
    const edpi = dpi != null && sens != null ? Math.round(dpi * sens) : p.edpi != null ? Number(p.edpi) : null;
    rows.push({
      key,
      player: String(p.player).slice(0, 80),
      team: p.team ? String(p.team).slice(0, 80) : null,
      dpi,
      sens,
      edpi,
      zoomSens: p.zoomSens != null ? Number(p.zoomSens) : null,
      hz: p.hz != null ? Number(p.hz) : null,
      resolution: p.resolution ? String(p.resolution).slice(0, 20) : null,
      aspectRatio: p.aspectRatio ? String(p.aspectRatio).slice(0, 12) : null,
      viewmodelFov: p.viewmodelFov != null ? Number(p.viewmodelFov) : null,
      crosshairCode: p.crosshairCode ? String(p.crosshairCode).slice(0, 64) : null,
      photo: p.photo ? String(p.photo).slice(0, 500) : null,
      teamLogo: p.teamLogo ? String(p.teamLogo).slice(0, 500) : null,
      source,
      sortOrder: order++,
    });
  }
  return rows;
}

async function replaceAll(rows) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM pro_settings');
    for (const r of rows) {
      await conn.query(
        `INSERT INTO pro_settings (pkey, player, team, dpi, sens, edpi, zoom_sens, hz, resolution, aspect_ratio, viewmodel_fov, crosshair_code, photo, team_logo, source, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.key, r.player, r.team, r.dpi, r.sens, r.edpi, r.zoomSens, r.hz, r.resolution, r.aspectRatio, r.viewmodelFov, r.crosshairCode, r.photo, r.teamLogo, r.source, r.sortOrder],
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function seedProsIfEmpty() {
  const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM pro_settings');
  if (Number(c) > 0) return;
  await replaceAll(normalize(PRO_SEED, 'seed'));
  await setMeta('pros_source', 'seed');
  await setMeta('pros_last_sync', '0');
}

function serialize(row) {
  return {
    key: row.pkey,
    player: row.player,
    team: row.team,
    dpi: row.dpi,
    sens: row.sens,
    edpi: row.edpi,
    zoomSens: row.zoom_sens,
    hz: row.hz,
    resolution: row.resolution,
    aspectRatio: row.aspect_ratio,
    viewmodelFov: row.viewmodel_fov,
    crosshairCode: row.crosshair_code,
    photo: row.photo,
    teamLogo: row.team_logo,
    source: row.source,
  };
}

export async function getPros({ q = '', sort = 'name' } = {}) {
  const params = [];
  let where = '';
  if (q) {
    where = 'WHERE player LIKE ? OR team LIKE ?';
    const like = `%${q}%`;
    params.push(like, like);
  }
  let order = 'sort_order ASC, player ASC';
  if (sort === 'name') order = 'player ASC';
  else if (sort === 'edpi') order = 'edpi ASC, player ASC';
  else if (sort === 'edpi-desc') order = 'edpi DESC, player ASC';
  const [rows] = await pool.query(`SELECT * FROM pro_settings ${where} ORDER BY ${order} LIMIT 400`, params);
  return {
    pros: rows.map(serialize),
    source: (await getMeta('pros_source')) || 'seed',
    lastSync: Number((await getMeta('pros_last_sync')) || 0),
    lastError: (await getMeta('pros_last_error')) || '',
  };
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`source returned HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : Array.isArray(data?.pros) ? data.pros : [];
  } finally {
    clearTimeout(timeout);
  }
}

/** Import pro settings from JSON an admin pasted (after passing HLTV's bot check). */
export async function importPros(content) {
  const text = String(content || '').trim();
  if (!text) throw new Error('Paste the pro settings JSON first.');
  let list;
  try {
    const data = JSON.parse(text);
    list = Array.isArray(data) ? data : data.pros || [];
  } catch {
    throw new Error('Pro settings import expects JSON (an array of players).');
  }
  const rows = normalize(list, 'import');
  if (rows.length < 1) throw new Error('No valid players found in the pasted JSON.');
  await replaceAll(rows);
  await setMeta('pros_source', 'import');
  await setMeta('pros_last_sync', String(Date.now()));
  await setMeta('pros_last_error', '');
  return { count: rows.length };
}

export async function syncPros({ force = false } = {}) {
  const source = (await getMeta('pros_source')) || 'seed';
  try {
    // A JSON feed override takes priority; otherwise scrape prosettings.net.
    const useRemote = Boolean(config.proSettingsSourceUrl);
    const list = useRemote ? await fetchJson(config.proSettingsSourceUrl) : await scrapeProSettings();
    const rows = normalize(list, useRemote ? 'remote' : 'prosettings');
    if (!rows || rows.length < 3) throw new Error('source returned too few players');
    await replaceAll(rows);
    await setMeta('pros_source', useRemote ? 'remote' : 'prosettings');
    await setMeta('pros_last_sync', String(Date.now()));
    await setMeta('pros_last_error', '');
    return { synced: true, count: rows.length, source: useRemote ? 'remote' : 'prosettings' };
  } catch (err) {
    await setMeta('pros_last_error', err.message);
    return { synced: false, reason: err.message, source };
  }
}
