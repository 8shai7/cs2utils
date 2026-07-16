import { api, isAdmin } from './api.js';
import { getUser, subscribe } from './session.js';
import { openAuth } from './headerAuth.js';
import { authorChipHtml } from './authorChip.js';

let tool;
let session = null;
let list = [];
let reports = [];
let statusMsg = { text: '', kind: '' };
let showUpload = false;
let reportingId = null;

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
  const el = tool?.querySelector('#highlights-status');
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

function youtubeId(url) {
  const m = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(url || '');
  return m ? m[1] : null;
}

function safeUrl(url) {
  return /^https?:\/\//.test(url || '') ? url : '';
}

function embed(url) {
  const safe = safeUrl(url);
  if (!safe) return '';
  const yt = youtubeId(url);
  if (yt) return `<iframe class="hl-embed" src="https://www.youtube.com/embed/${esc(yt)}" title="highlight" allowfullscreen loading="lazy"></iframe>`;
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return `<video class="hl-embed" src="${esc(safe)}" controls preload="none"></video>`;
  return `<a class="btn ghost" href="${esc(safe)}" target="_blank" rel="noopener noreferrer">Open highlight ↗</a>`;
}

async function load() {
  try {
    list = await api.highlights.list({});
    if (isAdmin(session)) reports = await api.admin.highlightReports();
    else reports = [];
  } catch (err) {
    setStatus(err.message, 'error');
  }
  render();
}

function reportsPanelHtml() {
  if (!isAdmin(session) || !reports.length) return '';
  return `
    <section class="panel panel-review">
      <h3>Reported highlights (${reports.length})</h3>
      ${reports
        .map(
          (h) => `<div class="report-item">
            <div class="report-media">${embed(h.url)}</div>
            <div class="report-body">
              <strong>${esc(h.title)}</strong>
              <div class="hl-report-author">${authorChipHtml(h)}</div>
              <ul class="report-reasons">
                ${h.reports.map((r) => `<li><strong>${esc(r.reporterName)}:</strong> ${esc(r.reason || '(no reason given)')}</li>`).join('')}
              </ul>
              <div class="actions">
                <button class="btn btn-sm" data-keep="${h.id}">Keep</button>
                <button class="btn btn-sm ghost" data-remove-hl="${h.id}">Delete highlight</button>
              </div>
            </div>
          </div>`,
        )
        .join('')}
    </section>`;
}

function cardHtml(h) {
  const canDelete = session && (h.authorId === session.id || isAdmin(session));
  const search = `${h.title} ${h.description} ${h.authorName}`.toLowerCase();
  return `
    <article class="hl-card" data-search="${esc(search)}">
      <div class="hl-media">${embed(h.url)}</div>
      <h3 class="hl-title">${esc(h.title)}</h3>
      ${h.description ? `<p class="hl-desc">${esc(h.description)}</p>` : ''}
      <div class="hl-foot">
        ${authorChipHtml(h, { date: fmtDate(h.createdAt) })}
        <span class="hl-actions">
          ${
            session
              ? h.reportedByMe
                ? '<span class="hint">Reported</span>'
                : `<button class="btn btn-sm ghost" data-report="${h.id}">Report</button>`
              : ''
          }
          ${canDelete ? `<button class="btn btn-sm ghost" data-del="${h.id}">Delete</button>` : ''}
        </span>
      </div>
      ${
        reportingId === h.id
          ? `<form class="hl-report-form" data-report-form="${h.id}">
               <input type="text" maxlength="500" placeholder="Why are you reporting this? (optional)" />
               <button class="btn btn-sm" type="submit">Submit report</button>
               <button class="btn btn-sm ghost" type="button" data-cancel-report>Cancel</button>
             </form>`
          : ''
      }
    </article>`;
}

