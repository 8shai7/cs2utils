import { api, isAdmin, resolveMediaUrl } from './api.js';
import { getUser, subscribe } from './session.js';
import { openAuth } from './headerAuth.js';
import {
  MAPS,
  NADE_TYPES,
  TECHNIQUES,
  SIDES,
  mapName,
  typeInfo,
  techniqueName,
  sideName,
  detectMediaKind,
} from './nades.js';
import { renderThrow, canvasPointToNormalized } from './throwCanvas.js';

const CANVAS_SIZE = 360;

let tool;
let session = null;
let view = 'browse';
let statusMsg = { text: '', kind: '' };
let reviewCount = 0;
let loading = false;

let browseFilter = { map: '', type: '' };
let browseData = [];
let mineData = [];
let reviewData = [];
let usersData = [];

let draft = newDraft();

function newDraft() {
  return {
    map: 'mirage',
    type: 'smoke',
    side: 't',
    technique: 'stand',
    title: '',
    description: '',
    start: null,
    end: null,
  };
}

/* ---------------- helpers ---------------- */

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeUrl(url) {
  const resolved = resolveMediaUrl(url);
  if (/^https?:\/\//.test(resolved) || resolved.startsWith('data:image/')) return resolved;
  return '';
}

function youtubeId(url) {
  const m =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(url || '');
  return m ? m[1] : null;
}

function optionList(items, selected) {
  return items
    .map((it) => `<option value="${it.id}"${it.id === selected ? ' selected' : ''}>${esc(it.name)}</option>`)
    .join('');
}

function setStatus(text, kind = '') {
  statusMsg = { text, kind };
  const el = tool?.querySelector('#nades-status');
  if (el) {
    el.textContent = text;
    el.className = `status${kind ? ` ${kind}` : ''}`;
  }
}

function statusBadge(status) {
  return `<span class="nade-badge ${status}">${status}</span>`;
}

function fmtDate(value) {
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return '';
  }
}

/* ---------------- data loading ---------------- */

async function updateReviewCount() {
  if (isAdmin(session)) {
    try {
      reviewCount = await api.admin.pendingCount();
    } catch {
      reviewCount = 0;
    }
  } else {
    reviewCount = 0;
  }
}

async function loadView(next) {
  view = next;
  loading = next !== 'add';
  if (loading) render();
  try {
    if (view === 'browse') browseData = await api.nades.list(browseFilter);
    if (view === 'mine' && session) mineData = await api.nades.mine();
    if (view === 'review' && isAdmin(session)) {
      reviewData = await api.admin.pending();
      reviewCount = await api.admin.pendingCount();
    }
    if (view === 'users' && isAdmin(session)) usersData = await api.admin.users();
  } catch (err) {
    setStatus(err.message, 'error');
  }
  loading = false;
  render();
}

/* ---------------- media rendering ---------------- */

function mediaEmbed(m) {
  const url = safeUrl(m.url);
  if (!url) return '';
  if (m.kind === 'video') {
    const yt = youtubeId(m.url);
    if (yt) {
      return `<iframe class="nade-media-embed" src="https://www.youtube.com/embed/${esc(yt)}" title="nade video" allowfullscreen loading="lazy"></iframe>`;
    }
    if (/\.(mp4|webm|mov)(\?|$)/i.test(m.url)) {
      return `<video class="nade-media-embed" src="${esc(url)}" controls preload="none"></video>`;
    }
    return `<a class="btn ghost" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open video ↗</a>`;
  }
  return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer"><img class="nade-media-img" src="${esc(url)}" alt="${esc(m.addedByName || 'nade media')}" loading="lazy" /></a>`;
}

/* ---------------- views ---------------- */

