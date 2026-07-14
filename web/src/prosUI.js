import { api, isAdmin, getToken } from './api.js';
import { getUser, subscribe } from './session.js';
import { openImportModal } from './importModal.js';
import { openAuth } from './headerAuth.js';

let tool;
let session = null;
let data = { pros: [], source: 'seed', lastSync: 0 };
let sort = 'featured';
let query = '';
let searchTimer = null;
let statusMsg = { text: '', kind: '' };

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setStatus(text, kind = '') {
  statusMsg = { text, kind };
  const el = tool?.querySelector('#pros-status');
  if (el) {
    el.textContent = text;
    el.className = `status${kind ? ` ${kind}` : ''}`;
  }
}

async function load() {
  try {
    data = await api.pros.list({ sort, q: query });
  } catch (err) {
    setStatus(err.message, 'error');
  }
  render();
}

const TEAM_COLORS = {
  'natus vincere': '#f4d000',
  vitality: '#f5d20a',
  falcons: '#0aa14f',
  'team spirit': '#c8102e',
  astralis: '#e4002b',
  faze: '#e43b26',
  g2: '#c8102e',
};

function teamColor(team) {
  return TEAM_COLORS[(team || '').toLowerCase()] || '#33415a';
}

function monogram(p) {
  const t = (p.team || p.player || '?').trim();
  const words = t.split(/\s+/);
  const ini = words.length > 1 ? words.slice(0, 3).map((w) => w[0]).join('') : t.slice(0, 2);
  return ini.toUpperCase();
}

function photoHtml(p) {
  // Prefer the player photo, fall back to the team logo, then a team-coloured
  // monogram badge (revealed if the images fail to load / aren't provided).
  const primary = p.photo || p.teamLogo || '';
  const fallbackLogo = p.photo && p.teamLogo ? p.teamLogo : '';
  const img = primary
    ? `<img class="pro-img" alt="${esc(p.player)}" loading="lazy" src="${esc(primary)}"${
        fallbackLogo ? ` data-logo="${esc(fallbackLogo)}"` : ''
      } onerror="if(this.dataset.logo){this.src=this.dataset.logo;this.removeAttribute('data-logo');}else{this.remove();}" />`
    : '';
  return `<div class="pro-photo" style="--team:${teamColor(p.team)}"><span class="pro-monogram">${esc(monogram(p))}</span>${img}</div>`;
}

function stat(label, value) {
  return `<div class="pro-stat"><dt>${esc(label)}</dt><dd>${value != null && value !== '' ? esc(value) : '—'}</dd></div>`;
}

function cardHtml(p) {
  const search = `${p.player} ${p.team || ''}`.toLowerCase();
  return `
    <article class="pro-card" data-search="${esc(search)}">
      ${photoHtml(p)}
      <div class="pro-head">
        <div>
          <h3>${esc(p.player)}</h3>
          ${p.team ? `<p class="hint">${esc(p.team)}</p>` : ''}
        </div>
        <div class="pro-edpi"><span>${p.edpi ?? '—'}</span><small>eDPI</small></div>
      </div>
      <dl class="pro-stats">
        ${stat('DPI', p.dpi)}
        ${stat('Sens', p.sens)}
        ${stat('Zoom', p.zoomSens)}
        ${stat('Hz', p.hz)}
        ${stat('Resolution', p.resolution)}
        ${stat('Aspect', p.aspectRatio)}
      </dl>
    </article>`;
}

