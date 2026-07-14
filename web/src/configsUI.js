import { api, isAdmin } from './api.js';
import { getUser, subscribe } from './session.js';
import { openAuth } from './headerAuth.js';
import { authorChipHtml } from './authorChip.js';

let tool;
let session = null;
let list = [];
let sort = 'top';
let showUpload = false;
let statusMsg = { text: '', kind: '' };
const expanded = new Set();

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
  const el = tool?.querySelector('#configs-status');
  if (el) {
    el.textContent = text;
    el.className = `status${kind ? ` ${kind}` : ''}`;
  }
}

function fmtDate(v) {
  try {
    return new Date(v).toLocaleDateString();
  } catch {
    return '';
  }
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function load() {
  try {
    list = await api.configs.list({ sort });
  } catch (err) {
    setStatus(err.message, 'error');
  }
  render();
}

function starsDisplay(avg) {
  const full = Math.round(avg);
  let out = '';
  for (let i = 1; i <= 5; i += 1) out += i <= full ? '★' : '☆';
  return out;
}

function ratingRow(c) {
  if (!session) return `<button class="btn btn-sm" data-open-auth="login">Log in to rate</button>`;
  if (c.authorId === session.id) return `<span class="hint">Your upload</span>`;
  let stars = '';
  for (let i = 1; i <= 5; i += 1) {
    stars += `<button class="star-btn ${i <= c.myRating ? 'on' : ''}" data-rate="${c.id}" data-star="${i}" title="${i} star${i > 1 ? 's' : ''}">${i <= c.myRating ? '★' : '☆'}</button>`;
  }
  return `<span class="rate-label">Your rating:</span><span class="star-picker">${stars}</span>`;
}

function cardHtml(c) {
  const isOpen = expanded.has(c.id);
  const canDelete = session && (c.authorId === session.id || isAdmin(session));
  const search = `${c.title} ${c.description} ${c.authorName}`.toLowerCase();
  return `
    <article class="config-card" data-search="${esc(search)}">
      <div class="config-head">
        <h3>${esc(c.title)}</h3>
        <div class="config-rating" title="${c.avgRating} from ${c.ratingCount} rating(s)">
          <span class="stars">${starsDisplay(c.avgRating)}</span>
          <span class="rating-num">${c.avgRating || '—'} (${c.ratingCount})</span>
        </div>
      </div>
      ${c.description ? `<p class="config-desc">${esc(c.description)}</p>` : ''}
      <div class="config-tags">
        ${c.hasConfig ? '<span class="cmd-tag">config .cfg</span>' : ''}
        ${c.hasVideo ? '<span class="cmd-tag">video settings</span>' : ''}
      </div>
      <div class="config-actions">
        ${c.hasConfig ? `<button class="btn btn-sm" data-dl="${c.id}" data-kind="config">Download .cfg</button>` : ''}
        ${c.hasVideo ? `<button class="btn btn-sm" data-dl="${c.id}" data-kind="video">Download video settings</button>` : ''}
        <button class="btn btn-sm ghost" data-view="${c.id}">${isOpen ? 'Hide' : 'View'}</button>
        ${canDelete ? `<button class="btn btn-sm ghost" data-del="${c.id}">Delete</button>` : ''}
      </div>
      ${
        isOpen
          ? `<div class="config-view">
               ${c.hasConfig ? `<div><strong>Config</strong><pre>${esc(c.configText)}</pre></div>` : ''}
               ${c.hasVideo ? `<div><strong>Video settings</strong><pre>${esc(c.videoText)}</pre></div>` : ''}
             </div>`
          : ''
      }
      <div class="config-foot">
        ${authorChipHtml(c, { date: fmtDate(c.createdAt) })}
        <span class="config-rate">${ratingRow(c)}</span>
      </div>
    </article>`;
}

function uploadFormHtml() {
  if (!session) return '';
  if (!showUpload) return '';
  return `
    <section class="panel config-upload">
      <div class="panel-head"><h2>Upload a config</h2><span class="panel-tag">Shared publicly</span></div>
      <div class="config-upload-body">
        <label class="field"><span>Title</span><input id="cfg-title" type="text" maxlength="160" placeholder="My CS2 practice + video config" /></label>
        <label class="field"><span>Description (optional)</span><textarea id="cfg-desc" rows="2" maxlength="1000" placeholder="What's in it, who it's for…"></textarea></label>
        <label class="field">
          <span>autoexec / config (.cfg) — paste or upload</span>
          <input id="cfg-config-file" type="file" accept=".cfg,.txt,text/plain" />
          <textarea id="cfg-config" rows="6" spellcheck="false" placeholder="cl_crosshairsize 2; ..."></textarea>
        </label>
        <label class="field">
          <span>Video settings (cs2_video.txt) — paste or upload</span>
          <input id="cfg-video-file" type="file" accept=".txt,text/plain" />
          <textarea id="cfg-video" rows="6" spellcheck="false" placeholder='"video.cfg" { "setting.defaultres" "1920" ... }'></textarea>
        </label>
        <div class="actions">
          <button class="btn primary" id="cfg-submit">Publish config</button>
          <button class="btn ghost" id="cfg-cancel">Cancel</button>
        </div>
      </div>
    </section>`;
}

function render() {
  tool.innerHTML = `
    <div class="configs-shell">
      <div class="configs-controls">
        <div class="sort-tabs">
          <button class="tool-tab ${sort === 'top' ? 'active' : ''}" data-sort="top">Most rated</button>
          <button class="tool-tab ${sort === 'new' ? 'active' : ''}" data-sort="new">Last uploaded</button>
        </div>
        <input id="cfg-search" type="search" class="cfg-search" placeholder="Search configs by title, author…" />
        ${session ? `<button class="btn primary" id="cfg-new">Upload config</button>` : `<button class="btn primary" data-open-auth="login">Log in to upload</button>`}
      </div>
      ${uploadFormHtml()}
      <div class="config-grid">
        ${list.length ? list.map(cardHtml).join('') : `<p class="hint">No configs yet — be the first to upload one!</p>`}
      </div>
      <div id="configs-status" class="status ${statusMsg.kind}">${esc(statusMsg.text)}</div>
    </div>`;
  wire();
}

function applySearch(q) {
  const query = q.trim().toLowerCase();
  tool.querySelectorAll('.config-card').forEach((card) => {
    card.classList.toggle('hidden', query && !card.dataset.search.includes(query));
  });
}

function wire() {
  tool.querySelectorAll('[data-open-auth]').forEach((b) => b.addEventListener('click', () => openAuth(b.dataset.openAuth)));
  tool.querySelectorAll('[data-sort]').forEach((b) =>
    b.addEventListener('click', () => {
      sort = b.dataset.sort;
      load();
    }),
  );
  tool.querySelector('#cfg-search')?.addEventListener('input', (e) => applySearch(e.target.value));
  tool.querySelector('#cfg-new')?.addEventListener('click', () => {
    showUpload = true;
    render();
  });
  tool.querySelector('#cfg-cancel')?.addEventListener('click', () => {
    showUpload = false;
    render();
  });
  tool.querySelector('#cfg-submit')?.addEventListener('click', onSubmit);

  // file → textarea
  tool.querySelector('#cfg-config-file')?.addEventListener('change', (e) => fillFromFile(e.target, '#cfg-config'));
  tool.querySelector('#cfg-video-file')?.addEventListener('change', (e) => fillFromFile(e.target, '#cfg-video'));

  tool.querySelectorAll('[data-dl]').forEach((b) =>
    b.addEventListener('click', () => {
      const c = list.find((x) => String(x.id) === b.dataset.dl);
      if (!c) return;
      if (b.dataset.kind === 'config') download(`${slug(c.title)}.cfg`, c.configText);
      else download('cs2_video.txt', c.videoText);
    }),
  );
  tool.querySelectorAll('[data-view]').forEach((b) =>
    b.addEventListener('click', () => {
      const id = Number(b.dataset.view);
      if (expanded.has(id)) expanded.delete(id);
      else expanded.add(id);
      render();
    }),
  );
  tool.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => onDelete(Number(b.dataset.del))));
  tool.querySelectorAll('[data-rate]').forEach((b) =>
    b.addEventListener('click', () => onRate(Number(b.dataset.rate), Number(b.dataset.star))),
  );
}