function nadeCardHtml(nade, { showStatus = false } = {}) {
  const t = typeInfo(nade.type);
  const media = (nade.media || []).filter((m) => (showStatus ? true : m.status === 'approved'));
  const mediaHtml = media.length
    ? `<div class="nade-media">${media
        .map(
          (m) =>
            `<div class="nade-media-item">${mediaEmbed(m)}${
              showStatus ? `<div class="nade-media-meta">${statusBadge(m.status)} <span>by ${esc(m.addedByName || '')}</span></div>` : ''
            }</div>`,
        )
        .join('')}</div>`
    : `<p class="hint">No approved media yet — a 2D throw preview is shown above.</p>`;

  return `
    <article class="nade-card">
      <div class="nade-card-head">
        <div>
          <h3>${esc(nade.title)}</h3>
          <p class="nade-sub">
            <span class="nade-chip" style="--chip:${t.color}">${esc(t.name)}</span>
            ${esc(mapName(nade.map))} · ${esc(sideName(nade.side))} · ${esc(techniqueName(nade.technique))}
          </p>
        </div>
        ${showStatus ? statusBadge(nade.status) : ''}
      </div>
      <canvas class="nade-canvas" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}"
        data-map="${esc(nade.map)}" data-type="${esc(nade.type)}"
        data-sx="${nade.start.x}" data-sy="${nade.start.y}" data-ex="${nade.end.x}" data-ey="${nade.end.y}"></canvas>
      ${nade.description ? `<p class="nade-desc">${esc(nade.description)}</p>` : ''}
      ${mediaHtml}
      <p class="nade-foot">by ${esc(nade.authorName)} · ${fmtDate(nade.createdAt)}</p>
    </article>`;
}

function browseHtml() {
  const cards = browseData.length
    ? browseData.map((n) => nadeCardHtml(n)).join('')
    : `<p class="hint">No approved nades yet${
        session ? ' — be the first to add one!' : ' — log in and add the nades you found.'
      }</p>`;
  return `
    <div class="nades-filters">
      <label class="field">
        <span>Map</span>
        <select id="filter-map"><option value="">All maps</option>${optionList(MAPS, browseFilter.map)}</select>
      </label>
      <label class="field">
        <span>Type</span>
        <select id="filter-type"><option value="">All types</option>${optionList(NADE_TYPES, browseFilter.type)}</select>
      </label>
    </div>
    <div class="nade-grid">${cards}</div>`;
}

function loginPrompt(action) {
  return `<div class="login-prompt">
    <p class="hint">Log in or create an account to ${esc(action)}.</p>
    <div class="actions">
      <button class="btn primary" data-open-auth="login">Log in</button>
      <button class="btn" data-open-auth="register">Register</button>
    </div>
  </div>`;
}

function addHtml() {
  if (!session) return loginPrompt('add nades');
  return `
    <div class="nade-add">
      <div class="nade-add-map">
        <ol class="nade-steps">
          <li>Pick the <strong>map</strong> and <strong>grenade type</strong> on the right.</li>
          <li>Click the map once to drop your <strong>throw position</strong>.</li>
          <li>Click again to set the <strong>landing spot</strong>.</li>
          <li>Fill in the details, add optional media, and submit for review.</li>
        </ol>
        <canvas id="nade-add-canvas" class="nade-canvas interactive" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}"></canvas>
        <p class="hint" id="nade-add-coords">Step 2: click the map to set your throw position.</p>
      </div>
      <form class="nade-add-form" id="nade-add-form">
        <label class="field"><span>Title</span><input id="add-title" type="text" maxlength="160" placeholder="A site smoke from T ramp" value="${esc(draft.title)}" /></label>
        <div class="sens-grid">
          <label class="field"><span>Map</span><select id="add-map">${optionList(MAPS, draft.map)}</select></label>
          <label class="field"><span>Type</span><select id="add-type">${optionList(NADE_TYPES, draft.type)}</select></label>
        </div>
        <div class="sens-grid">
          <label class="field"><span>Side</span><select id="add-side">${optionList(SIDES, draft.side)}</select></label>
          <label class="field"><span>Technique</span><select id="add-technique">${optionList(TECHNIQUES, draft.technique)}</select></label>
        </div>
        <label class="field"><span>Description (optional)</span><textarea id="add-description" rows="3" placeholder="Where to stand, what to line up, jumpthrow timing...">${esc(draft.description)}</textarea></label>
        <label class="field"><span>Video URL (optional — YouTube or .mp4)</span><input id="add-video" type="url" placeholder="https://youtu.be/..." /></label>
        <label class="field"><span>Image URL (optional)</span><input id="add-image" type="url" placeholder="https://.../lineup.jpg" /></label>
        <label class="field"><span>Or upload an image (optional)</span><input id="add-upload" type="file" accept="image/*" /></label>
        <div class="actions">
          <button class="btn primary" type="submit">Submit for review</button>
          <button class="btn ghost" type="button" id="add-clear">Clear points</button>
        </div>
        <p class="hint">Submissions are reviewed by an admin before appearing publicly.</p>
      </form>
    </div>`;
}