function uploadFormHtml() {
  if (!session || !showUpload) return '';
  return `
    <section class="panel config-upload">
      <div class="panel-head"><h2>Share a highlight</h2><span class="panel-tag">Video URL</span></div>
      <div class="config-upload-body">
        <label class="field"><span>Title</span><input id="hl-title" type="text" maxlength="160" placeholder="Insane 1v4 clutch on Mirage" /></label>
        <label class="field"><span>Description (optional)</span><textarea id="hl-desc" rows="2" maxlength="1000" placeholder="What happens in the clip…"></textarea></label>
        <label class="field"><span>Video URL (YouTube, Medal, Streamable, .mp4)</span><input id="hl-url" type="url" placeholder="https://youtu.be/..." /></label>
        <div class="actions">
          <button class="btn primary" id="hl-submit">Publish highlight</button>
          <button class="btn ghost" id="hl-cancel">Cancel</button>
        </div>
      </div>
    </section>`;
}

function render() {
  tool.innerHTML = `
    <div class="highlights-shell">
      <div class="configs-controls">
        <input id="hl-search" type="search" class="cfg-search" placeholder="Search highlights by title, author…" />
        ${session ? `<button class="btn primary" id="hl-new">Share highlight</button>` : `<button class="btn primary" data-open-auth="login">Log in to share</button>`}
      </div>
      ${reportsPanelHtml()}
      ${uploadFormHtml()}
      <div class="hl-grid">
        ${list.length ? list.map(cardHtml).join('') : `<p class="hint">No highlights yet — share the first one!</p>`}
      </div>
      <div id="highlights-status" class="status ${statusMsg.kind}">${esc(statusMsg.text)}</div>
    </div>`;
  wire();
}

function applySearch(q) {
  const query = q.trim().toLowerCase();
  tool.querySelectorAll('.hl-card').forEach((card) => {
    card.classList.toggle('hidden', query && !card.dataset.search.includes(query));
  });
}

function wire() {
  tool.querySelectorAll('[data-open-auth]').forEach((b) => b.addEventListener('click', () => openAuth(b.dataset.openAuth)));
  tool.querySelector('#hl-search')?.addEventListener('input', (e) => applySearch(e.target.value));
  tool.querySelector('#hl-new')?.addEventListener('click', () => {
    showUpload = true;
    render();
  });
  tool.querySelector('#hl-cancel')?.addEventListener('click', () => {
    showUpload = false;
    render();
  });
  tool.querySelector('#hl-submit')?.addEventListener('click', onSubmit);

  tool.querySelectorAll('[data-report]').forEach((b) =>
    b.addEventListener('click', () => {
      reportingId = Number(b.dataset.report);
      render();
    }),
  );
  tool.querySelector('[data-cancel-report]')?.addEventListener('click', () => {
    reportingId = null;
    render();
  });
  tool.querySelector('[data-report-form]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Number(e.currentTarget.dataset.reportForm);
    onReport(id, e.currentTarget.querySelector('input').value);
  });

  tool.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => onDelete(Number(b.dataset.del))));
  tool.querySelectorAll('[data-keep]').forEach((b) => b.addEventListener('click', () => onReview(Number(b.dataset.keep), 'keep')));
  tool.querySelectorAll('[data-remove-hl]').forEach((b) =>
    b.addEventListener('click', () => onReview(Number(b.dataset.removeHl), 'delete')),
  );
}

async function onSubmit() {
  const title = tool.querySelector('#hl-title')?.value || '';
  const description = tool.querySelector('#hl-desc')?.value || '';
  const url = tool.querySelector('#hl-url')?.value || '';
  try {
    await api.highlights.create({ title, description, url });
    showUpload = false;
    await load();
    setStatus('Highlight shared!', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onReport(id, reason) {
  try {
    await api.highlights.report(id, reason);
    reportingId = null;
    await load();
    setStatus('Thanks — an admin will review your report.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onDelete(id) {
  try {
    await api.highlights.remove(id);
    await load();
    setStatus('Highlight deleted.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onReview(id, decision) {
  try {
    await api.admin.reviewHighlight(id, decision);
    await load();
    setStatus(decision === 'delete' ? 'Highlight removed.' : 'Reports cleared — highlight kept.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

export async function initHighlightsTool() {
  tool = document.querySelector('#highlights-tool');
  if (!tool) return;
  session = getUser();
  subscribe(async (user) => {
    session = user;
    await load();
  });
  render();
  await load();
}
