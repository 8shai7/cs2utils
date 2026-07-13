/** Fixed, bouncing toast for user-facing warnings and errors. */

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const TITLES = {
  error: 'Something went wrong',
  warn: 'Heads up',
  ok: 'Done',
};

let host = null;
let hideTimer = null;
let leaveTimer = null;

function ensureHost() {
  if (host?.isConnected) return host;
  host = document.createElement('div');
  host.className = 'app-toast-host';
  host.setAttribute('aria-live', 'assertive');
  host.setAttribute('aria-relevant', 'additions');
  document.body.appendChild(host);
  return host;
}

function clearTimers() {
  if (hideTimer) clearTimeout(hideTimer);
  if (leaveTimer) clearTimeout(leaveTimer);
  hideTimer = null;
  leaveTimer = null;
}

/**
 * @param {string} message
 * @param {{ kind?: 'error'|'warn'|'ok', title?: string, duration?: number }} [opts]
 */
export function showToast(message, opts = {}) {
  const kind = opts.kind === 'ok' || opts.kind === 'warn' ? opts.kind : 'error';
  const title = opts.title || TITLES[kind];
  const duration = Number.isFinite(opts.duration) ? opts.duration : kind === 'ok' ? 2800 : 4500;
  const text = String(message || '').trim();
  if (!text) return;

  const root = ensureHost();
  clearTimers();
  root.replaceChildren();

  const el = document.createElement('div');
  el.className = `app-toast app-toast--${kind}`;
  el.setAttribute('role', 'alert');
  el.innerHTML = `
    <span class="app-toast-icon" aria-hidden="true"></span>
    <div class="app-toast-body">
      <strong class="app-toast-title">${esc(title)}</strong>
      <p class="app-toast-msg">${esc(text)}</p>
    </div>
    <button type="button" class="app-toast-close" aria-label="Dismiss">&times;</button>`;

  const dismiss = () => {
    clearTimers();
    el.classList.remove('app-toast-in');
    el.classList.add('app-toast-out');
    leaveTimer = setTimeout(() => {
      if (el.parentNode === root) el.remove();
    }, 220);
  };

  el.querySelector('.app-toast-close')?.addEventListener('click', dismiss);
  root.appendChild(el);
  // Next frame so the jump-in transition runs.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('app-toast-in'));
  });

  hideTimer = setTimeout(dismiss, duration);
}

export function showErrorToast(message, title) {
  showToast(message, { kind: 'error', title });
}

export function showWarnToast(message, title) {
  showToast(message, { kind: 'warn', title });
}