function mineHtml() {
  if (!session) return loginPrompt('see and manage your nades');
  if (!mineData.length) return `<p class="hint">You haven't added any nades yet.</p>`;
  return `<div class="nade-grid">${mineData
    .map(
      (n) => `
      <div class="nade-mine">
        ${nadeCardHtml(n, { showStatus: true })}
        ${n.reviewNote ? `<p class="hint">Reviewer note: ${esc(n.reviewNote)}</p>` : ''}
        <div class="nade-add-media">
          <input type="url" class="add-media-url" data-nade="${n.id}" placeholder="Add media URL (image or video)" />
          <button class="btn" data-add-media="${n.id}">Add media</button>
          <button class="btn ghost" data-delete-nade="${n.id}">Delete</button>
        </div>
      </div>`,
    )
    .join('')}</div>`;
}

function reviewHtml() {
  if (!isAdmin(session)) return `<p class="hint">Admins only.</p>`;
  if (!reviewData.length) return `<p class="hint">Nothing pending review. Nice and clean.</p>`;
  return `<div class="nade-grid">${reviewData
    .map((n) => {
      const pendingMedia = (n.media || []).filter((m) => m.status === 'pending');
      const mediaReview = pendingMedia.length
        ? `<div class="review-media">${pendingMedia
            .map(
              (m) => `<div class="review-media-item">${mediaEmbed(m)}
                <div class="actions">
                  <button class="btn" data-approve-media="${m.id}">Approve media</button>
                  <button class="btn ghost" data-reject-media="${m.id}">Reject</button>
                </div></div>`,
            )
            .join('')}</div>`
        : '';
      const nadeButtons =
        n.status === 'pending'
          ? `<div class="review-actions">
               <input type="text" class="review-note" data-nade="${n.id}" placeholder="Optional note to the author" />
               <button class="btn primary" data-approve-nade="${n.id}">Approve nade</button>
               <button class="btn ghost" data-reject-nade="${n.id}">Reject</button>
             </div>`
          : `<p class="hint">Nade already ${esc(n.status)} — reviewing added media only.</p>`;
      return `<div class="nade-mine">${nadeCardHtml(n, { showStatus: true })}${mediaReview}${nadeButtons}</div>`;
    })
    .join('')}</div>`;
}

function usersHtml() {
  if (!isAdmin(session)) return `<p class="hint">Admins only.</p>`;
  return `<div class="users-table">
    ${usersData
      .map(
        (u) => `<div class="user-row">
          <div><strong>${esc(u.username)}</strong><br /><span class="hint">${esc(u.email)}</span></div>
          <div>${statusBadge(u.role)}</div>
          <div>${
            u.role === 'owner'
              ? '<span class="hint">owner</span>'
              : u.role === 'admin'
                ? `<button class="btn ghost" data-role-user="${u.id}" data-role="user">Revoke admin</button>`
                : `<button class="btn" data-role-user="${u.id}" data-role="admin">Make admin</button>`
          }</div>
        </div>`,
      )
      .join('')}
  </div>`;
}

function subnavHtml() {
  const items = [['browse', 'Browse']];
  if (session) items.push(['add', 'Add nade'], ['mine', 'My nades']);
  if (isAdmin(session)) items.push(['review', `Review${reviewCount ? ` (${reviewCount})` : ''}`], ['users', 'Users']);
  return `<nav class="nades-subnav">${items
    .map(([id, label]) => `<button class="tool-tab ${view === id ? 'active' : ''}" data-view="${id}">${esc(label)}</button>`)
    .join('')}</nav>`;
}

