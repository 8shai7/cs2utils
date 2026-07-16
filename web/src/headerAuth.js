// Global header account menu + login/register modal, shown on every tool tab.

import { getUser, subscribe, login, register, logout, refresh } from './session.js';
import { resolveMediaUrl, api, steamLoginUrl } from './api.js';

let menuEl;
let modalEl;
let authMode = 'login';
let captcha = { required: false, token: null, svg: '' };
let pendingEmail = '';

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderMenu() {
  const user = getUser();
  if (user) {
    menuEl.innerHTML = `
      <button class="account-chip" id="hdr-profile" title="View your profile">
        ${user.avatarUrl ? `<img class="account-avatar" src="${esc(resolveMediaUrl(user.avatarUrl))}" alt="" />` : ''}
        <span class="account-name">${esc(user.username)}</span>
        <span class="nade-badge ${esc(user.role)}">${esc(user.role)}</span>
      </button>
      <button class="btn ghost btn-sm" id="hdr-logout">Log out</button>`;
    menuEl
      .querySelector('#hdr-profile')
      .addEventListener('click', () => document.dispatchEvent(new CustomEvent('aimkit:navigate', { detail: 'profile' })));
    menuEl.querySelector('#hdr-logout').addEventListener('click', () => logout());
  } else {
    menuEl.innerHTML = `
      <button class="btn ghost btn-sm" id="hdr-login">Log in</button>
      <button class="btn primary btn-sm" id="hdr-register">Register</button>`;
    menuEl.querySelector('#hdr-login').addEventListener('click', () => openModal('login'));
    menuEl.querySelector('#hdr-register').addEventListener('click', () => openModal('register'));
  }
}

