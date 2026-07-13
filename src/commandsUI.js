import { api, isAdmin } from './api.js';
import { getUser, subscribe } from './session.js';
import { openAuth } from './headerAuth.js';
import { openImportModal } from './importModal.js';

let tool;
let session = null;
let catalog = { commands: [], categories: [], recommendedLaunchOptions: '', source: 'seed', lastSync: 0, cs2Build: '', cs2Version: '', remoteConfigured: false };
let social = { counts: {}, mine: [], comments: {} };
let pendingComments = [];
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
  const el = tool?.querySelector('#commands-status');
  if (el) {
    el.textContent = text;
    el.className = `status${kind ? ` ${kind}` : ''}`;
  }
}

function fmtWhen(ms) {
  if (!ms) return '—';
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return '—';
  }
}

async function loadAll() {
  try {
    catalog = await api.commands.catalog();
  } catch (err) {
    setStatus(`Could not load command catalog: ${err.message}`, 'error');
  }
  try {
    social = await api.commands.social();
  } catch {
    /* social is optional */
  }
  if (isAdmin(session)) {
    try {
      pendingComments = await api.admin.pendingComments();
    } catch {
      pendingComments = [];
    }
  } else {
    pendingComments = [];
  }
}

function commentsHtml(c) {
  const list = social.comments[c.key] || [];
  const listHtml = list.length
    ? list.map((cm) => `<div class="cmd-comment"><strong>${esc(cm.username)}</strong><span>${esc(cm.body)}</span></div>`).join('')
    : `<p class="hint">No comments yet.</p>`;
  const form = session
    ? `<form class="cmd-comment-form" data-comment-key="${esc(c.key)}">
         <input type="text" maxlength="1000" placeholder="Share a tip about this command…" />
         <button class="btn btn-sm" type="submit">Comment</button>
       </form>
       <p class="hint">Comments are reviewed by an admin before appearing.</p>`
    : `<button class="btn btn-sm" data-open-auth="login">Log in to comment</button>`;
  return `<div class="cmd-comments">${listHtml}${form}</div>`;
}

function commandCardHtml(c) {
  const count = social.counts[c.key] || 0;
  const mine = social.mine.includes(c.key);
  const commentCount = (social.comments[c.key] || []).length;
  const isOpen = expanded.has(c.key);
  const search = `${c.command} ${c.title} ${c.description}`.toLowerCase();
  return `
    <article class="cmd-card" data-search="${esc(search)}">
      <div class="cmd-head">
        <div class="cmd-title-row">
          <h4>${esc(c.title)}</h4>
          ${c.isNew ? '<span class="nade-badge new">NEW</span>' : ''}
          <span class="cmd-tag ${esc(c.type)}">${c.type === 'launch' ? 'launch option' : 'console'}</span>
        </div>
      </div>
      <div class="cmd-code-row">
        <code class="cmd-code">${esc(c.command)}</code>
        <button class="btn btn-sm" data-copy="${esc(c.command)}">Copy</button>
      </div>
      <p class="cmd-desc">${esc(c.description)}</p>
      <div class="cmd-actions">
        <button class="btn btn-sm recommend ${mine ? 'active' : ''}" data-recommend="${esc(c.key)}">
          ${mine ? '★ Recommended' : '☆ Recommend'} <span class="rec-count">${count}</span>
        </button>
        <button class="btn btn-sm ghost" data-toggle-comments="${esc(c.key)}">
          ${isOpen ? 'Hide' : 'Comments'}${commentCount ? ` (${commentCount})` : ''}
        </button>
      </div>
      ${isOpen ? commentsHtml(c) : ''}
    </article>`;
}

function categoryHtml(cat) {
  const cmds = catalog.commands.filter((c) => c.category === cat.id);
  if (!cmds.length) return '';
  return `
    <section class="cmd-category" data-category="${esc(cat.id)}">
      <h3 class="cmd-cat-title">${esc(cat.name)} <span class="cmd-count">${cmds.length}</span></h3>
      <div class="cmd-grid">${cmds.map(commandCardHtml).join('')}</div>
    </section>`;
}

function statusBarHtml() {
  const newCount = catalog.commands.filter((c) => c.isNew).length;
  const adminBtns = isAdmin(session)
    ? `<div class="actions">
         <button class="btn btn-sm" id="cmd-sync">Sync from wiki now</button>
         <button class="btn btn-sm ghost" id="cmd-check-cs2">Re-check CS2 build</button>
       </div>`
    : '';
  return `
    <section class="cmd-status-bar">
      <div>
        <strong>Source:</strong> ${esc(catalog.source)}${catalog.remoteConfigured ? '' : ' (wiki)'} ·
        <strong>CS2 build:</strong> ${catalog.cs2Build ? `${esc(catalog.cs2Build)}${catalog.cs2Version ? ` (${esc(catalog.cs2Version)})` : ''}` : '—'} ·
        <strong>Last synced:</strong> ${fmtWhen(catalog.lastSync)}
        ${newCount ? ` · <span class="nade-badge new">${newCount} new</span>` : ''}
      </div>
      ${adminBtns}
    </section>`;
}

function adminPanelHtml() {
  if (!isAdmin(session) || !pendingComments.length) return '';
  return `
    <section class="cmd-review panel-review">
      <h3>Comments awaiting review (${pendingComments.length})</h3>
      ${pendingComments
        .map(
          (cm) => `<div class="review-comment">
            <div><strong>${esc(cm.username)}</strong> on <code>${esc(cm.commandKey)}</code><br /><span>${esc(cm.body)}</span></div>
            <div class="actions">
              <button class="btn btn-sm primary" data-approve-comment="${cm.id}">Approve</button>
              <button class="btn btn-sm ghost" data-reject-comment="${cm.id}">Reject</button>
            </div>
          </div>`,
        )
        .join('')}
    </section>`;
}