function render() {
  const adminBtn = isAdmin(session) && getToken()
    ? `<div class="pros-admin-actions">
         <button class="btn btn-sm" id="pros-sync">Sync from prosettings.net</button>
         <button class="btn btn-sm ghost" id="pros-import">Import from HLTV</button>
       </div>`
    : '';
  tool.innerHTML = `
    <div class="pros-shell">
      <div class="cmd-status-bar">
        <div><strong>Source:</strong> ${esc(data.source)} · <strong>${data.pros.length}</strong> players${
          data.lastSync ? ` · synced ${esc(new Date(data.lastSync).toLocaleDateString())}` : ''
        }</div>
        ${adminBtn}
      </div>
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${sort === 'featured' ? 'active' : ''}" data-sort="featured">Featured</button>
          <button class="tool-tab ${sort === 'name' ? 'active' : ''}" data-sort="name">Name</button>
          <button class="tool-tab ${sort === 'edpi' ? 'active' : ''}" data-sort="edpi">Lowest eDPI</button>
          <button class="tool-tab ${sort === 'edpi-desc' ? 'active' : ''}" data-sort="edpi-desc">Highest eDPI</button>
        </div>
        <input id="pros-search" type="search" class="cfg-search" placeholder="Search player or team…" value="${esc(query)}" />
      </div>
      <p class="hint">${
        data.source === 'prosettings'
          ? 'Live from prosettings.net.'
          : data.source === 'seed'
            ? 'Built-in list. Admins can sync live data from prosettings.net.'
            : `Source: ${esc(data.source)}.`
      }</p>
      <div class="pro-grid">
        ${data.pros.length ? data.pros.map(cardHtml).join('') : `<p class="hint">No pro settings yet.</p>`}
      </div>
      <div id="pros-status" class="status ${statusMsg.kind}">${esc(statusMsg.text)}</div>
    </div>`;
  wire();
}

function wire() {
  tool.querySelectorAll('[data-sort]').forEach((b) =>
    b.addEventListener('click', () => {
      sort = b.dataset.sort;
      load();
    }),
  );
  const search = tool.querySelector('#pros-search');
  if (search) {
    search.addEventListener('input', (e) => {
      query = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(async () => {
        await load();
        const s = tool.querySelector('#pros-search');
        if (s) {
          s.focus();
          s.setSelectionRange(s.value.length, s.value.length);
        }
      }, 300);
    });
  }
  tool.querySelector('#pros-sync')?.addEventListener('click', onSyncProsettings);
  tool.querySelector('#pros-import')?.addEventListener('click', onImportHltv);
}

// One-click automatic sync: the server scrapes prosettings.net (or a configured
// PRO_SETTINGS_SOURCE_URL feed) and replaces the catalog.
async function onSyncProsettings() {
  const btn = tool.querySelector('#pros-sync');
  if (btn) btn.disabled = true;
  if (!getToken()) {
    setStatus('Please log in as an admin to sync.', 'error');
    openAuth('login');
    if (btn) btn.disabled = false;
    return;
  }
  setStatus('Syncing from prosettings.net…', '');
  try {
    const res = await api.admin.syncPros();
    await load();
    if (res.synced) setStatus(`Synced ${res.count} players from ${res.source}.`, 'ok');
    else setStatus(`Sync failed: ${res.reason || 'unknown error'}. Kept the current list.`, 'error');
  } catch (err) {
    if (err.status === 401) {
      setStatus('Please log in as an admin to sync.', 'error');
      openAuth('login');
    } else {
      setStatus(err.message, 'error');
    }
  } finally {
    const b = tool.querySelector('#pros-sync');
    if (b) b.disabled = false;
  }
}

function onImportHltv() {
  openImportModal({
    title: 'Import pro settings from HLTV',
    description:
      'HLTV has a Cloudflare check that blocks servers. Open HLTV in your browser, complete the verification, then paste a JSON list of players here. Each item: {"player","team","dpi","sens","zoomSens","hz","resolution","aspectRatio","photo","teamLogo"}.',
    sourceUrl: 'https://www.hltv.org/stats/players',
    sourceLabel: 'Open HLTV',
    placeholder: '[{"player":"s1mple","team":"Natus Vincere","dpi":400,"sens":3.09,"hz":1000,"resolution":"1280x960","aspectRatio":"4:3"}]',
    onImport: async (content) => {
      const res = await api.admin.importPros(content);
      await load();
      return `Imported ${res.count} players.`;
    },
  });
}

export async function initProsTool() {
  tool = document.querySelector('#pros-tool');
  if (!tool) return;
  session = getUser();
  subscribe((user) => {
    session = user;
    render();
  });
  render();
  await load();
}
