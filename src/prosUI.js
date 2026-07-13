import { api, isAdmin } from './api.js';
import { getUser, subscribe } from './session.js';

let tool;
let session = null;
let data = { pros: [], source: 'seed', lastSync: 0 };
let sort = 'name';
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
    data = await api.pros.list({ sort });
  } catch (err) {
    setStatus(err.message, 'error');
  }
  render();
}

function stat(label, value) {
  return `<div class="pro-stat"><dt>${esc(label)}</dt><dd>${value != null && value !== '' ? esc(value) : '—'}</dd></div>`;
}

function cardHtml(p) {
  const search = `${p.player} ${p.team || ''}`.toLowerCase();
  return `
    <article class="pro-card" data-search="${esc(search)}">
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
  const adminBtn = isAdmin(session) ? `<button class="btn btn-sm" id="pros-sync">Sync from HLTV</button>` : '';
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
          <button class="tool-tab ${sort === 'name' ? 'active' : ''}" data-sort="name">Name</button>
          <button class="tool-tab ${sort === 'edpi' ? 'active' : ''}" data-sort="edpi">Lowest eDPI</button>
          <button class="tool-tab ${sort === 'edpi-desc' ? 'active' : ''}" data-sort="edpi-desc">Highest eDPI</button>
        </div>
        <input id="pros-search" type="search" class="cfg-search" placeholder="Search player or team…" />
      </div>
      <p class="hint">Community-sourced approximations. HLTV blocks automated access from most hosts, so live sync may fall back to this list.</p>
      <div class="pro-grid">
        ${data.pros.length ? data.pros.map(cardHtml).join('') : `<p class="hint">No pro settings yet.</p>`}
      </div>
      <div id="pros-status" class="status ${statusMsg.kind}">${esc(statusMsg.text)}</div>
    </div>`;
  wire();
}

function applySearch(q) {
  const query = q.trim().toLowerCase();
  tool.querySelectorAll('.pro-card').forEach((card) => {
    card.classList.toggle('hidden', query && !card.dataset.search.includes(query));
  });
}

function wire() {
  tool.querySelectorAll('[data-sort]').forEach((b) =>
    b.addEventListener('click', () => {
      sort = b.dataset.sort;
      load();
    }),
  );
  tool.querySelector('#pros-search')?.addEventListener('input', (e) => applySearch(e.target.value));
  tool.querySelector('#pros-sync')?.addEventListener('click', onSync);
}

async function onSync() {
  setStatus('Syncing pro settings…', '');
  try {
    const res = await api.admin.syncPros();
    await load();
    setStatus(res.synced ? `Synced ${res.count} players from ${res.source}.` : `Sync unavailable: ${res.reason}`, res.synced ? 'ok' : 'error');
  } catch (err) {
    setStatus(err.message, 'error');
  }
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
