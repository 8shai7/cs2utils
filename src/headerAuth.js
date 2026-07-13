// Global header account menu + login/register modal, shown on every tool tab.

import { getUser, subscribe, login, register, logout, refresh } from './session.js';

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
  modalEl.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Account">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">${isLogin ? 'Welcome back' : 'Create your account'}</h2>
      <div class="auth-tabs">
        <button class="tab ${isLogin ? 'active' : ''}" data-mode="login">Log in</button>
        <button class="tab ${!isLogin ? 'active' : ''}" data-mode="register">Register</button>
      </div>
      <form id="hdr-auth-form" class="auth-form-modal">
        ${
          isLogin
            ? ''
            : '<label class="field"><span>Username</span><input id="hdr-username" type="text" autocomplete="username" /></label>'
        }
        <label class="field"><span>Email</span><input id="hdr-email" type="email" autocomplete="email" /></label>
        <label class="field"><span>Password</span><input id="hdr-password" type="password" autocomplete="${isLogin ? 'current-password' : 'new-password'}" /></label>
        <button class="btn primary" type="submit">${isLogin ? 'Log in' : 'Create account'}</button>
        <p class="status" id="hdr-auth-status"></p>
      </form>
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
