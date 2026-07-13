// Guided "browser-assisted import" modal.
//
// Cloudflare / bot-protected sources (HLTV, Valve wiki) can't be fetched by our
// server or by cross-origin JS. Instead the admin opens the source in their own
// browser, completes the verification, copies the page content, and pastes it
// here — then the server parses it. This modal drives that flow.

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} opts.sourceUrl
 * @param {string} opts.sourceLabel
 * @param {string} [opts.placeholder]
 * @param {(content: string) => Promise<string>} opts.onImport resolve with a success message
 */
export function openImportModal(opts) {
  const el = document.createElement('div');
  el.className = 'modal';
  el.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card import-card" role="dialog" aria-modal="true" aria-label="${esc(opts.title)}">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <h2 class="modal-title">${esc(opts.title)}</h2>
      <p class="hint">${esc(opts.description)}</p>
      <ol class="import-steps">
        <li>Open the source and complete the verification: <a class="btn btn-sm" href="${esc(opts.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(opts.sourceLabel)} ↗</a></li>
        <li>Copy the page content.</li>
        <li>Paste it below and import.</li>
      </ol>
      <textarea id="import-content" rows="9" spellcheck="false" placeholder="${esc(opts.placeholder || 'Paste the page content here…')}"></textarea>
      <div class="actions">
        <button class="btn primary" id="import-run">Import</button>
        <button class="btn ghost" data-close>Cancel</button>
      </div>
      <p class="status" id="import-status"></p>
    </div>`;
  document.body.appendChild(el);

  const close = () => el.remove();
  el.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
  const onKey = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onKey);
    }
  };
  document.addEventListener('keydown', onKey);

  const statusEl = el.querySelector('#import-status');
  const runBtn = el.querySelector('#import-run');
  runBtn.addEventListener('click', async () => {
    const content = el.querySelector('#import-content').value;
    if (!content.trim()) {
      statusEl.textContent = 'Paste the page content first.';
      statusEl.className = 'status error';
      return;
    }
    runBtn.disabled = true;
    statusEl.textContent = 'Importing…';
    statusEl.className = 'status';
    try {
      const msg = await opts.onImport(content);
      statusEl.textContent = msg || 'Imported.';
      statusEl.className = 'status ok';
      setTimeout(close, 900);
    } catch (err) {
      statusEl.textContent = err.message;
      statusEl.className = 'status error';
      runBtn.disabled = false;
    }
  });

  el.querySelector('#import-content')?.focus();
}
