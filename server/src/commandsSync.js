// Command catalog store + auto-sync.
//
// The catalog lives in the DB so it can be updated without code changes. It is
// seeded from the built-in curated list, and — when COMMANDS_SOURCE_URL is set —
// automatically refreshed from that remote JSON feed on a staleness schedule,
// with a manual admin trigger. If the remote is unreachable the existing catalog
// (or the seed) is kept, so the feature never breaks.

import { pool } from './db.js';
import { config } from './config.js';
import { CATEGORIES, SEED_COMMANDS, RECOMMENDED_LAUNCH_OPTIONS } from './commandsSeed.js';
import { scrapeWikiCommands } from './scrapeWiki.js';

const KEY_RE = /^[a-z0-9-]{2,64}$/;
const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));
const SEED_LAUNCH_OPTIONS = SEED_COMMANDS.filter((c) => c.category === 'launch');

async function getMeta(k) {
  const [rows] = await pool.query('SELECT v FROM app_meta WHERE k = ?', [k]);
  return rows.length ? rows[0].v : null;
}
async function setMeta(k, v) {
  await pool.query('INSERT INTO app_meta (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [
    k,
    v == null ? null : String(v),
  ]);
}

async function catalogCount() {
  const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM commands_catalog');
  return Number(c);
}

/** Validate + normalize an arbitrary list of command objects into DB rows. */
function normalize(list, source) {
  const rows = [];
  const seen = new Set();
  let order = 0;
  for (const it of Array.isArray(list) ? list : []) {
    if (!it || typeof it !== 'object') continue;
    const key = String(it.key || '').trim();
    if (!KEY_RE.test(key) || seen.has(key)) continue;
    if (!it.command || !it.title) continue;
    seen.add(key);
    rows.push({
      key,
      category: CATEGORY_IDS.has(it.category) ? it.category : 'other',
      type: it.type === 'launch' ? 'launch' : 'console',
      command: String(it.command).slice(0, 300),
      title: String(it.title).slice(0, 160),
      description: String(it.description || '').slice(0, 600),
      sort_order: Number.isFinite(it.sort) ? it.sort : order,
      source,
    });
    order += 1;
  }
  return rows;
}

