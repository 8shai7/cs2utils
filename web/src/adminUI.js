import { api, isAdmin, isOwner, resolveMediaUrl } from './api.js';
import { getUser, subscribe } from './session.js';
import { openAuth } from './headerAuth.js';
import { openImportModal } from './importModal.js';

let tool;
let session = null;
let section = 'overview';
let statusMsg = { text: '', kind: '' };
let counts = { nades: 0, comments: 0, reports: 0 };
let cache = {}; // per-section loaded data

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'nades', label: 'Nades' },
  { id: 'comments', label: 'Comments' },
  { id: 'reports', label: 'Reports' },
  { id: 'users', label: 'Users' },
  { id: 'sync', label: 'Data sync' },
  { id: 'contact', label: 'Contact' },
  { id: 'logs', label: 'Logs', ownerOnly: true },
  { id: 'settings', label: 'Site settings', ownerOnly: true },
];

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
  const el = tool?.querySelector('#admin-status');
  if (el) {
    el.textContent = text;
    el.className = `status${kind ? ` ${kind}` : ''}`;
  }
}

function fmtDate(v) {
  try {
    return new Date(v).toLocaleString();
  } catch {
    return '—';
  }
}

async function refreshCounts() {
  try {
    const [nades, comments, reports] = await Promise.all([
      api.admin.pendingCount().catch(() => 0),
      api.admin.pendingCommentsCount().catch(() => 0),
      api.admin.highlightReportsCount().catch(() => 0),
    ]);
    counts = { nades, comments, reports };
  } catch {
    /* ignore */
  }
}

// --- section renderers -------------------------------------------------------

function overviewHtml() {
  const card = (label, n, target) =>
    `<button class="admin-stat" data-goto="${target}">
       <span class="admin-stat-num">${n}</span>
       <span class="admin-stat-label">${esc(label)}</span>
     </button>`;
  return `
    <div class="admin-stats">
      ${card('Nades to review', counts.nades, 'nades')}
      ${card('Comments to review', counts.comments, 'comments')}
      ${card('Highlight reports', counts.reports, 'reports')}
    </div>
    <p class="hint">Use the tabs above to moderate content, manage users, sync data sources, and read contact messages.</p>`;
}

function nadesHtml() {
  const nades = cache.nades || [];
  if (!nades.length) return `<p class="hint">Nothing pending. All nades are reviewed.</p>`;
  const pending = nades.filter((n) => n.status === 'pending');
  return `
    <div class="review-bulk-bar">
      <label class="review-select-all">
        <input type="checkbox" id="admin-nade-select-all" />
        <span>Select all pending (${pending.length})</span>
      </label>
      <button class="btn btn-sm primary" type="button" id="admin-nade-bulk-approve" disabled>Approve selected</button>
      <button class="btn btn-sm ghost" type="button" id="admin-nade-bulk-reject" disabled>Reject selected</button>
    </div>
    ${nades
      .map((n) => {
        const media = (n.media || [])
          .map(
            (m) => `
        <div class="admin-media">
          <a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">${esc(m.kind || 'media')}</a>
          <span class="nade-badge ${esc(m.status)}">${esc(m.status)}</span>
          ${
            m.status === 'pending'
              ? `<button class="btn btn-sm" data-media-approve="${m.id}">Approve</button>
                 <button class="btn btn-sm ghost" data-media-reject="${m.id}">Reject</button>`
              : ''
          }
        </div>`,
          )
          .join('');
        return `
        <article class="panel admin-item">
          <div class="admin-item-head">
            ${
              n.status === 'pending'
                ? `<label class="review-check"><input type="checkbox" class="admin-nade-check" value="${n.id}" /><span>Select</span></label>`
                : ''
            }
            <strong>${esc(n.title || 'Untitled')}</strong>
            <span class="nade-badge ${esc(n.status)}">${esc(n.status)}</span>
          </div>
          <p class="hint">${esc(n.map)} · ${esc(n.type)} · ${esc(n.side || '')} · ${esc(n.technique || '')} · by ${esc(
            n.authorName || n.author_name || '?',
          )}</p>
          ${media || '<p class="hint">No media.</p>'}
          <div class="actions">
            <button class="btn btn-sm" data-nade-approve="${n.id}">Approve nade</button>
            <button class="btn btn-sm ghost" data-nade-reject="${n.id}">Reject nade</button>
          </div>
        </article>`;
      })
      .join('')}`;
}

