// Global header account menu + login/register modal, shown on every tool tab.

import { getUser, subscribe, login, register, logout, refresh } from './session.js';
import { resolveMediaUrl, api, steamLoginUrl } from './api.js';

let menuEl;
let modalEl;
let authMode = 'login';

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
  modalEl.querySelectorAll('[data-mode]').forEach((el) =>
    el.addEventListener('click', () => {
      authMode = el.dataset.mode;
      renderModal();
    }),
  );
  modalEl.querySelector('#hdr-auth-form').addEventListener('submit', onSubmit);
  modalEl.querySelector('#hdr-email')?.focus();
}

async function onSubmit(e) {
  e.preventDefault();
  const statusEl = modalEl.querySelector('#hdr-auth-status');
  const email = modalEl.querySelector('#hdr-email')?.value || '';
  const password = modalEl.querySelector('#hdr-password')?.value || '';
  const username = modalEl.querySelector('#hdr-username')?.value || '';
  try {
    if (authMode === 'forgot') {
      await api.auth.forgot(email);
      statusEl.textContent = 'If an account exists for that email, a reset link is on its way.';
      statusEl.className = 'status ok';
      return;
    }
    if (authMode === 'login') await login({ email, password });
    else await register({ email, username, password });
    closeModal();
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = err.message;
      statusEl.className = 'status error';
    }
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
  authMode = mode;
  modalEl.classList.remove('hidden');
  renderModal();
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