function renderModal() {
  const isLogin = authMode === 'login';
  const isForgot = authMode === 'forgot';
  const isVerify = authMode === 'verify';

  if (isVerify) {
    modalEl.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal-card" role="dialog" aria-modal="true" aria-label="Verify your email">
        <button class="modal-close" data-close aria-label="Close">&times;</button>
        <h2 class="modal-title">Verify your email</h2>
        <p class="hint">We sent a verification link to <strong>${esc(pendingEmail)}</strong>. Click it to activate your account, then log in.</p>
        <div class="actions">
          <button class="btn" id="hdr-resend" type="button">Resend email</button>
          <button class="btn ghost" data-mode="login" type="button">Back to log in</button>
        </div>
        <p class="status" id="hdr-auth-status"></p>
      </div>`;
    modalEl.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
    modalEl.querySelectorAll('[data-mode]').forEach((el) => el.addEventListener('click', () => setMode(el.dataset.mode)));
    modalEl.querySelector('#hdr-resend')?.addEventListener('click', onResend);
    return;
  }

  const title = isForgot ? 'Reset your password' : isLogin ? 'Welcome back' : 'Create your account';
  modalEl.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Account">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">${title}</h2>
      ${
        isForgot
          ? ''
          : `<div class="auth-tabs">
               <button class="tab ${isLogin ? 'active' : ''}" data-mode="login">Log in</button>
               <button class="tab ${!isLogin ? 'active' : ''}" data-mode="register">Register</button>
             </div>`
      }
      <form id="hdr-auth-form" class="auth-form-modal">
        ${
          !isLogin && !isForgot
            ? '<label class="field"><span>Username</span><input id="hdr-username" type="text" autocomplete="username" /></label>'
            : ''
        }
        <label class="field"><span>Email</span><input id="hdr-email" type="email" autocomplete="email" /></label>
        ${
          isForgot
            ? ''
            : `<label class="field"><span>Password</span><input id="hdr-password" type="password" autocomplete="${isLogin ? 'current-password' : 'new-password'}" /></label>`
        }
        ${
          captcha.required && !isForgot
            ? `<div class="captcha-field">
                 <div class="captcha-row">
                   <div class="captcha-image" id="hdr-captcha-img">${captcha.svg}</div>
                   <button type="button" class="captcha-refresh" id="hdr-captcha-refresh" title="New image" aria-label="New image">&#8635;</button>
                 </div>
                 <label class="field"><span>Enter the characters above</span><input id="hdr-captcha" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" /></label>
               </div>`
            : ''
        }
        <button class="btn primary" type="submit">${isForgot ? 'Send reset link' : isLogin ? 'Log in' : 'Create account'}</button>
        <p class="auth-alt">${
          isForgot
            ? '<button type="button" class="linkish" data-mode="login">← Back to log in</button>'
            : isLogin
              ? '<button type="button" class="linkish" data-mode="forgot">Forgot password?</button>'
              : ''
        }</p>
        <p class="status" id="hdr-auth-status"></p>
      </form>
      ${
        isForgot
          ? ''
          : `<div class="auth-divider"><span>or</span></div>
             <a class="btn steam-login" href="${steamLoginUrl}">
               <svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2.05 11l5.32 2.2a2.82 2.82 0 0 1 1.6-.5l2.37-3.44v-.05a3.76 3.76 0 1 1 3.76 3.76h-.09l-3.38 2.42a2.83 2.83 0 0 1-5.63.4l-3.8-1.57A10 10 0 1 0 12 2ZM7.6 17.17l-1.22-.5a2.13 2.13 0 0 0 3.94-.17 2.12 2.12 0 0 0-1.15-2.77l-1.26-.52a2.83 2.83 0 0 1 2.14 5.24 2.79 2.79 0 0 1-2.19-1.28Zm9.79-6.4a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02Z"/></svg>
               Sign in with Steam
             </a>`
      }
    </div>`;

  modalEl.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  modalEl.querySelectorAll('[data-mode]').forEach((el) => el.addEventListener('click', () => setMode(el.dataset.mode)));
  modalEl.querySelector('#hdr-auth-form').addEventListener('submit', onSubmit);
  modalEl.querySelector('#hdr-captcha-refresh')?.addEventListener('click', async () => {
    await loadCaptcha();
    const img = modalEl.querySelector('#hdr-captcha-img');
    if (img) img.innerHTML = captcha.svg;
    const inp = modalEl.querySelector('#hdr-captcha');
    if (inp) inp.value = '';
  });
  modalEl.querySelector('#hdr-email')?.focus();
}

async function loadCaptcha() {
  try {
    const c = await api.auth.captcha();
    captcha.token = c.token;
    captcha.svg = c.svg;
  } catch {
    /* ignore — the next submit will re-request */
  }
}

// Switch the modal view. Register always shows a CAPTCHA (anti-spam).
async function setMode(mode) {
  authMode = mode;
  if (mode === 'register') {
    captcha.required = true;
    if (!captcha.svg) await loadCaptcha();
  } else if (mode !== 'verify') {
    captcha.required = false;
  }
  renderModal();
}

async function onResend() {
  try {
    const r = await api.auth.resendVerification(pendingEmail);
    setStatus(r.message || 'Verification email sent.', 'ok');
  } catch (err) {
    setStatus(err.message, 'error');
  }
}

function setStatus(text, kind) {
  const s = modalEl.querySelector('#hdr-auth-status');
  if (s) {
    s.textContent = text;
    s.className = `status ${kind || ''}`.trim();
  }
}

// Re-render the modal while keeping whatever the user already typed.
function rerenderPreserving() {
  const email = modalEl.querySelector('#hdr-email')?.value || '';
  const password = modalEl.querySelector('#hdr-password')?.value || '';
  const username = modalEl.querySelector('#hdr-username')?.value || '';
  renderModal();
  const e = modalEl.querySelector('#hdr-email');
  if (e) e.value = email;
  const p = modalEl.querySelector('#hdr-password');
  if (p) p.value = password;
  const u = modalEl.querySelector('#hdr-username');
  if (u) u.value = username;
}

async function onSubmit(e) {
  e.preventDefault();
  const email = modalEl.querySelector('#hdr-email')?.value || '';
  const password = modalEl.querySelector('#hdr-password')?.value || '';
  const username = modalEl.querySelector('#hdr-username')?.value || '';
  const captchaAnswer = modalEl.querySelector('#hdr-captcha')?.value || '';

  if (authMode === 'forgot') {
    try {
      await api.auth.forgot(email);
      setStatus('If an account exists for that email, a reset link is on its way.', 'ok');
    } catch (err) {
      setStatus(err.message, 'error');
    }
    return;
  }

  if (authMode === 'register') {
    try {
      const data = await register({ email, username, password, captchaToken: captcha.token, captchaAnswer });
      if (data && data.verifyRequired) {
        pendingEmail = data.email || email;
        captcha = { required: false, token: null, svg: '' };
        await setMode('verify');
        setStatus(data.message || 'Check your email to verify your account.', 'ok');
        return;
      }
      captcha = { required: false, token: null, svg: '' };
      closeModal();
    } catch (err) {
      // Bad/expired captcha or rate limit → refresh the captcha and let them retry.
      captcha.required = true;
      await loadCaptcha();
      rerenderPreserving();
      setStatus(err.message, 'error');
    }
    return;
  }

  // login
  try {
    await login({ email, password, captchaToken: captcha.token, captchaAnswer });
    captcha = { required: false, token: null, svg: '' };
    closeModal();
  } catch (err) {
    if (err?.data?.verifyRequired) {
      pendingEmail = err.data.email || email;
      await setMode('verify');
      setStatus(err.message, 'error');
      return;
    }
    if (err?.data?.captchaRequired) {
      captcha.required = true;
      await loadCaptcha();
      rerenderPreserving();
    }
    setStatus(err.message, 'error');
  }
}

/** Open the reset-password modal for a token from the emailed link. */
export function openReset(token) {
  const el = document.createElement('div');
  el.className = 'modal';
  el.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Reset password">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">Choose a new password</h2>
      <form id="reset-form" class="auth-form-modal">
        <label class="field"><span>New password</span><input id="reset-password" type="password" autocomplete="new-password" /></label>
        <button class="btn primary" type="submit">Set new password</button>
        <p class="status" id="reset-status"></p>
      </form>
    </div>`;
  document.body.appendChild(el);
  const close = () => el.remove();
  el.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  const statusEl = el.querySelector('#reset-status');
  el.querySelector('#reset-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    try {
      await api.auth.reset(token, el.querySelector('#reset-password').value);
      statusEl.textContent = 'Password updated! You can now log in.';
      statusEl.className = 'status ok';
      setTimeout(() => {
        close();
        openModal('login');
      }, 1200);
    } catch (err) {
      statusEl.textContent = err.message;
      statusEl.className = 'status error';
    }
  });
  el.querySelector('#reset-password')?.focus();
}

function openModal(mode) {
  modalEl.classList.remove('hidden');
  setMode(mode);
}

function closeModal() {
  modalEl.classList.add('hidden');
}

/** Programmatically open the login modal (used by other views). */
export function openAuth(mode = 'login') {
  openModal(mode);
}

export async function initHeaderAuth() {
  menuEl = document.querySelector('#account-menu');
  if (!menuEl) return;
  modalEl = document.createElement('div');
  modalEl.id = 'auth-modal';
  modalEl.className = 'modal hidden';
  document.body.appendChild(modalEl);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  subscribe(() => renderMenu());
  renderMenu();
  await refresh();
}