function commentsHtml() {
  const rows = cache.comments || [];
  if (!rows.length) return `<p class="hint">No comments pending review.</p>`;
  return rows
    .map(
      (c) => `
      <article class="panel admin-item">
        <p>${esc(c.body)}</p>
        <p class="hint">by ${esc(c.username)} on <code>${esc(c.commandKey)}</code> · ${fmtDate(c.createdAt)}</p>
        <div class="actions">
          <button class="btn btn-sm" data-comment-approve="${c.id}">Approve</button>
          <button class="btn btn-sm ghost" data-comment-reject="${c.id}">Reject</button>
        </div>
      </article>`,
    )
    .join('');
}

function reportsHtml() {
  const rows = cache.reports || [];
  if (!rows.length) return `<p class="hint">No open highlight reports.</p>`;
  return rows
    .map((h) => {
      const reasons = (h.reports || [])
        .map((r) => `<li>${esc(r.reason || 'No reason')} — <span class="hint">${esc(r.reporterName || '?')}</span></li>`)
        .join('');
      return `
        <article class="panel admin-item">
          <div class="admin-item-head">
            <a href="${esc(h.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(h.title)}</strong></a>
            <span class="nade-badge pending">${(h.reports || []).length} report(s)</span>
          </div>
          <p class="hint">by ${esc(h.authorName)}</p>
          <ul class="admin-reasons">${reasons}</ul>
          <div class="actions">
            <button class="btn btn-sm ghost" data-report-keep="${h.id}">Keep</button>
            <button class="btn btn-sm danger" data-report-delete="${h.id}">Delete highlight</button>
          </div>
        </article>`;
    })
    .join('');
}

function usersHtml() {
  const users = cache.users || [];
  if (!users.length) return `<p class="hint">No users.</p>`;
  const now = Date.now();
  const ownerCanPromote = isOwner(session);
  const rows = users
    .map((u) => {
      const banned = u.bannedUntil && new Date(u.bannedUntil).getTime() > now;
      const isOwnerRow = u.role === 'owner';
      const roleActions = isOwnerRow
        ? '<span class="hint">owner</span>'
        : ownerCanPromote
          ? u.role === 'admin'
            ? `<button class="btn btn-sm ghost" type="button" data-role-set="${u.id}" data-role="user">Remove admin</button>`
            : `<button class="btn btn-sm primary" type="button" data-role-set="${u.id}" data-role="admin">Promote to admin</button>`
          : `<span class="hint">${esc(u.role)}</span>`;
      const banActions = isOwnerRow
        ? ''
        : banned
          ? `<button class="btn btn-sm" data-unban="${u.id}">Unban</button>`
          : `<input type="number" min="1" placeholder="hrs" class="admin-ban-hrs" data-ban-hrs="${u.id}" />
             <button class="btn btn-sm ghost" data-ban="${u.id}">Ban</button>
             <button class="btn btn-sm danger" data-ban-perma="${u.id}">Ban forever</button>`;
      return `
        <div class="admin-user">
          <div class="admin-user-main">
            <strong>${esc(u.username)}</strong> <span class="nade-badge ${esc(u.role)}">${esc(u.role)}</span>
            ${banned ? '<span class="nade-badge rejected">banned</span>' : ''}
            <div class="hint">${esc(u.email || (u.steamId ? 'Steam account' : 'no email'))} · joined ${new Date(
              u.createdAt,
            ).toLocaleDateString()}</div>
          </div>
          <div class="admin-user-actions">
            ${roleActions}
            ${banActions}
          </div>
        </div>`;
    })
    .join('');
  return `
    ${
      ownerCanPromote
        ? '<p class="hint">As owner you can promote users to admin or remove admin access. Ban controls are available to all admins.</p>'
        : '<p class="hint">Only the site owner can promote users to admin.</p>'
    }
    <div class="admin-users">${rows}</div>`;
}

