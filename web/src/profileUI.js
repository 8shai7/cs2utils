import { api, isOwner, resolveMediaUrl } from './api.js';
import { getUser, subscribe, refresh } from './session.js';
import { openAuth } from './headerAuth.js';

let tool;
let session = null;
let stats = null;
let settings = { paypalUrl: '', steamTradeUrl: '' };
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
  const el = tool?.querySelector('#profile-status');
  if (el) {
    el.textContent = text;
    el.className = `status${kind ? ` ${kind}` : ''}`;
  }
}

function fmtDate(v) {
  try {
    return new Date(v).toLocaleDateString();
  } catch {
    return '—';
  }
}

async function loadData() {
  if (!session) return;
  try {
    const p = await api.auth.profile();
    stats = p.stats;
  } catch (err) {
    setStatus(err.message, 'error');
  }
  if (isOwner(session)) {
    try {
      settings = await api.settings.get();
    } catch {
      /* ignore */
    }
  }
}

function statCard(label, value) {
  return `<div class="profile-stat"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`;
}

function ownerSettingsHtml() {
  if (!isOwner(session)) return '';
  return `
    <section class="panel profile-settings">
      <div class="panel-head"><h2>Donate links</h2><span class="panel-tag">Owner only</span></div>
      <div class="profile-settings-body">
        <p class="hint">These power the PayPal &amp; Steam buttons in the site footer. Leave a field empty to hide that button.</p>
        <label class="field">
          <span>PayPal link</span>
          <input id="set-paypal" type="url" placeholder="https://www.paypal.com/paypalme/yourname" value="${esc(settings.paypalUrl)}" />
        </label>
        <label class="field">
          <span>Steam trade link</span>
          <input id="set-steam" type="url" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." value="${esc(settings.steamTradeUrl)}" />
        </label>
        <div class="actions">
          <button class="btn primary" id="set-save">Save donate links</button>
        </div>
      </div>
    </section>`;
}

function render() {
  if (!session) {
    tool.innerHTML = `<div class="profile-shell"><div class="login-prompt">
      <p class="hint">Log in to view your profile.</p>
      <div class="actions"><button class="btn primary" data-open-auth="login">Log in</button><button class="btn" data-open-auth="register">Register</button></div>
    </div></div>`;
    tool.querySelectorAll('[data-open-auth]').forEach((b) => b.addEventListener('click', () => openAuth(b.dataset.openAuth)));
    return;
  }

  const initial = (session.username || '?').charAt(0).toUpperCase();
  const s = stats || { nadesTotal: 0, nadesApproved: 0, nadesPending: 0, recommendations: 0, comments: 0, nadeFavorites: 0 };

  tool.innerHTML = `
    <div class="profile-shell">
      <section class="panel profile-card">
        <div class="profile-head">
          <div class="profile-avatar">${
            session.avatarUrl
              ? `<img src="${esc(resolveMediaUrl(session.avatarUrl))}" alt="${esc(session.username)}" />`
              : esc(initial)
          }</div>
          <div>
            <h2 class="profile-name">${esc(session.username)} <span class="nade-badge ${esc(session.role)}">${esc(session.role)}</span></h2>
            <p class="hint">${session.email ? esc(session.email) : 'No email set'} · member since ${fmtDate(session.createdAt)}</p>
            <div class="avatar-controls">
              <input type="file" id="avatar-file" accept="image/*" hidden />
              <button class="btn btn-sm" id="avatar-upload">${session.avatarUrl ? 'Change photo' : 'Upload photo'}</button>
              ${session.avatarUrl ? '<button class="btn btn-sm ghost" id="avatar-remove">Remove</button>' : ''}
            </div>
          </div>
        </div>
        <dl class="profile-stats">
          ${statCard('Nades submitted', s.nadesTotal)}
          ${statCard('Approved', s.nadesApproved)}
          ${statCard('Pending', s.nadesPending)}
          ${statCard('Favorite nades', s.nadeFavorites)}
          ${statCard('Commands recommended', s.recommendations)}
          ${statCard('Comments', s.comments)}
        </dl>
      </section>
      <section class="panel profile-account">
        <div class="panel-head"><h2>Account</h2></div>
        <div class="profile-settings-body">
          <label class="field"><span>Username</span><input id="acc-username" type="text" value="${esc(session.username)}" maxlength="80" /></label>
          <div class="actions"><button class="btn btn-sm" id="username-save">Save username</button></div>
          <div class="account-steam">
            ${
              session.steamId
                ? `<p class="hint">Steam linked${session.steamPersona ? `: <strong>${esc(session.steamPersona)}</strong>` : ''}.</p>
                   <button class="btn btn-sm ghost" id="steam-unlink">Unlink Steam</button>`
                : `<p class="hint">Connect your Steam account so you can also log in with Steam.</p>
                   <button class="btn btn-sm" id="steam-link">Connect Steam</button>`
            }
          </div>
        </div>
      </section>
      ${
        session.hasPassword
          ? `<section class="panel profile-password">
               <div class="panel-head"><h2>Change password</h2></div>
               <div class="profile-settings-body">
                 <label class="field"><span>Current password</span><input id="pw-current" type="password" autocomplete="current-password" /></label>
                 <label class="field"><span>New password</span><input id="pw-new" type="password" autocomplete="new-password" /></label>
                 <div class="actions"><button class="btn primary" id="pw-save">Update password</button></div>
               </div>
             </section>`
          : `<section class="panel profile-password">
               <div class="panel-head"><h2>Set email &amp; password</h2><span class="panel-tag">Steam account</span></div>
               <div class="profile-settings-body">
                 <p class="hint">Add an email and password so you can log in without Steam. Your email can't be changed later.</p>
                 <label class="field"><span>Email</span><input id="cred-email" type="email" autocomplete="email" /></label>
                 <label class="field"><span>Password</span><input id="cred-password" type="password" autocomplete="new-password" /></label>
                 <div class="actions"><button class="btn primary" id="cred-save">Save email &amp; password</button></div>
               </div>
             </section>`
      }
      ${ownerSettingsHtml()}
      <div id="profile-status" class="status ${statusMsg.kind}">${esc(statusMsg.text)}</div>
    </div>`;

  tool.querySelector('#set-save')?.addEventListener('click', onSaveSettings);
  tool.querySelector('#pw-save')?.addEventListener('click', onChangePassword);
  tool.querySelector('#username-save')?.addEventListener('click', onChangeUsername);
  tool.querySelector('#cred-save')?.addEventListener('click', onSetCredentials);
  tool.querySelector('#steam-link')?.addEventListener('click', onSteamLink);
  tool.querySelector('#steam-unlink')?.addEventListener('click', onSteamUnlink);

  const fileInput = tool.querySelector('#avatar-file');
  tool.querySelector('#avatar-upload')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => onAvatarUpload(e.target.files?.[0]));
  tool.querySelector('#avatar-remove')?.addEventListener('click', onAvatarRemove);
}

