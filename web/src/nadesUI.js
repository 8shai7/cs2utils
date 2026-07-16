import { api, isAdmin, isOwner, resolveMediaUrl } from './api.js';
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
import {
  copyPracticeConsoleCommand,
  downloadPracticePack,
  openSteamPractice,
  practicePackModalHtml,
  readDownloadOptions,
} from './tryInGame.js';
import { showToast } from './toast.js';
import { authorChipHtml } from './authorChip.js';

const CANVAS_SIZE = 360;
const BROWSE_TRY_MAX = 100;

let tool;
let session = null;
let view = 'browse';
let statusMsg = { text: '', kind: '' };
let reviewCount = 0;
let loading = false;

let browseFilter = { map: '', type: '' };
let browseData = [];
let browseSelected = new Map(); // nadeId -> mapId
let favoriteSocial = { counts: {}, mine: [] };
let favoritesData = [];
let mineData = [];
let reviewData = [];
let usersData = [];

let draft = newDraft();
let guideImport = newGuideImport();
let tryGamePack = null;
let tryGameLineupCount = 1;

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

function newGuideImport() {
  return {
    text: '',
    fileName: '',
    side: 't',
    parsed: null,
    selected: null,
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

function setStatus(text, kind = '', opts = {}) {
  statusMsg = { text, kind };
  const el = tool?.querySelector('#nades-status');
  if (el) {
    el.textContent = text;
    el.className = `status${kind ? ` ${kind}` : ''}`;
  }
  // Jumping viewport toast so limit / validation mistakes aren't missed while browsing.
  if ((kind === 'error' || kind === 'warn') && text) {
    showToast(text, { kind, title: opts.title });
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

async function loadFavoriteSocial() {
  try {
    favoriteSocial = await api.nades.social();
  } catch {
    favoriteSocial = { counts: {}, mine: [] };
  }
}

async function loadView(next) {
  view = next;
  loading = !['add', 'import'].includes(next);
  if (loading) render();
  try {
    if (view === 'browse') {
      browseData = await api.nades.list(browseFilter);
      await loadFavoriteSocial();
    }
    if (view === 'favorites') {
      if (session) {
        favoritesData = await api.nades.favorites(browseFilter);
        await loadFavoriteSocial();
      } else {
        favoritesData = [];
      }
    }
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

function nadeCardHtml(nade, { showStatus = false, showTryInGame = false, adminRemove = false, showFavorite = false } = {}) {
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

  const selected = showTryInGame && browseSelected.has(nade.id);
  const isFav = favoriteSocial.mine.includes(nade.id);
  const favCount = favoriteSocial.counts[nade.id] || 0;
  const favBtn = showFavorite
    ? `<button class="btn btn-sm favorite ${isFav ? 'active' : ''}" type="button" data-favorite-nade="${nade.id}" title="${
        isFav ? 'Remove from favorites' : 'Add to favorites'
      }">${isFav ? '★ Favorited' : '☆ Favorite'}${favCount ? ` <span class="fav-count">${favCount}</span>` : ''}</button>`
    : '';

  const tryBtn = showTryInGame
    ? `<div class="nade-card-actions">
         <label class="browse-nade-check">
           <input type="checkbox" class="browse-select" value="${nade.id}" data-map="${esc(nade.map)}" ${
             selected ? 'checked' : ''
           } />
           <span>Select</span>
         </label>
         ${favBtn}
         <button class="btn" type="button" data-try-nades="${nade.id}">Try in game</button>
         ${
           adminRemove && isAdmin(session)
             ? `<button class="btn ghost danger" type="button" data-delete-nade="${nade.id}">Remove</button>`
             : ''
         }
       </div>`
    : favBtn || (adminRemove && isAdmin(session))
      ? `<div class="nade-card-actions">
           ${favBtn}
           ${
             adminRemove && isAdmin(session)
               ? `<button class="btn ghost danger" type="button" data-delete-nade="${nade.id}">Remove</button>`
               : ''
           }
         </div>`
      : '';

  return `
    <article class="nade-card${showTryInGame ? ' browse-nade-card' : ''}${selected ? ' selected' : ''}${
      isFav && showFavorite ? ' favorited' : ''
    }"${
      showTryInGame ? ` data-browse-nade="${nade.id}" data-map="${esc(nade.map)}" tabindex="0" role="checkbox" aria-checked="${selected ? 'true' : 'false'}"` : ''
    }>
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
      <div class="nade-foot">${authorChipHtml(nade, { date: fmtDate(nade.createdAt) })}</div>
      ${tryBtn}
    </article>`;
}

function browseSelectedIds() {
  return [...browseSelected.keys()];
}

function browseHtml() {
  const cards = browseData.length
    ? browseData.map((n) => nadeCardHtml(n, { showTryInGame: true, adminRemove: true, showFavorite: true })).join('')
    : `<p class="hint">No approved nades yet${
        session ? ' — be the first to add one!' : ' — log in and add the nades you found.'
      }</p>`;
  const selectedCount = browseSelected.size;
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
    <div class="browse-select-bar">
      <span class="hint">Click a lineup to select it (up to ${BROWSE_TRY_MAX}, same map) for one merged annotation file.</span>
      <button class="btn ghost" type="button" id="browse-select-clear" ${selectedCount ? '' : 'disabled'}>Clear selection</button>
      <button class="btn primary" type="button" id="browse-try-selected" ${selectedCount ? '' : 'disabled'}>
        Try selected in game (${selectedCount}/${BROWSE_TRY_MAX})
      </button>
    </div>
    <div class="nade-grid">${cards}</div>`;
}

function favoritesHtml() {
  if (!session) return loginPrompt('save favorite nades');
  const cards = favoritesData.length
    ? favoritesData.map((n) => nadeCardHtml(n, { showTryInGame: true, adminRemove: true, showFavorite: true })).join('')
    : `<p class="hint">No favorites yet — star lineups in Browse to save them here.</p>`;
  const selectedCount = browseSelected.size;
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
    <div class="browse-select-bar">
      <span class="hint">Your saved lineups. Select up to ${BROWSE_TRY_MAX} (same map) to try in game.</span>
      <button class="btn ghost" type="button" id="browse-select-clear" ${selectedCount ? '' : 'disabled'}>Clear selection</button>
      <button class="btn primary" type="button" id="browse-try-selected" ${selectedCount ? '' : 'disabled'}>
        Try selected in game (${selectedCount}/${BROWSE_TRY_MAX})
      </button>
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

function guideImportHtml() {
  if (!session) return loginPrompt('import a CS2 map guide');
  const parsed = guideImport.parsed;
  const selected =
    parsed && guideImport.selected != null ? parsed.nades[guideImport.selected] : parsed?.nades?.[0] || null;
  const previewList = parsed
    ? `<div class="guide-preview-list">
        ${parsed.nades
          .map((n, i) => {
            const t = typeInfo(n.type);
            const active = (guideImport.selected ?? 0) === i;
            return `<button type="button" class="guide-preview-item ${active ? 'active' : ''}" data-guide-idx="${i}">
              <span class="nade-chip" style="--chip:${t.color}">${esc(t.name)}</span>
              <strong>${esc(n.title)}</strong>
              <span class="hint">${esc(techniqueName(n.technique))}</span>
            </button>`;
          })
          .join('')}
      </div>`
    : '';

  return `
    <div class="nade-import">
      <div class="nade-add-map">
        <ol class="nade-steps">
          <li>In CS2, save a guide with <code>annotation_save name</code>.</li>
          <li>Upload the <code>.txt</code> from <code>game/csgo/annotations/local/</code> (or paste it).</li>
          <li>Preview lineups on the radar, then import — they enter review as pending.</li>
        </ol>
        <canvas id="guide-preview-canvas" class="nade-canvas" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}"></canvas>
        <p class="hint" id="guide-preview-label">${
          selected
            ? `${esc(selected.title)} · ${esc(mapName(selected.map))}`
            : 'Parsed lineups will preview here.'
        }</p>
        ${previewList}
      </div>
      <div class="nade-add-form">
        <label class="field">
          <span>Map guide file (.txt)</span>
          <input id="guide-file" type="file" accept=".txt,text/plain" />
        </label>
        ${
          guideImport.fileName
            ? `<p class="hint">Loaded: <strong>${esc(guideImport.fileName)}</strong></p>`
            : ''
        }
        <label class="field">
          <span>Or paste guide text</span>
          <textarea id="guide-text" rows="10" placeholder="<!-- kv3 encoding:text:... -->&#10;{&#10;  MapName = &quot;de_mirage&quot;&#10;  MapAnnotationNode0 = { ... }&#10;}">${esc(guideImport.text)}</textarea>
        </label>
        <label class="field">
          <span>Default side for imported nades</span>
          <select id="guide-side">${optionList(SIDES, guideImport.side)}</select>
        </label>
        <div class="actions">
          <button class="btn" type="button" id="guide-parse">Preview lineups</button>
          <button class="btn primary" type="button" id="guide-import" ${parsed ? '' : 'disabled'}>
            Import ${parsed ? parsed.nades.length : ''} for review
          </button>
          <button class="btn" type="button" id="guide-try-game" ${parsed ? '' : 'disabled'}>
            Try in game
          </button>
          <button class="btn ghost" type="button" id="guide-clear">Clear</button>
        </div>
        ${
          parsed
            ? `<p class="hint">Detected <strong>${esc(mapName(parsed.map))}</strong> (${esc(
                parsed.mapName,
              )}) — ${parsed.nades.length} grenade lineup${parsed.nades.length === 1 ? '' : 's'}${
                parsed.skipped ? `, skipped ${parsed.skipped}` : ''
              }.</p>`
            : `<p class="hint">Official CS2 Map Guides / annotation files only. World coords are mapped onto AimKit’s radar automatically.</p>`
        }
      </div>
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
          ${
            n.guideImportId
              ? `<button class="btn" data-try-import="${n.guideImportId}">Try in game</button>`
              : ''
          }
          <button class="btn ghost" data-delete-nade="${n.id}">Delete</button>
        </div>
      </div>`,
    )
    .join('')}</div>`;
}

function reviewHtml() {
  if (!isAdmin(session)) return `<p class="hint">Admins only.</p>`;
  if (!reviewData.length) return `<p class="hint">Nothing pending review. Nice and clean.</p>`;
  const pendingNades = reviewData.filter((n) => n.status === 'pending');
  return `
    <div class="review-bulk-bar">
      <label class="review-select-all">
        <input type="checkbox" id="review-select-all" />
        <span>Select all pending nades (${pendingNades.length})</span>
      </label>
      <input type="text" id="review-bulk-note" placeholder="Optional note for bulk decision" />
      <button class="btn primary" type="button" id="review-bulk-approve" disabled>Approve selected</button>
      <button class="btn ghost" type="button" id="review-bulk-reject" disabled>Reject selected</button>
    </div>
    <div class="nade-grid">${reviewData
      .map((n) => {
        const allMedia = n.media || [];
        const mediaReview = allMedia.length
          ? `<div class="review-media">${allMedia
              .map(
                (m) => `<div class="review-media-item">${mediaEmbed(m)}
                  <div class="nade-media-meta">${statusBadge(m.status)} <span>by ${esc(m.addedByName || '')}</span></div>
                  <div class="actions">
                    ${
                      m.status === 'pending'
                        ? `<button class="btn" data-approve-media="${m.id}">Approve media</button>
                           <button class="btn ghost" data-reject-media="${m.id}">Reject</button>`
                        : m.status === 'approved'
                          ? `<button class="btn ghost" data-reject-media="${m.id}">Unpublish</button>`
                          : `<button class="btn" data-approve-media="${m.id}">Approve media</button>`
                    }
                    <button class="btn ghost danger" data-delete-media="${m.id}">Remove</button>
                  </div></div>`,
              )
              .join('')}</div>`
          : '';
        const nadeButtons =
          n.status === 'pending'
            ? `<div class="review-actions">
                 <label class="review-check">
                   <input type="checkbox" class="review-nade-check" value="${n.id}" />
                   <span>Select</span>
                 </label>
                 <div class="review-actions-btns">
                   <button class="btn primary" data-approve-nade="${n.id}">Approve</button>
                   <button class="btn ghost" data-reject-nade="${n.id}">Reject</button>
                   <button class="btn ghost danger" data-delete-nade="${n.id}">Delete</button>
                 </div>
                 <input type="text" class="review-note" data-nade="${n.id}" placeholder="Optional note to the author" />
               </div>`
            : `<div class="review-actions">
                 <p class="hint">Nade already ${esc(n.status)} — you can still unpublish, re-approve, or delete it.</p>
                 <div class="review-actions-btns">
                   ${
                     n.status !== 'approved'
                       ? `<button class="btn primary" data-approve-nade="${n.id}">Approve</button>`
                       : `<button class="btn ghost" data-reject-nade="${n.id}">Unpublish</button>`
                   }
                   <button class="btn ghost danger" data-delete-nade="${n.id}">Delete</button>
                 </div>
                 <input type="text" class="review-note" data-nade="${n.id}" placeholder="Optional note to the author" />
               </div>`;
        return `<div class="nade-mine">${nadeCardHtml(n, { showStatus: true })}${mediaReview}${nadeButtons}</div>`;
      })
      .join('')}</div>`;
}

function banInfo(u) {
  if (!u.bannedUntil) return null;
  const until = new Date(u.bannedUntil);
  if (until.getTime() <= Date.now()) return null;
  return until.getFullYear() >= 9999 ? 'permanently' : `until ${until.toLocaleString()}`;
}

function usersHtml() {
  if (!isAdmin(session)) return `<p class="hint">Admins only.</p>`;
  const ownerCanPromote = isOwner(session);
  return `<div class="users-table">
    ${
      ownerCanPromote
        ? '<p class="hint users-table-hint">Promote trusted users to admin, or remove admin access.</p>'
        : '<p class="hint users-table-hint">Only the site owner can promote users to admin.</p>'
    }
    ${usersData
      .map((u) => {
        const ban = banInfo(u);
        const roleCol =
          u.role === 'owner'
            ? '<span class="hint">owner</span>'
            : ownerCanPromote
              ? u.role === 'admin'
                ? `<button class="btn btn-sm ghost" data-role-user="${u.id}" data-role="user">Remove admin</button>`
                : `<button class="btn btn-sm primary" data-role-user="${u.id}" data-role="admin">Promote to admin</button>`
              : `<span class="hint">${esc(u.role)}</span>`;
        const banCol =
          u.role === 'owner'
            ? ''
            : ban
              ? `<span class="nade-badge rejected">banned ${esc(ban)}</span> <button class="btn btn-sm ghost" data-unban="${u.id}">Unban</button>`
              : `<select class="ban-duration" data-ban-dur="${u.id}">
                   <option value="24">1 day</option>
                   <option value="168">7 days</option>
                   <option value="720">30 days</option>
                   <option value="perma">Permanent</option>
                 </select>
                 <button class="btn btn-sm ghost" data-ban="${u.id}">Ban</button>`;
        return `<div class="user-row">
          <div><strong>${esc(u.username)}</strong><br /><span class="hint">${esc(u.email)}</span></div>
          <div>${statusBadge(u.role)}</div>
          <div class="user-actions">${roleCol}</div>
          <div class="user-actions">${banCol}</div>
        </div>`;
      })
      .join('')}
  </div>`;
}

function subnavHtml() {
  const favCount = favoriteSocial.mine?.length || 0;
  const items = [['browse', 'Browse']];
  if (session) {
    items.push(['favorites', `Favorites${favCount ? ` (${favCount})` : ''}`]);
    items.push(['add', 'Add nade'], ['import', 'Import guide'], ['mine', 'My nades']);
  }
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
    case 'import':
      return guideImportHtml();
    case 'favorites':
      return favoritesHtml();
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
      ${tryGamePack ? practicePackModalHtml(tryGamePack, { esc, lineupCount: tryGameLineupCount }) : ''}
    </div>`;
  wire();
  drawCanvases();
}

function drawCanvases() {
  tool.querySelectorAll('canvas.nade-canvas:not(.interactive):not(#guide-preview-canvas)').forEach((c) => {
    renderThrow(c, {
      mapId: c.dataset.map,
      type: c.dataset.type,
      start: { x: Number(c.dataset.sx), y: Number(c.dataset.sy) },
      end: { x: Number(c.dataset.ex), y: Number(c.dataset.ey) },
    });
  });
  drawAddCanvas();
  drawGuidePreviewCanvas();
}

function drawAddCanvas() {
  const c = tool.querySelector('#nade-add-canvas');
  if (!c) return;
  renderThrow(c, { mapId: draft.map, type: draft.type, start: draft.start, end: draft.end });
}

function drawGuidePreviewCanvas() {
  const c = tool.querySelector('#guide-preview-canvas');
  if (!c) return;
  const parsed = guideImport.parsed;
  const nade = parsed?.nades?.[guideImport.selected ?? 0];
  if (!nade) {
    renderThrow(c, { mapId: 'mirage', type: 'smoke', start: null, end: null });
    return;
  }
  renderThrow(c, {
    mapId: nade.map,
    type: nade.type,
    start: nade.start,
    end: nade.end,
  });
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

  // Browse / favorites filters
  tool.querySelector('#filter-map')?.addEventListener('change', (e) => {
    browseFilter.map = e.target.value;
    browseSelected = new Map();
    loadView(view === 'favorites' ? 'favorites' : 'browse');
  });
  tool.querySelector('#filter-type')?.addEventListener('change', (e) => {
    browseFilter.type = e.target.value;
    loadView(view === 'favorites' ? 'favorites' : 'browse');
  });
  tool.querySelectorAll('.browse-select').forEach((c) =>
    c.addEventListener('change', () => {
      onBrowseSelectToggle(Number(c.value), c.dataset.map, c.checked);
      syncBrowseCard(c.closest('.browse-nade-card'));
    }),
  );
  tool.querySelectorAll('.browse-nade-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a, button, input, label')) return;
      toggleBrowseCard(card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      if (e.target.closest('a, button, input, label')) return;
      e.preventDefault();
      toggleBrowseCard(card);
    });
  });
  tool.querySelector('#browse-select-clear')?.addEventListener('click', () => {
    browseSelected = new Map();
    render();
  });
  tool.querySelector('#browse-try-selected')?.addEventListener('click', () => {
    onTryNades(browseSelectedIds());
  });
  tool.querySelectorAll('[data-try-nades]').forEach((b) =>
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      onTryNades([Number(b.dataset.tryNades)]);
    }),
  );
  tool.querySelectorAll('[data-favorite-nade]').forEach((b) =>
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      onFavoriteNade(Number(b.dataset.favoriteNade));
    }),
  );

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

  // Map guide import
  tool.querySelector('#guide-file')?.addEventListener('change', onGuideFile);
  tool.querySelector('#guide-text')?.addEventListener('input', (e) => {
    guideImport.text = e.target.value;
  });
  tool.querySelector('#guide-side')?.addEventListener('change', (e) => {
    guideImport.side = e.target.value;
  });
  tool.querySelector('#guide-parse')?.addEventListener('click', onGuideParse);
  tool.querySelector('#guide-import')?.addEventListener('click', onGuideImport);
  tool.querySelector('#guide-try-game')?.addEventListener('click', onGuideTryGame);
  tool.querySelector('#guide-clear')?.addEventListener('click', () => {
    guideImport = newGuideImport();
    tryGamePack = null;
    render();
    setStatus('Cleared map guide.', '');
  });
  tool.querySelectorAll('[data-guide-idx]').forEach((b) =>
    b.addEventListener('click', () => {
      guideImport.selected = Number(b.dataset.guideIdx);
      render();
    }),
  );

  // Try-in-game modal
  tool.querySelector('[data-try-game-close]')?.addEventListener('click', () => {
    tryGamePack = null;
    tryGameLineupCount = 1;
    render();
  });
  tool.querySelector('[data-try-game-download]')?.addEventListener('click', () => {
    if (!tryGamePack) return;
    const opts = readDownloadOptions(tool);
    if (!opts.guide && !opts.cfg) {
      const st = tool.querySelector('[data-try-game-status]');
      if (st) st.textContent = 'Choose at least one file to download, or just Open CS2 if you already have them.';
      return;
    }
    const downloaded = downloadPracticePack(tryGamePack, opts);
    const st = tool.querySelector('[data-try-game-status]');
    if (st) {
      st.textContent = downloaded.length
        ? `Downloaded ${downloaded.join(' + ')}. Copy into your CS2 folders, then Open CS2.`
        : 'Nothing selected to download.';
    }
  });
  tool.querySelector('[data-try-game-open]')?.addEventListener('click', onTryGameOpen);
  tool.querySelector('[data-try-game-copy-cmd]')?.addEventListener('click', onTryGameCopyCmd);

  // My nades: add media / delete / try in game
  tool.querySelectorAll('[data-add-media]').forEach((b) =>
    b.addEventListener('click', () => onAddMedia(b.dataset.addMedia)),
  );
  tool.querySelectorAll('[data-try-import]').forEach((b) =>
    b.addEventListener('click', () => onTryImport(b.dataset.tryImport)),
  );
  tool.querySelectorAll('[data-delete-nade]').forEach((b) =>
    b.addEventListener('click', () => onDeleteNade(b.dataset.deleteNade)),
  );
  tool.querySelectorAll('[data-delete-media]').forEach((b) =>
    b.addEventListener('click', () => onDeleteMedia(b.dataset.deleteMedia)),
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

  const selectAll = tool.querySelector('#review-select-all');
  const bulkApprove = tool.querySelector('#review-bulk-approve');
  const bulkReject = tool.querySelector('#review-bulk-reject');
  const syncBulkButtons = () => {
    const n = tool.querySelectorAll('.review-nade-check:checked').length;
    if (bulkApprove) bulkApprove.disabled = n === 0;
    if (bulkReject) bulkReject.disabled = n === 0;
  };
  selectAll?.addEventListener('change', () => {
    tool.querySelectorAll('.review-nade-check').forEach((c) => {
      c.checked = selectAll.checked;
    });
    syncBulkButtons();
  });
  tool.querySelectorAll('.review-nade-check').forEach((c) => c.addEventListener('change', syncBulkButtons));
  bulkApprove?.addEventListener('click', () => onBulkReview('approved'));
  bulkReject?.addEventListener('click', () => onBulkReview('rejected'));

  // Users
  tool.querySelectorAll('[data-role-user]').forEach((b) =>
    b.addEventListener('click', () => onSetRole(b.dataset.roleUser, b.dataset.role)),
  );
  tool.querySelectorAll('[data-ban]').forEach((b) =>
    b.addEventListener('click', () => {
      const sel = tool.querySelector(`[data-ban-dur="${b.dataset.ban}"]`);
      onBan(b.dataset.ban, sel ? sel.value : '24');
    }),
  );
  tool.querySelectorAll('[data-unban]').forEach((b) => b.addEventListener('click', () => onUnban(b.dataset.unban)));
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

async function onGuideFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    guideImport.fileName = file.name;
    guideImport.text = await file.text();
    guideImport.parsed = null;
    guideImport.selected = null;
    render();
    setStatus(`Loaded ${file.name}. Click Preview lineups.`, 'ok');
  } catch {
    setStatus('Could not read that file.', 'error');
  }
}

async function onGuideParse() {
  const text = (tool.querySelector('#guide-text')?.value || guideImport.text || '').trim();
  guideImport.text = text;
  guideImport.side = tool.querySelector('#guide-side')?.value || guideImport.side;
  if (!text) {
    setStatus('Upload or paste a CS2 map guide .txt first.', 'error');
    return;
  }
  try {
    setStatus('Parsing map guide…', '');
    const parsed = await api.nades.parseMapGuide(text);
    guideImport.parsed = parsed;
    guideImport.selected = 0;
    render();
    setStatus(
      `Found ${parsed.nades.length} lineup${parsed.nades.length === 1 ? '' : 's'} on ${mapName(parsed.map)}.`,
      'ok',
    );
  } catch (err) {
    guideImport.parsed = null;
    render();
    setStatus(err.message, 'error');
  }
}

async function onGuideImport() {
  if (!guideImport.parsed?.nades?.length) {
    setStatus('Preview the guide first so you can confirm the lineups.', 'error');
    return;
  }
  guideImport.side = tool.querySelector('#guide-side')?.value || guideImport.side;
  const guideText = (tool.querySelector('#guide-text')?.value || guideImport.text || '').trim();
  try {
    setStatus('Importing lineups…', '');
    const result = await api.nades.importMapGuide({
      nades: guideImport.parsed.nades,
      side: guideImport.side,
      guideText,
      fileName: guideImport.fileName,
    });
    guideImport = newGuideImport();
    await loadView('mine');
    setStatus(
      `Imported ${result.count} nade${result.count === 1 ? '' : 's'} — pending admin review.`,
      'ok',
    );
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onGuideTryGame() {
  const text = (tool.querySelector('#guide-text')?.value || guideImport.text || '').trim();
  const map = guideImport.parsed?.map;
  if (!text || !map) {
    setStatus('Preview the map guide first.', 'error');
    return;
  }
  try {
    setStatus('Preparing CS2 practice pack…', '');
    const data = await api.nades.practicePackFromText({ text, map });
    tryGamePack = data.pack;
    tryGameLineupCount = guideImport.parsed?.nades?.length || 1;
    render();
    setStatus('Choose what to download (or skip if you already have the files), then Open CS2.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onTryImport(importId) {
  try {
    setStatus('Preparing CS2 practice pack…', '');
    const data = await api.nades.practicePackFromImport(importId);
    tryGamePack = data.pack;
    tryGameLineupCount = 1;
    render();
    setStatus('Choose what to download (or skip if you already have the files), then Open CS2.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

function onBrowseSelectToggle(id, map, wantSelected) {
  if (!Number.isFinite(id) || id <= 0) return false;

  if (!wantSelected) {
    browseSelected.delete(id);
    updateBrowseSelectBar();
    return true;
  }

  if (browseSelected.size >= BROWSE_TRY_MAX && !browseSelected.has(id)) {
    setStatus(`You can select at most ${BROWSE_TRY_MAX} lineups at once.`, 'error', {
      title: 'Too many lineups',
    });
    return false;
  }

  for (const [, selectedMap] of browseSelected) {
    if (selectedMap !== map) {
      setStatus(
        `You can only select lineups from one map. Clear your selection or pick more from ${mapName(selectedMap)}.`,
        'error',
        { title: 'One map only' },
      );
      return false;
    }
  }

  browseSelected.set(id, map);
  updateBrowseSelectBar();
  return true;
}

function syncBrowseCard(card) {
  if (!card) return;
  const id = Number(card.dataset.browseNade);
  const on = browseSelected.has(id);
  card.classList.toggle('selected', on);
  card.setAttribute('aria-checked', on ? 'true' : 'false');
  const checkbox = card.querySelector('.browse-select');
  if (checkbox) checkbox.checked = on;
}

function toggleBrowseCard(card) {
  const id = Number(card.dataset.browseNade);
  const map = card.dataset.map;
  const wantSelected = !browseSelected.has(id);
  const ok = onBrowseSelectToggle(id, map, wantSelected);
  if (!ok && wantSelected) {
    // Validation failed — keep unselected.
  }
  syncBrowseCard(card);
}

function updateBrowseSelectBar() {
  const barBtn = tool.querySelector('#browse-try-selected');
  const clearBtn = tool.querySelector('#browse-select-clear');
  const n = browseSelected.size;
  if (barBtn) {
    barBtn.disabled = n === 0;
    barBtn.textContent = `Try selected in game (${n}/${BROWSE_TRY_MAX})`;
  }
  if (clearBtn) clearBtn.disabled = n === 0;
}

async function onTryNades(nadeIds) {
  const ids = [...new Set((nadeIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0))];
  if (!ids.length) {
    setStatus(`Select at least one lineup (max ${BROWSE_TRY_MAX}, same map).`, 'error', {
      title: 'Nothing selected',
    });
    return;
  }
  if (ids.length > BROWSE_TRY_MAX) {
    setStatus(`You can open at most ${BROWSE_TRY_MAX} lineups at once.`, 'error', {
      title: 'Too many lineups',
    });
    return;
  }
  try {
    setStatus('Preparing CS2 practice pack…', '');
    const data = await api.nades.practicePackFromNades(ids);
    tryGamePack = data.pack;
    tryGameLineupCount = ids.length;
    render();
    setStatus(
      ids.length > 1
        ? `Merged ${ids.length} lineups into one annotation file. Download what you need, then Open CS2.`
        : 'Choose what to download (or skip if you already have the files), then Open CS2.',
      'ok',
    );
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onFavoriteNade(nadeId) {
  if (!session) {
    openAuth('login');
    return;
  }
  if (!Number.isFinite(nadeId) || nadeId <= 0) return;
  try {
    const res = await api.nades.favorite(nadeId);
    favoriteSocial.counts[nadeId] = res.count;
    favoriteSocial.mine = res.favorited
      ? [...favoriteSocial.mine.filter((id) => id !== nadeId), nadeId]
      : favoriteSocial.mine.filter((id) => id !== nadeId);
    if (view === 'favorites' && !res.favorited) {
      favoritesData = favoritesData.filter((n) => n.id !== nadeId);
    }
    render();
    setStatus(res.favorited ? 'Added to favorites.' : 'Removed from favorites.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

function onTryGameOpen() {
  if (!tryGamePack) return;
  const st = tool.querySelector('[data-try-game-status]');
  try {
    openSteamPractice(tryGamePack);
    const msg = `Opening CS2 private ${tryGamePack.deMap}… Quit CS2 first if it was already running, otherwise paste in console: ${
      tryGamePack.consoleCommand || `map ${tryGamePack.deMap}; exec ${tryGamePack.cfgBaseName}`
    }`;
    if (st) st.textContent = msg;
    setStatus(msg, 'ok');
  } catch (err) {
    if (st) st.textContent = err.message;
    setStatus(err.message, 'error');
  }
}

async function onTryGameCopyCmd() {
  if (!tryGamePack) return;
  const st = tool.querySelector('[data-try-game-status]');
  try {
    const cmd = await copyPracticeConsoleCommand(tryGamePack);
    const msg = `Copied: ${cmd}`;
    if (st) st.textContent = msg;
    setStatus(msg, 'ok');
  } catch (err) {
    if (st) st.textContent = err.message;
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
  if (!confirm('Permanently delete this nade and its media?')) return;
  try {
    await api.nades.remove(nadeId);
    browseSelected.delete(Number(nadeId));
    await loadView(view);
    setStatus('Nade deleted.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onDeleteMedia(mediaId) {
  if (!confirm('Permanently remove this media?')) return;
  try {
    await api.admin.removeMedia(mediaId);
    await loadView(view);
    setStatus('Media removed.', 'ok');
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

async function onBulkReview(decision) {
  const ids = [...tool.querySelectorAll('.review-nade-check:checked')].map((c) => Number(c.value));
  if (!ids.length) {
    setStatus('Select at least one pending nade.', 'error');
    return;
  }
  const note = tool.querySelector('#review-bulk-note')?.value || '';
  try {
    const result = await api.admin.reviewNadesBulk(ids, decision, note);
    await loadView('review');
    setStatus(`${decision === 'approved' ? 'Approved' : 'Rejected'} ${result.updated} nade${result.updated === 1 ? '' : 's'}.`, 'ok');
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

async function onBan(userId, duration) {
  try {
    if (duration === 'perma') await api.admin.banUser(userId, { permanent: true });
    else await api.admin.banUser(userId, { hours: Number(duration) });
    await loadView('users');
    setStatus('User banned.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onUnban(userId) {
  try {
    await api.admin.unbanUser(userId);
    await loadView('users');
    setStatus('User unbanned.', 'ok');
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
    if (!session && ['add', 'import', 'mine', 'favorites', 'review', 'users'].includes(view)) view = 'browse';
    if (session && !isAdmin(session) && ['review', 'users'].includes(view)) view = 'browse';
    await loadView(view);
  });

  await updateReviewCount();
  render();
  await loadView('browse');
}
