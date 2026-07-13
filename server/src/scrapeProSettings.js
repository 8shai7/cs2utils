// Scrapes CS2 pro-player settings from prosettings.net (reachable, no Cloudflare
// challenge) — the community list page has a full settings table plus team logos
// and links to each player's page (used to derive a photo URL).

import * as cheerio from 'cheerio';
import { config } from './config.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function uploadsImg($, cell) {
  let src = '';
  cell.find('img').each((_i, im) => {
    const s = $(im).attr('src') || $(im).attr('data-src') || '';
    if (/wp-content\/uploads\//.test(s) && !src) src = s;
  });
  return src;
}

/** Parse the prosettings CS2 list HTML into pro-setting objects. Exported for testing. */
export function parseProSettings(html) {
  const $ = cheerio.load(html);
  const table = $('#pro-list-table');
  if (!table.length) throw new Error('pro list table not found');

  const heads = table.find('thead th').map((_i, el) => $(el).text().trim().toLowerCase()).get();
  const idx = (name) => heads.indexOf(name);
  const iPlayer = idx('player');
  const iTeam = idx('team');
  if (iPlayer < 0) throw new Error('player column not found');

  const cellText = (tds, n) => (n >= 0 && tds[n] ? $(tds[n]).text().replace(/\s+/g, ' ').trim() : '');
  const num = (v) => {
    const n = Number(String(v).replace(',', '.').replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  };

  const out = [];
  table.find('tbody tr').each((_i, tr) => {
    const tds = $(tr).find('td');
    if (tds.length < 8) return;
    const playerCell = $(tds[iPlayer]);
    const teamCell = iTeam >= 0 ? $(tds[iTeam]) : $();

    const player = playerCell.text().replace(/\s+/g, ' ').trim();
    if (!player) return;

    const href = playerCell.find('a[href*="/players/"]').attr('href') || '';
    const slugMatch = /\/players\/([a-z0-9_-]+)\/?/i.exec(href);
    const slug = slugMatch ? slugMatch[1] : '';
    // prosettings hosts a per-player photo at uploads/<slug>.png for (almost) all
    // players; the frontend falls back to the team logo / monogram if one is missing.
    const photo = slug ? `https://prosettings.net/wp-content/uploads/${slug}.png` : null;

    out.push({
      player,
      team: cellText(tds, iTeam) || null,
      dpi: num(cellText(tds, idx('dpi'))),
      sens: num(cellText(tds, idx('sens'))),
      zoomSens: num(cellText(tds, idx('zoom sens'))),
      hz: num(cellText(tds, idx('hz'))),
      resolution: cellText(tds, idx('resolution')) || null,
      aspectRatio: cellText(tds, idx('aspect ratio')) || null,
      teamLogo: uploadsImg($, teamCell) || null,
      photo,
    });
  });
  return out;
}

/** Fetch + parse the prosettings CS2 list. Throws on failure (caller falls back). */
export async function scrapeProSettings() {
  const url = config.proSettingsListUrl;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  let res;
  try {
    res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': UA, accept: 'text/html' } });
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) throw new Error(`prosettings returned HTTP ${res.status}`);
  const html = await res.text();
  if (/just a moment|cf-chl|attention required/i.test(html)) throw new Error('prosettings is bot-protected right now');
  const pros = parseProSettings(html);
  if (pros.length < 10) throw new Error(`parsed too few players (${pros.length})`);
  return pros;
}