function render() {
  tool.innerHTML = `
    <div class="commands-shell">
      ${statusBarHtml()}
      <section class="quick-launch">
        <div>
          <h3>Recommended launch options</h3>
          <p class="hint">Steam → right-click Counter-Strike 2 → Properties → Launch Options.</p>
        </div>
        <div class="cmd-code-row">
          <code class="cmd-code">${esc(catalog.recommendedLaunchOptions || '')}</code>
          <button class="btn" data-copy="${esc(catalog.recommendedLaunchOptions || '')}">Copy</button>
        </div>
      </section>
      ${adminPanelHtml()}
      <label class="field cmd-search">
        <span>Search commands</span>
        <input id="cmd-search" type="search" placeholder="Search by command, title, or description…" />
      </label>
      ${catalog.categories.map(categoryHtml).join('')}
      <div id="commands-status" class="status ${statusMsg.kind}">${esc(statusMsg.text)}</div>
    </div>`;
  wire();
}

function applySearch(q) {
  const query = q.trim().toLowerCase();
  tool.querySelectorAll('.cmd-category').forEach((cat) => {
    let visible = 0;
    cat.querySelectorAll('.cmd-card').forEach((card) => {
      const match = !query || card.dataset.search.includes(query);
      card.classList.toggle('hidden', !match);
      if (match) visible += 1;
    });
    cat.classList.toggle('hidden', visible === 0);
  });
}

function wire() {
  tool.querySelectorAll('[data-copy]').forEach((b) =>
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        setStatus('Copied to clipboard.', 'ok');
      } catch {
        setStatus('Clipboard blocked — select and copy manually.', 'error');
      }
    }),
  );
  tool.querySelectorAll('[data-open-auth]').forEach((b) => b.addEventListener('click', () => openAuth(b.dataset.openAuth)));
  tool.querySelectorAll('[data-recommend]').forEach((b) => b.addEventListener('click', () => onRecommend(b.dataset.recommend)));
  tool.querySelectorAll('[data-toggle-comments]').forEach((b) =>
    b.addEventListener('click', () => {
      const key = b.dataset.toggleComments;
      if (expanded.has(key)) expanded.delete(key);
      else expanded.add(key);
      render();
    }),
  );
  tool.querySelectorAll('.cmd-comment-form').forEach((f) =>
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      onComment(f.dataset.commentKey, f.querySelector('input'));
    }),
  );
  tool.querySelectorAll('[data-approve-comment]').forEach((b) => b.addEventListener('click', () => onReviewComment(b.dataset.approveComment, 'approved')));
  tool.querySelectorAll('[data-reject-comment]').forEach((b) => b.addEventListener('click', () => onReviewComment(b.dataset.rejectComment, 'rejected')));
  tool.querySelector('#cmd-search')?.addEventListener('input', (e) => applySearch(e.target.value));
  tool.querySelector('#cmd-sync')?.addEventListener('click', onSync);
  tool.querySelector('#cmd-check-cs2')?.addEventListener('click', onCheckCs2);
}

async function onRecommend(key) {
  if (!session) {
    openAuth('login');
    return;
  }
  try {
    const res = await api.commands.recommend(key);
    social.counts[key] = res.count;
    social.mine = res.recommended ? [...social.mine.filter((k) => k !== key), key] : social.mine.filter((k) => k !== key);
    render();
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onComment(key, input) {
  const body = (input?.value || '').trim();
  if (!body) {
    setStatus('Write something first.', 'error');
    return;
  }
  try {
    await api.commands.addComment(key, body);
    setStatus('Comment submitted — an admin will review it before it appears.', 'ok');
    if (input) input.value = '';
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onReviewComment(id, decision) {
  try {
    await api.admin.reviewComment(id, decision);
    await loadAll();
    render();
    setStatus(`Comment ${decision}.`, 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

function onSync() {
  openImportModal({
    title: 'Sync commands from the CS2 wiki',
    description:
      'The Valve wiki has a bot check that blocks servers. Open it in your browser, complete the verification, then copy the page source (wikitext) and paste it here — the server will parse it.',
    sourceUrl: 'https://developer.valvesoftware.com/w/index.php?title=List_of_Counter-Strike_2_console_command_variables&action=raw',
    sourceLabel: 'Open CS2 wiki source',
    placeholder: 'Paste the wiki page source (wikitext), or a JSON list of commands…',
    onImport: async (content) => {
      const res = await api.admin.importCommands(content);
      await loadAll();
      render();
      return `Imported ${res.count} commands.`;
    },
  });
}

async function onCheckCs2() {
  setStatus('Checking the current CS2 build…', '');
  try {
    const res = await api.admin.checkCommandsCs2();
    await loadAll();
    render();
    setStatus(
      res.ok
        ? `CS2 build ${res.build}${res.changed ? ' — changed, catalog re-synced' : ' — no change'}.`
        : `Check failed: ${res.reason}`,
      res.ok ? 'ok' : 'error',
    );
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

export async function initCommandsTool() {
  tool = document.querySelector('#commands-tool');
  if (!tool) return;
  session = getUser();

  subscribe(async (user) => {
    session = user;
    await loadAll();
    render();
  });

  render();
  await loadAll();
  render();
}