async function onAvatarUpload(file) {
  if (!file) return;
  setStatus('Uploading image…', '');
  try {
    await api.auth.uploadAvatar(file);
    await refresh();
    setStatus('Profile image updated.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onChangePassword() {
  const currentPassword = tool.querySelector('#pw-current')?.value || '';
  const newPassword = tool.querySelector('#pw-new')?.value || '';
  try {
    await api.auth.changePassword({ currentPassword, newPassword });
    tool.querySelector('#pw-current').value = '';
    tool.querySelector('#pw-new').value = '';
    setStatus('Password updated.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onAvatarRemove() {
  try {
    await api.auth.setAvatar('');
    await refresh();
    setStatus('Profile image removed.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onChangeUsername() {
  const username = tool.querySelector('#acc-username')?.value || '';
  try {
    await api.auth.changeUsername(username);
    await refresh();
    setStatus('Username updated.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onSetCredentials() {
  const email = tool.querySelector('#cred-email')?.value || '';
  const password = tool.querySelector('#cred-password')?.value || '';
  try {
    await api.auth.setCredentials({ email, password });
    await refresh();
    setStatus('Email & password saved — you can now log in without Steam.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onSteamLink() {
  try {
    const url = await api.auth.steamLinkUrl();
    window.location.href = url;
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onSteamUnlink() {
  try {
    await api.auth.steamUnlink();
    await refresh();
    setStatus('Steam unlinked.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

async function onSaveSettings() {
  const paypalUrl = tool.querySelector('#set-paypal')?.value || '';
  const steamTradeUrl = tool.querySelector('#set-steam')?.value || '';
  try {
    settings = await api.admin.saveSettings({ paypalUrl, steamTradeUrl });
    setStatus('Donate links saved.', 'ok');
    document.dispatchEvent(new CustomEvent('aimkit:settings-updated'));
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

export async function initProfileTool() {
  tool = document.querySelector('#profile-tool');
  if (!tool) return;
  session = getUser();

  subscribe(async (user) => {
    session = user;
    await loadData();
    render();
  });

  render();
  await loadData();
  render();
}
