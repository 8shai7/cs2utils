import { api } from './api.js';
import { getUser } from './session.js';

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function openContactModal() {
  const user = getUser();
  const el = document.createElement('div');
  el.className = 'modal';
  el.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="Contact us">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">Contact us</h2>
      <p class="hint">Send us a message and we'll get back to you at your email.</p>
      <form id="contact-form" class="auth-form-modal">
        <label class="field"><span>Your name</span><input id="contact-name" type="text" value="${esc(user?.username || '')}" /></label>
        <label class="field"><span>Your email</span><input id="contact-email" type="email" value="${esc(user?.email || '')}" /></label>
        <label class="field"><span>Subject</span><input id="contact-subject" type="text" placeholder="What's this about?" /></label>
        <label class="field"><span>Message</span><textarea id="contact-message" rows="5" placeholder="How can we help?"></textarea></label>
        <div class="captcha-field">
          <div class="captcha-row">
            <div class="captcha-image" id="contact-captcha-img"></div>
            <button type="button" class="captcha-refresh" id="contact-captcha-refresh" title="New image" aria-label="New image">&#8635;</button>
          </div>
          <label class="field"><span>Enter the characters above</span><input id="contact-captcha" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" /></label>
        </div>
        <button class="btn primary" type="submit">Send message</button>
        <p class="status" id="contact-status"></p>
      </form>
    </div>`;
  document.body.appendChild(el);

  const close = () => el.remove();
  el.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));

  const statusEl = el.querySelector('#contact-status');
  let captchaToken = null;

  async function loadCaptcha() {
    try {
      const c = await api.auth.captcha();
      captchaToken = c.token;
      const img = el.querySelector('#contact-captcha-img');
      if (img) img.innerHTML = c.svg;
    } catch {
      /* ignore; server will require it on submit */
    }
  }
  loadCaptcha();
  el.querySelector('#contact-captcha-refresh')?.addEventListener('click', () => {
    const inp = el.querySelector('#contact-captcha');
    if (inp) inp.value = '';
    loadCaptcha();
  });

  el.querySelector('#contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: el.querySelector('#contact-name').value,
      email: el.querySelector('#contact-email').value,
      subject: el.querySelector('#contact-subject').value,
      message: el.querySelector('#contact-message').value,
      captchaToken,
      captchaAnswer: el.querySelector('#contact-captcha').value,
    };
    statusEl.textContent = 'Sending…';
    statusEl.className = 'status';
    try {
      await api.contact.send(data);
      statusEl.textContent = 'Thanks! Your message has been sent.';
      statusEl.className = 'status ok';
      setTimeout(close, 1200);
    } catch (err) {
      statusEl.textContent = err.message;
      statusEl.className = 'status error';
      // Refresh the captcha on any failure (esp. a wrong/expired captcha).
      const inp = el.querySelector('#contact-captcha');
      if (inp) inp.value = '';
      loadCaptcha();
    }
  });

  el.querySelector('#contact-name')?.focus();
}