async function replaceCatalog(rows, source) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM commands_catalog');
    for (const r of rows) {
      await conn.query(
        'INSERT INTO commands_catalog (command_key, category, type, command, title, description, sort_order, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [r.key, r.category, r.type, r.command, r.title, r.description, r.sort_order, r.source],
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
  await reconcileSeen(rows.map((r) => r.key), source);
}

/**
 * Track when each command key was first seen so genuinely-new commands can be
 * flagged. Establishing (or switching) the catalog source re-baselines — nothing
 * is "new". Once a source is established, keys that appear in later syncs from the
 * SAME source get a fresh first_seen and show as new to users.
 */
async function reconcileSeen(keys, source) {
  const now = Date.now();
  const baselineSource = await getMeta('seen_baseline_source');

  if (baselineSource !== source) {
    // First population or a source switch: rebaseline, mark nothing new.
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query('DELETE FROM command_seen');
      for (const key of keys) {
        await conn.query('INSERT INTO command_seen (command_key, first_seen) VALUES (?, ?)', [key, now]);
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    await setMeta('catalog_baseline_at', String(now));
    await setMeta('seen_baseline_source', source);
    return;
  }

  // Same source: newly-appearing keys are genuinely new.
  const [existingRows] = await pool.query('SELECT command_key FROM command_seen');
  const existing = new Set(existingRows.map((r) => r.command_key));
  for (const key of keys) {
    if (!existing.has(key)) {
      await pool.query('INSERT IGNORE INTO command_seen (command_key, first_seen) VALUES (?, ?)', [key, now]);
    }
  }
  const keySet = new Set(keys);
  for (const key of existing) {
    if (!keySet.has(key)) await pool.query('DELETE FROM command_seen WHERE command_key = ?', [key]);
  }
}

export async function seedIfEmpty() {
  if ((await catalogCount()) > 0) return;
  await replaceCatalog(normalize(SEED_COMMANDS, 'seed'), 'seed');
  await setMeta('commands_source', 'seed');
  await setMeta('commands_last_sync', '0');
}

/**
 * Refresh the catalog from COMMANDS_SOURCE_URL if configured and stale (or forced).
 * @returns {Promise<{synced:boolean, count?:number, reason?:string, source:string}>}
 */
async function fetchJsonSource(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`source returned HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : Array.isArray(data?.commands) ? data.commands : [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function syncFromSource({ force = false } = {}) {
  const source = (await getMeta('commands_source')) || 'seed';
  const usingWiki = !config.commandsSourceUrl;

  const last = Number((await getMeta('commands_last_sync')) || 0);
  const ttlMs = config.commandsSyncTtlHours * 60 * 60 * 1000;
  if (!force && last && Date.now() - last < ttlMs) {
    return { synced: false, reason: 'Catalog is still fresh.', source };
  }

  try {
    // A remote JSON feed (if configured) overrides wiki scraping.
    const scraped = config.commandsSourceUrl
      ? normalize(await fetchJsonSource(config.commandsSourceUrl), 'remote')
      : normalize(await scrapeWikiCommands(), 'wiki');
    if (scraped.length < 5) throw new Error('source returned too few valid commands');

    // Launch options aren't on the wiki cvar page — keep the curated ones.
    const launch = normalize(SEED_LAUNCH_OPTIONS, usingWiki ? 'wiki' : 'remote');
    const haveKeys = new Set(scraped.map((r) => r.key));
    const merged = [...launch.filter((l) => !haveKeys.has(l.key)), ...scraped];
    merged.forEach((r, i) => (r.sort_order = i));

    const newSource = usingWiki ? 'wiki' : 'remote';
    await replaceCatalog(merged, newSource);
    await setMeta('commands_source', newSource);
    await setMeta('commands_last_sync', String(Date.now()));
    await setMeta('commands_last_error', '');
    return { synced: true, count: merged.length, source: newSource };
  } catch (err) {
    await setMeta('commands_last_error', err.message);
    return { synced: false, reason: err.message, source };
  }
}

export async function getCatalog() {
  const [rows] = await pool.query(
    `SELECT c.command_key AS \`key\`, c.category, c.type, c.command, c.title, c.description, s.first_seen AS firstSeen
     FROM commands_catalog c
     LEFT JOIN command_seen s ON s.command_key = c.command_key
     ORDER BY c.sort_order ASC, c.id ASC`,
  );
  const baseline = Number((await getMeta('catalog_baseline_at')) || 0);
  const newWindowMs = config.commandsNewWindowDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  for (const r of rows) {
    const fs = Number(r.firstSeen || 0);
    r.isNew = Boolean(fs) && fs > baseline && now - fs < newWindowMs;
  }
  const source = (await getMeta('commands_source')) || 'seed';
  const lastSync = Number((await getMeta('commands_last_sync')) || 0);
  const lastError = (await getMeta('commands_last_error')) || '';
  return {
    commands: rows,
    categories: CATEGORIES,
    recommendedLaunchOptions: RECOMMENDED_LAUNCH_OPTIONS,
    source,
    lastSync,
    lastError,
    remoteConfigured: Boolean(config.commandsSourceUrl),
    cs2Build: (await getMeta('cs2_build')) || '',
    cs2Version: (await getMeta('cs2_version')) || '',
    cs2CheckedAt: Number((await getMeta('cs2_checked_at')) || 0),
  };
}

/** Read the current CS2 build number from the Steam UpToDateCheck endpoint. */
async function fetchCs2Build() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(config.cs2VersionUrl, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rv = data?.response?.required_version;
    const message = data?.response?.message || '';
    const version = (String(message).match(/[\d.]+/) || [])[0] || '';
    return { build: rv != null ? String(rv) : '', version };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Check the current CS2 build; if it changed since last check, re-sync the catalog.
 * @returns {Promise<{ok:boolean, build?:string, changed?:boolean, synced?:object, reason?:string}>}
 */
export async function checkCs2Build({ force = false } = {}) {
  let info;
  try {
    info = await fetchCs2Build();
  } catch (err) {
    await setMeta('cs2_check_error', err.message);
    return { ok: false, reason: err.message };
  }
  if (!info.build) {
    await setMeta('cs2_check_error', 'no build number returned');
    return { ok: false, reason: 'no build number returned' };
  }

  const prev = await getMeta('cs2_build');
  await setMeta('cs2_build', info.build);
  await setMeta('cs2_version', info.version);
  await setMeta('cs2_checked_at', String(Date.now()));
  await setMeta('cs2_check_error', '');

  const changed = Boolean(prev) && prev !== info.build;
  let synced = null;
  if (changed || force) {
    synced = await syncFromSource({ force: true });
    await setMeta('cs2_last_update_at', String(Date.now()));
    console.log(`[server] CS2 build changed ${prev || '(none)'} -> ${info.build}; catalog sync:`, synced.synced ? `updated (${synced.count})` : synced.reason);
  }
  return { ok: true, build: info.build, version: info.version, changed, synced };
}

let cs2Timer = null;
export function startCs2Watcher() {
  // Initial check on boot (records the build; syncs if it changed and a source is set).
  checkCs2Build({}).catch(() => {});
  if (cs2Timer) return;
  const everyMs = Math.max(5, config.cs2WatchMinutes) * 60 * 1000;
  cs2Timer = setInterval(() => {
    checkCs2Build({}).catch(() => {});
  }, everyMs);
  if (cs2Timer.unref) cs2Timer.unref();
}

let timer = null;
export function startCommandsScheduler() {
  if (!config.commandsSourceUrl || timer) return;
  const everyMs = Math.max(1, config.commandsSyncTtlHours) * 60 * 60 * 1000;
  timer = setInterval(() => {
    syncFromSource({}).catch(() => {});
  }, everyMs);
  if (timer.unref) timer.unref();
}