function viewBodyHtml() {
  if (loading) return `<div class="nades-loading"><span class="spinner"></span> Loading…</div>`;
  switch (view) {
    case 'add':
      return addHtml();
    case 'mine':
      return mineHtml();
    case 'review':
      return reviewHtml();
    case 'users':
      return usersHtml();
    default:
      return browseHtml();
  }
}

/* ---------------- render + wiring ---------------- */

function render() {
  tool.innerHTML = `
    <div class="nades-shell">
      ${subnavHtml()}
      <div class="nades-body">${viewBodyHtml()}</div>
      <div id="nades-status" class="status ${statusMsg.kind}">${esc(statusMsg.text)}</div>
    </div>`;
  wire();
  drawCanvases();
}

function drawCanvases() {
  tool.querySelectorAll('canvas.nade-canvas:not(.interactive)').forEach((c) => {
    renderThrow(c, {
      mapId: c.dataset.map,
      type: c.dataset.type,
      start: { x: Number(c.dataset.sx), y: Number(c.dataset.sy) },
      end: { x: Number(c.dataset.ex), y: Number(c.dataset.ey) },
    });
  });
  drawAddCanvas();
}

function drawAddCanvas() {
  const c = tool.querySelector('#nade-add-canvas');
  if (!c) return;
  renderThrow(c, { mapId: draft.map, type: draft.type, start: draft.start, end: draft.end });
}

function wire() {
  // Open the global header auth modal from in-tool prompts.
  tool.querySelectorAll('[data-open-auth]').forEach((b) =>
    b.addEventListener('click', () => openAuth(b.dataset.openAuth)),
  );

  // Subnav
  tool.querySelectorAll('[data-view]').forEach((b) =>
    b.addEventListener('click', () => loadView(b.dataset.view)),
  );

  // Browse filters
  tool.querySelector('#filter-map')?.addEventListener('change', (e) => {
    browseFilter.map = e.target.value;
    loadView('browse');
  });
  tool.querySelector('#filter-type')?.addEventListener('change', (e) => {
    browseFilter.type = e.target.value;
    loadView('browse');
  });

  // Add form
  const addCanvas = tool.querySelector('#nade-add-canvas');
  if (addCanvas) {
    addCanvas.addEventListener('click', (e) => {
      const pt = canvasPointToNormalized(addCanvas, e);
      if (!draft.start || (draft.start && draft.end)) {
        draft.start = pt;
        draft.end = null;
      } else {
        draft.end = pt;
      }
      const coords = tool.querySelector('#nade-add-coords');
      if (coords) {
        coords.textContent = !draft.end
          ? 'Now click the landing spot for the grenade.'
          : 'Throw + landing set. Adjust by clicking again to start over.';
      }
      drawAddCanvas();
    });
  }
  tool.querySelector('#add-map')?.addEventListener('change', (e) => {
    draft.map = e.target.value;
    drawAddCanvas();
  });
  tool.querySelector('#add-type')?.addEventListener('change', (e) => {
    draft.type = e.target.value;
    drawAddCanvas();
  });
  tool.querySelector('#add-clear')?.addEventListener('click', () => {
    draft.start = null;
    draft.end = null;
    drawAddCanvas();
    const coords = tool.querySelector('#nade-add-coords');
    if (coords) coords.textContent = 'Click the map to set the throw position, then click again for the landing spot.';
  });
  tool.querySelector('#nade-add-form')?.addEventListener('submit', onAddSubmit);

  // My nades: add media / delete
  tool.querySelectorAll('[data-add-media]').forEach((b) =>
    b.addEventListener('click', () => onAddMedia(b.dataset.addMedia)),
  );
  tool.querySelectorAll('[data-delete-nade]').forEach((b) =>
    b.addEventListener('click', () => onDeleteNade(b.dataset.deleteNade)),
  );

  // Review actions
  tool.querySelectorAll('[data-approve-nade]').forEach((b) =>
    b.addEventListener('click', () => onReviewNade(b.dataset.approveNade, 'approved')),
  );
  tool.querySelectorAll('[data-reject-nade]').forEach((b) =>
    b.addEventListener('click', () => onReviewNade(b.dataset.rejectNade, 'rejected')),
  );
  tool.querySelectorAll('[data-approve-media]').forEach((b) =>
    b.addEventListener('click', () => onReviewMedia(b.dataset.approveMedia, 'approved')),
  );
  tool.querySelectorAll('[data-reject-media]').forEach((b) =>
    b.addEventListener('click', () => onReviewMedia(b.dataset.rejectMedia, 'rejected')),
  );

  // Users
  tool.querySelectorAll('[data-role-user]').forEach((b) =>
    b.addEventListener('click', () => onSetRole(b.dataset.roleUser, b.dataset.role)),
  );
}