function syncHtml() {
  return `
    <div class="admin-sync">
      <div class="panel admin-item">
        <div class="admin-item-head"><strong>Commands catalog</strong></div>
        <p class="hint">Sync the CS2 command catalog from the configured source, or re-check the CS2 build.</p>
        <div class="actions">
          <button class="btn btn-sm" id="sync-commands">Sync commands</button>
          <button class="btn btn-sm ghost" id="check-cs2">Check CS2 build</button>
          <button class="btn btn-sm ghost" id="import-commands">Import (paste)</button>
        </div>
      </div>
      <div class="panel admin-item">
        <div class="admin-item-head"><strong>Pro settings</strong></div>
        <p class="hint">Sync pro players from prosettings.net, or paste an HLTV export.</p>
        <div class="actions">
          <button class="btn btn-sm" id="sync-pros">Sync from prosettings.net</button>
          <button class="btn btn-sm ghost" id="import-pros">Import from HLTV (paste)</button>
        </div>
      </div>
    </div>`;
}

function contactHtml() {
  const rows = cache.contact || [];
  if (!rows.length) return `<p class="hint">No contact messages.</p>`;
  return rows
    .map(
      (m) => `
      <article class="panel admin-item">
        <div class="admin-item-head">
          <strong>${esc(m.subject || '(no subject)')}</strong>
          <span class="hint">${fmtDate(m.created_at)}</span>
        </div>
        <p class="hint">${esc(m.name)} · <a href="mailto:${esc(m.email)}">${esc(m.email)}</a> · ${
          m.sent ? 'emailed' : 'stored only'
        }</p>
        <p class="admin-message">${esc(m.message)}</p>
      </article>`,
    )
    .join('');
}

function settingsHtml() {
  const s = cache.settings || { paypalUrl: '', steamTradeUrl: '' };
  return `
    <div class="panel admin-item">
      <div class="admin-item-head"><strong>Donate links</strong><span class="panel-tag">Owner only</span></div>
      <p class="hint">Power the PayPal &amp; Steam buttons in the footer. Empty = hidden.</p>
      <label class="field"><span>PayPal link</span><input id="set-paypal" type="url" value="${esc(s.paypalUrl)}" placeholder="https://www.paypal.com/paypalme/yourname" /></label>
      <label class="field"><span>Steam trade link</span><input id="set-steam" type="url" value="${esc(s.steamTradeUrl)}" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." /></label>
      <div class="actions"><button class="btn primary" id="save-settings">Save donate links</button></div>
    </div>`;
}

function logsHtml() {
  if (!isOwner(session)) return `<p class="hint">Owner only.</p>`;
  const data = cache.logs || { total: 0, logs: [] };
  const filter = cache.logsFilter || '';
  const rows = data.logs || [];
  const filterOpts = [
    ['', 'All actions'],
    ['nade.approve', 'Nade approve'],
    ['nade.reject', 'Nade reject'],
    ['nade.bulk_approve', 'Nade bulk approve'],
    ['nade.bulk_reject', 'Nade bulk reject'],
    ['nade.delete', 'Nade delete (author)'],
    ['nade.admin_delete', 'Nade delete (admin)'],
    ['media.approve', 'Media approve'],
    ['media.reject', 'Media reject'],
    ['comment.approve', 'Comment approve'],
    ['comment.reject', 'Comment reject'],
    ['highlight.keep', 'Highlight keep'],
    ['highlight.delete', 'Highlight delete'],
    ['user.role', 'User role'],
    ['user.ban', 'User ban'],
    ['user.unban', 'User unban'],
    ['commands.sync', 'Commands sync'],
    ['commands.import', 'Commands import'],
    ['pros.sync', 'Pros sync'],
    ['pros.import', 'Pros import'],
    ['settings.save', 'Settings save'],
  ]
    .map(([v, label]) => `<option value="${esc(v)}" ${filter === v ? 'selected' : ''}>${esc(label)}</option>`)
    .join('');
  const list = rows.length
    ? rows
        .map((log) => {
          const detail =
            log.detail && typeof log.detail === 'object'
              ? `<pre class="admin-log-detail">${esc(JSON.stringify(log.detail, null, 2))}</pre>`
              : log.detail
                ? `<pre class="admin-log-detail">${esc(String(log.detail))}</pre>`
                : '';
          return `
        <article class="panel admin-item admin-log">
          <div class="admin-item-head">
            <span class="nade-badge">${esc(log.action)}</span>
            <strong>${esc(log.summary || log.action)}</strong>
            <span class="hint">${fmtDate(log.createdAt)}</span>
          </div>
          <p class="hint">by ${esc(log.actorName)} (${esc(log.actorRole)})${
            log.entityType ? ` · ${esc(log.entityType)}${log.entityId != null ? ` #${esc(log.entityId)}` : ''}` : ''
          }</p>
          ${detail}
        </article>`;
        })
        .join('')
    : `<p class="hint">No log entries yet. Moderation and admin actions will show up here.</p>`;
  return `
    <div class="panel admin-item">
      <div class="admin-item-head"><strong>Owner audit log</strong><span class="panel-tag">Owner only</span></div>
      <p class="hint">Only you can see this. Admins’ approvals, bans, deletes, and syncs are recorded here.</p>
      <div class="admin-log-toolbar">
        <label class="field">
          <span>Filter</span>
          <select id="owner-logs-filter">${filterOpts}</select>
        </label>
        <button class="btn btn-sm" type="button" id="owner-logs-refresh">Refresh</button>
        <span class="hint">${data.total || 0} total</span>
      </div>
    </div>
    <div class="admin-logs">${list}</div>`;
}