function slug(t) {
  return (t || 'config').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40) || 'config';
}

function fillFromFile(input, textareaSel) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const ta = tool.querySelector(textareaSel);
    if (ta) ta.value = String(reader.result || '');
  };
  reader.readAsText(file);
}

async function onSubmit() {
  const title = tool.querySelector('#cfg-title')?.value || '';
  const description = tool.querySelector('#cfg-desc')?.value || '';
  const configText = tool.querySelector('#cfg-config')?.value || '';
  const videoText = tool.querySelector('#cfg-video')?.value || '';
  try {
    await api.configs.create({ title, description, configText, videoText });
    showUpload = false;
    sort = 'new';
    await load();
    setStatus('Config published!', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onRate(id, star) {
  try {
    const res = await api.configs.rate(id, star);
    const c = list.find((x) => x.id === id);
    if (c) {
      c.avgRating = res.avgRating;
      c.ratingCount = res.ratingCount;
      c.myRating = res.myRating;
    }
    render();
    setStatus('Thanks for rating!', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onDelete(id) {
  try {
    await api.configs.remove(id);
    await load();
    setStatus('Config deleted.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

export async function initConfigsTool() {
  tool = document.querySelector('#configs-tool');
  if (!tool) return;
  session = getUser();
  subscribe(async (user) => {
    session = user;
    await load();
  });
  render();
  await load();
}
