// Scrapes CS2 console commands from a MediaWiki page (default: the Valve
// Developer Community wiki) via the action=parse API, and parses the wikitext
// tables into { key, category, type, command, title, description } entries.

import { config } from './config.js';

const CMD_TOKEN_RE = /^[+-]?[a-z][a-z0-9_]{1,48}$/;

/** Strip common wiki markup from a cell to plain text. */
function clean(s) {
  return String(s || '')
    .replace(/\{\{\s*cvar\s*\|\s*([^|}]+)[^}]*\}\}/gi, '$1') // {{cvar|name|...}} -> name
    .replace(/\{\{[^}]*\}\}/g, '') // other templates
    .replace(/\[\[[^\]|]*\|([^\]]+)\]\]/g, '$1') // [[a|b]] -> b
    .replace(/\[\[([^\]]+)\]\]/g, '$1') // [[a]] -> a
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<[^>]+>/g, '') // html tags
    .replace(/'''?/g, '')
    .replace(/`/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract table cell strings from one wikitext table row. */
function extractCells(row) {
  const cells = [];
  for (const rawLine of row.split('\n')) {
    const line = rawLine.trim();
    if (!line.startsWith('|') || line.startsWith('|-') || line.startsWith('|+')) continue;
    const body = line.replace(/^\|+/, '');
    for (const part of body.split('||')) {
      // Drop cell attributes like: style="..." | value
      const val = part.includes('|') && /=/.test(part.split('|')[0]) ? part.split('|').slice(1).join('|') : part;
      const cleaned = clean(val);
      if (cleaned) cells.push(cleaned);
    }
  }
  return cells;
}

function categorize(command) {
  const c = command.toLowerCase();
  if (c.startsWith('cl_hud_telemetry') || c.startsWith('cq_net')) return 'telemetry';
  if (c.startsWith('snd_') || c.startsWith('voice_') || c === 'volume') return 'audio';
  if (c.startsWith('net_') || c === 'rate' || c.startsWith('cl_net')) return 'net';
  if (c.startsWith('viewmodel_') || c.startsWith('hud_') || c.startsWith('cl_radar') || c.startsWith('cl_crosshair') || c.startsWith('cl_hud')) return 'hud';
  if (c.startsWith('sv_') || c.startsWith('mp_') || c.startsWith('bot_') || c.startsWith('ammo_')) return 'practice';
  if (c.startsWith('fps') || c.startsWith('r_') || c.startsWith('mat_') || c.startsWith('engine_')) return 'fps';
  return 'other';
}

function slug(command) {
  const s = command.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 58);
  return `wiki-${s}`.slice(0, 64);
}

/** Parse commands out of raw wikitext. Exported for unit testing. */
export function parseWikiCommands(wikitext) {
  const out = [];
  const seen = new Set();
  const tables = wikitext.match(/\{\|[\s\S]*?\|\}/g) || [];

  for (const table of tables) {
    for (const row of table.split(/\n\|-/)) {
      const cells = extractCells(row);
      if (cells.length < 2) continue;

      // The command is the first cell that is a single identifier token
      // (e.g. "rate", "fps_max", "+jump"). Descriptions are multi-word cells,
      // and default/flag cells start with digits, so they are skipped.
      let cmdCell = null;
      for (const cell of cells) {
        if (cell.split(/\s+/).length === 1 && CMD_TOKEN_RE.test(cell)) {
          cmdCell = { cell, token: cell };
          break;
        }
      }
      if (!cmdCell) continue;

      const command = cmdCell.token;
      const key = slug(command);
      if (!/^[a-z0-9-]{2,64}$/.test(key) || seen.has(key)) continue;

      const description = cells
        .filter((c) => c !== cmdCell.cell)
        .sort((a, b) => b.length - a.length)[0] || '';
      if (!description) continue;

      seen.add(key);
      out.push({
        key,
        category: categorize(command),
        type: 'console',
        command,
        title: command,
        description: description.slice(0, 600),
      });
    }
  }
  return out;
}

/** Fetch + parse the configured wiki page. Throws on failure (caller falls back). */
export async function scrapeWikiCommands() {
  const { commandsWikiApi: api, commandsWikiPage: page, wikiUserAgent } = config;
  if (!api || !page) throw new Error('wiki source not configured');

  const url = `${api}?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json&formatversion=2&redirects=1`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  let res;
  try {
    res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': wikiUserAgent, accept: 'application/json' } });
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) throw new Error(`wiki HTTP ${res.status}`);
  const text = await res.text();
  if (!/application\/json/.test(res.headers.get('content-type') || '') && text.trimStart().startsWith('<')) {
    throw new Error('wiki returned HTML (likely an anti-bot challenge)');
  }
  const data = JSON.parse(text);
  if (data.error) throw new Error(`wiki API error: ${data.error.info || data.error.code}`);
  const wt = data?.parse?.wikitext;
  const wikitext = typeof wt === 'string' ? wt : wt && wt['*'];
  if (!wikitext) throw new Error('wiki page had no wikitext');

  const commands = parseWikiCommands(wikitext);
  if (commands.length < 5) throw new Error(`parsed too few commands (${commands.length})`);
  return commands;
}