const SECTION_RENDER = {
  overview: overviewHtml,
  nades: nadesHtml,
  comments: commentsHtml,
  reports: reportsHtml,
  users: usersHtml,
  sync: syncHtml,
  contact: contactHtml,
  logs: logsHtml,
  settings: settingsHtml,
};

async function loadSection(id) {
  try {
    if (id === 'overview') await refreshCounts();
    else if (id === 'nades') cache.nades = await api.admin.pending();
    else if (id === 'comments') cache.comments = await api.admin.pendingComments();
    else if (id === 'reports') cache.reports = await api.admin.highlightReports();
    else if (id === 'users') cache.users = await api.admin.users();
    else if (id === 'contact') cache.contact = await api.admin.contactMessages();
    else if (id === 'logs') {
      cache.logs = await api.admin.ownerLogs({ action: cache.logsFilter || '' });
    }
    else if (id === 'settings') cache.settings = await api.settings.get();
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

function render() {
  if (!tool) return;
  if (!isAdmin(session)) {
    tool.innerHTML = `<div class="admin-shell"><div class="login-prompt">
      <p class="hint">This area is for admins only.</p>
      ${session ? '' : '<div class="actions"><button class="btn primary" data-open-auth="login">Log in</button></div>'}
    </div></div>`;
    tool.querySelector('[data-open-auth]')?.addEventListener('click', () => openAuth('login'));
    return;
  }
  if ((section === 'logs' || section === 'settings') && !isOwner(session)) section = 'overview';
  const tabs = SECTIONS.filter((s) => !s.ownerOnly || isOwner(session))
    .map(
      (s) =>
        `<button class="tool-tab ${section === s.id ? 'active' : ''}" data-section="${s.id}">${esc(s.label)}${
          s.id === 'nades' && counts.nades ? ` (${counts.nades})` : ''
        }${s.id === 'comments' && counts.comments ? ` (${counts.comments})` : ''}${
          s.id === 'reports' && counts.reports ? ` (${counts.reports})` : ''
        }</button>`,
    )
    .join('');
  const body = (SECTION_RENDER[section] || overviewHtml)();
  tool.innerHTML = `
    <div class="admin-shell">
      <h2 class="admin-title">Admin</h2>
      <div class="admin-nav sort-tabs">${tabs}</div>
      <div class="admin-body">${body}</div>
      <div id="admin-status" class="status ${statusMsg.kind}">${esc(statusMsg.text)}</div>
    </div>`;
  wire();
}

async function goTo(id) {
  if (id === 'logs' || id === 'settings') {
    if (!isOwner(session)) id = 'overview';
  }
  section = id;
  render();
  await loadSection(id);
  render();
}

function wire() {
  tool.querySelectorAll('[data-section]').forEach((b) => b.addEventListener('click', () => goTo(b.dataset.section)));
  tool.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => goTo(b.dataset.goto)));

  const act = async (fn, msg) => {
    try {
      await fn();
      if (msg) setStatus(msg, 'ok');
    } catch (err) {
      setStatus(err.message, 'error');
    }
  };
  const reload = async () => {
    await loadSection(section);
    await refreshCounts();
    render();
  };

  // Nades
  tool.querySelectorAll('[data-nade-approve]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.reviewNade(b.dataset.nadeApprove, 'approved'); await reload(); }, 'Nade approved.')),
  );
  tool.querySelectorAll('[data-nade-reject]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.reviewNade(b.dataset.nadeReject, 'rejected'); await reload(); }, 'Nade rejected.')),
  );
  tool.querySelectorAll('[data-media-approve]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.reviewMedia(b.dataset.mediaApprove, 'approved'); await reload(); }, 'Media approved.')),
  );
  tool.querySelectorAll('[data-media-reject]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.reviewMedia(b.dataset.mediaReject, 'rejected'); await reload(); }, 'Media rejected.')),
  );

  const adminSelectAll = tool.querySelector('#admin-nade-select-all');
  const adminBulkApprove = tool.querySelector('#admin-nade-bulk-approve');
  const adminBulkReject = tool.querySelector('#admin-nade-bulk-reject');
  const syncAdminBulk = () => {
    const n = tool.querySelectorAll('.admin-nade-check:checked').length;
    if (adminBulkApprove) adminBulkApprove.disabled = n === 0;
    if (adminBulkReject) adminBulkReject.disabled = n === 0;
  };
  adminSelectAll?.addEventListener('change', () => {
    tool.querySelectorAll('.admin-nade-check').forEach((c) => {
      c.checked = adminSelectAll.checked;
    });
    syncAdminBulk();
  });
  tool.querySelectorAll('.admin-nade-check').forEach((c) => c.addEventListener('change', syncAdminBulk));
  const bulkNades = async (decision) => {
    const ids = [...tool.querySelectorAll('.admin-nade-check:checked')].map((c) => Number(c.value));
    if (!ids.length) return;
    await act(async () => {
      const result = await api.admin.reviewNadesBulk(ids, decision);
      await reload();
      setStatus(`${decision === 'approved' ? 'Approved' : 'Rejected'} ${result.updated} nade${result.updated === 1 ? '' : 's'}.`, 'ok');
    });
  };
  adminBulkApprove?.addEventListener('click', () => bulkNades('approved'));
  adminBulkReject?.addEventListener('click', () => bulkNades('rejected'));

  // Comments
  tool.querySelectorAll('[data-comment-approve]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.reviewComment(b.dataset.commentApprove, 'approved'); await reload(); }, 'Comment approved.')),
  );
  tool.querySelectorAll('[data-comment-reject]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.reviewComment(b.dataset.commentReject, 'rejected'); await reload(); }, 'Comment rejected.')),
  );

  // Reports
  tool.querySelectorAll('[data-report-keep]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.reviewHighlight(b.dataset.reportKeep, 'keep'); await reload(); }, 'Kept highlight.')),
  );
  tool.querySelectorAll('[data-report-delete]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.reviewHighlight(b.dataset.reportDelete, 'delete'); await reload(); }, 'Highlight deleted.')),
  );

  // Users
  tool.querySelectorAll('[data-role-set]').forEach((b) =>
    b.addEventListener('click', () => {
      const role = b.dataset.role;
      const label = role === 'admin' ? 'Promoted to admin.' : 'Admin access removed.';
      act(async () => {
        await api.admin.setRole(b.dataset.roleSet, role);
        await reload();
      }, label);
    }),
  );
  tool.querySelectorAll('[data-unban]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.unbanUser(b.dataset.unban); await reload(); }, 'User unbanned.')),
  );
  tool.querySelectorAll('[data-ban]').forEach((b) =>
    b.addEventListener('click', () =>
      act(async () => {
        const hrs = Number(tool.querySelector(`[data-ban-hrs="${b.dataset.ban}"]`)?.value);
        if (!Number.isFinite(hrs) || hrs <= 0) return setStatus('Enter a positive number of hours.', 'error');
        await api.admin.banUser(b.dataset.ban, { hours: hrs });
        await reload();
        setStatus('User banned.', 'ok');
      }),
    ),
  );
  tool.querySelectorAll('[data-ban-perma]').forEach((b) =>
    b.addEventListener('click', () => act(async () => { await api.admin.banUser(b.dataset.banPerma, { permanent: true }); await reload(); }, 'User banned permanently.')),
  );

  // Sync
  tool.querySelector('#sync-commands')?.addEventListener('click', () =>
    act(async () => { const r = await api.admin.syncCommands(); setStatus(r.synced ? `Commands synced (${r.count}).` : `No sync: ${r.reason || 'no source'}.`, r.synced ? 'ok' : 'error'); }),
  );
  tool.querySelector('#check-cs2')?.addEventListener('click', () =>
    act(async () => { const r = await api.admin.checkCommandsCs2(); setStatus(`CS2 build: ${r.build || 'unknown'}${r.changed ? ' (changed → re-synced)' : ''}.`, 'ok'); }),
  );
  tool.querySelector('#sync-pros')?.addEventListener('click', () =>
    act(async () => { const r = await api.admin.syncPros(); setStatus(r.synced ? `Synced ${r.count} pros from ${r.source}.` : `Sync failed: ${r.reason}.`, r.synced ? 'ok' : 'error'); }),
  );
  tool.querySelector('#import-commands')?.addEventListener('click', () =>
    openImportModal({
      title: 'Import commands',
      description: 'Paste the CS2 console-commands wiki page (wikitext) or a JSON array of commands.',
      sourceUrl: 'https://developer.valvesoftware.com/wiki/List_of_Counter-Strike_2_console_command_variables',
      sourceLabel: 'Open wiki',
      onImport: async (content) => { const r = await api.admin.importCommands(content); return `Imported ${r.count} commands.`; },
    }),
  );
  tool.querySelector('#import-pros')?.addEventListener('click', () =>
    openImportModal({
      title: 'Import pro settings from HLTV',
      description: 'Open HLTV, complete the check, then paste a JSON list of players.',
      sourceUrl: 'https://www.hltv.org/stats/players',
      sourceLabel: 'Open HLTV',
      onImport: async (content) => { const r = await api.admin.importPros(content); await loadSection('sync'); return `Imported ${r.count} players.`; },
    }),
  );

  // Settings
  tool.querySelector('#save-settings')?.addEventListener('click', () =>
    act(async () => {
      const paypalUrl = tool.querySelector('#set-paypal')?.value || '';
      const steamTradeUrl = tool.querySelector('#set-steam')?.value || '';
      cache.settings = await api.admin.saveSettings({ paypalUrl, steamTradeUrl });
      document.dispatchEvent(new CustomEvent('aimkit:settings-updated'));
    }, 'Donate links saved.'),
  );

  // Owner logs
  tool.querySelector('#owner-logs-filter')?.addEventListener('change', (e) => {
    cache.logsFilter = e.target.value || '';
    act(async () => {
      await loadSection('logs');
      render();
    });
  });
  tool.querySelector('#owner-logs-refresh')?.addEventListener('click', () =>
    act(async () => {
      await loadSection('logs');
      render();
    }, 'Logs refreshed.'),
  );
}

// Show/hide the top-level Admin nav tab depending on the user's role.
function toggleAdminNav(user) {
  document.querySelectorAll('.admin-only').forEach((el) => el.classList.toggle('hidden', !isAdmin(user)));
}

export async function initAdminTool() {
  tool = document.querySelector('#admin-tool');
  if (!tool) return;
  session = getUser();
  toggleAdminNav(session);
  subscribe(async (user) => {
    const was = isAdmin(session);
    session = user;
    toggleAdminNav(user);
    if (isAdmin(user) && !was) await refreshCounts();
    render();
  });
  render();
  if (isAdmin(session)) {
    await refreshCounts();
    render();
  }
}