/* ---------------- actions ---------------- */

async function onAddSubmit(e) {
  e.preventDefault();
  draft.title = tool.querySelector('#add-title')?.value || '';
  draft.map = tool.querySelector('#add-map')?.value || draft.map;
  draft.type = tool.querySelector('#add-type')?.value || draft.type;
  draft.side = tool.querySelector('#add-side')?.value || draft.side;
  draft.technique = tool.querySelector('#add-technique')?.value || draft.technique;
  draft.description = tool.querySelector('#add-description')?.value || '';

  if (!draft.start || !draft.end) {
    setStatus('Click the map to set both the throw position and the landing spot.', 'error');
    return;
  }

  const media = [];
  const videoUrl = (tool.querySelector('#add-video')?.value || '').trim();
  const imageUrl = (tool.querySelector('#add-image')?.value || '').trim();
  if (videoUrl) media.push({ url: videoUrl, kind: 'video' });
  if (imageUrl) media.push({ url: imageUrl, kind: detectMediaKind(imageUrl) });

  const fileInput = tool.querySelector('#add-upload');
  try {
    if (fileInput?.files?.[0]) {
      setStatus('Uploading image…', '');
      const up = await api.uploads.image(fileInput.files[0]);
      media.push({ url: up.url, kind: 'image' });
    }
    await api.nades.create({ ...draft, media });
    draft = newDraft();
    await loadView('mine');
    setStatus('Nade submitted! It will appear publicly once an admin approves it.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onAddMedia(nadeId) {
  const input = tool.querySelector(`.add-media-url[data-nade="${nadeId}"]`);
  const url = (input?.value || '').trim();
  if (!url) {
    setStatus('Enter a media URL first.', 'error');
    return;
  }
  try {
    await api.nades.addMedia(nadeId, { url, kind: detectMediaKind(url) });
    await loadView('mine');
    setStatus('Media added — pending admin review.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onDeleteNade(nadeId) {
  try {
    await api.nades.remove(nadeId);
    await loadView('mine');
    setStatus('Nade deleted.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onReviewNade(nadeId, decision) {
  const note = tool.querySelector(`.review-note[data-nade="${nadeId}"]`)?.value || '';
  try {
    await api.admin.reviewNade(nadeId, decision, note);
    await loadView('review');
    setStatus(`Nade ${decision}.`, 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onReviewMedia(mediaId, decision) {
  try {
    await api.admin.reviewMedia(mediaId, decision);
    await loadView('review');
    setStatus(`Media ${decision}.`, 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onSetRole(userId, role) {
  try {
    await api.admin.setRole(userId, role);
    await loadView('users');
    setStatus('Role updated.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

/* ---------------- init ---------------- */

export async function initNadesTool() {
  tool = document.querySelector('#nades-tool');
  if (!tool) return;

  session = getUser();

  // Subscribe BEFORE the initial load so we never miss the header's async
  // session restore (which may resolve while we're still loading).
  subscribe(async (user) => {
    session = user;
    await updateReviewCount();
    // Drop into a view the current role is allowed to see.
    if (!session && ['add', 'mine', 'review', 'users'].includes(view)) view = 'browse';
    if (session && !isAdmin(session) && ['review', 'users'].includes(view)) view = 'browse';
    await loadView(view);
  });

  await updateReviewCount();
  render();
  await loadView('browse');
}
