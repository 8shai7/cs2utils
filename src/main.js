import {
  decodeCrosshairShareCode,
  encodeCrosshair,
  crosshairToConVars,
  InvalidCrosshairShareCode,
  InvalidShareCode,
} from 'csgo-sharecode';
import { parseCommandsToCrosshair, formatCommands, DEFAULT_CROSSHAIR } from './convars.js';
import { renderCrosshairPreview } from './preview.js';
import {
  GAMES,
  convertSensitivity,
  formatSens,
  formatDistance,
  gameOptionsHtml,
} from './sensitivity.js';
import './style.css';

const SHARECODE_RE = /^CSGO(-[\w]{5}){5}$/i;

// Donation links — replace these with the project owner's own PayPal.me handle and
// Steam trade-offer URL. Set a value to an empty string to hide that button.
const DONATE_PAYPAL_URL = 'https://www.paypal.com/paypalme/8shai7';
const DONATE_STEAM_TRADE_URL = 'https://steamcommunity.com/tradeoffer/new/?partner=YOUR_ID&token=YOUR_TOKEN';

const PAYPAL_ICON = `<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.1 7.3c.3 2-.3 3.6-1.5 4.8-1.2 1.2-3 1.8-5.2 1.8h-1.1c-.4 0-.8.3-.9.8l-.7 4.5-.2 1.1c0 .3-.3.5-.6.5H6.2c-.3 0-.5-.3-.4-.6L8 6.1c.1-.6.6-1 1.2-1h5.3c2.7 0 4.7.9 5.3 2.9.1.4.2.9.3 1.3z"/><path fill="currentColor" opacity=".55" d="M8.9 9.3c.1-.6.6-1 1.2-1h4.2c.6 0 1.1.1 1.6.2-.3-1.6-1.7-2.4-3.9-2.4H6.8c-.4 0-.8.3-.9.8L3.5 21c0 .3.2.6.5.6h3.1l1.8-12.3z"/></svg>`;
const STEAM_ICON = `<svg class="donate-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2.05 11l5.32 2.2a2.82 2.82 0 0 1 1.6-.5l2.37-3.44v-.05a3.76 3.76 0 1 1 3.76 3.76h-.09l-3.38 2.42a2.83 2.83 0 0 1-5.63.4l-3.8-1.57A10 10 0 1 0 12 2ZM7.6 17.17l-1.22-.5a2.13 2.13 0 0 0 3.94-.17 2.12 2.12 0 0 0-1.15-2.77l-1.26-.52a2.83 2.83 0 0 1 2.14 5.24 2.79 2.79 0 0 1-2.19-1.28Zm9.79-6.4a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02Zm-1.87-2.51a1.88 1.88 0 1 0 3.76 0 1.88 1.88 0 0 0-3.76 0Z"/></svg>`;

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="page">
    <header class="hero">
      <div class="hero-badge">Counter-Strike 2</div>
      <h1>CS2 Utils</h1>
      <p class="hero-sub">
        Crosshair code conversion with live preview, plus FPS sensitivity conversion
        that keeps your cm/360 the same across games.
      </p>
      <nav class="tool-nav" role="tablist" aria-label="Tools">
        <button class="tool-tab active" data-tool="crosshair" role="tab" aria-selected="true">Crosshair</button>
        <button class="tool-tab" data-tool="sensitivity" role="tab" aria-selected="false">Sensitivity</button>
      </nav>
    </header>

    <main id="crosshair-tool" class="tool-view active">
      <div class="layout layout-crosshair">
        <section class="panel preview-panel">
          <div class="panel-head">
            <h2>Preview</h2>
            <span class="panel-tag">Approximate in-game look</span>
          </div>
          <div class="preview-stage">
            <canvas id="preview-canvas" width="280" height="280" aria-label="Crosshair preview"></canvas>
          </div>
          <dl id="preview-stats" class="preview-stats"></dl>
        </section>

        <section class="panel converter-panel">
          <div class="tabs" role="tablist">
            <button class="tab active" data-tab="code-to-cmd" role="tab" aria-selected="true">Code → Commands</button>
            <button class="tab" data-tab="cmd-to-code" role="tab" aria-selected="false">Commands → Code</button>
            <button class="tab" data-tab="visual" role="tab" aria-selected="false">Visual editor</button>
          </div>

          <div class="tab-panel active" data-panel="code-to-cmd">
            <label class="field">
              <span>Crosshair share code</span>
              <input id="sharecode-input" type="text" spellcheck="false" placeholder="CSGO-UseJt-3oTvn-47wPX-hEyER-WZfiK" autocomplete="off" />
            </label>
            <div class="actions">
              <button class="btn primary" id="decode-btn">Convert to commands</button>
              <button class="btn ghost" id="load-example-code">Load example</button>
            </div>
            <label class="field">
              <span>Console commands</span>
              <textarea id="commands-output" rows="14" readonly spellcheck="false"></textarea>
            </label>
            <div class="actions">
              <button class="btn" id="copy-commands">Copy commands</button>
              <button class="btn ghost" id="copy-sharecode-cmd">Copy import command</button>
            </div>
            <p class="hint">Paste into the developer console, or use <code>cl_crosshair_sharecode "YOUR-CODE"</code>.</p>
          </div>

          <div class="tab-panel" data-panel="cmd-to-code">
            <label class="field">
              <span>Console commands</span>
              <textarea id="commands-input" rows="14" spellcheck="false" placeholder="cl_crosshairstyle 4;&#10;cl_crosshairsize 3;&#10;..."></textarea>
            </label>
            <div class="actions">
              <button class="btn primary" id="encode-btn">Convert to code</button>
              <button class="btn ghost" id="load-example-cmd">Load example</button>
            </div>
            <label class="field">
              <span>Crosshair share code</span>
              <input id="sharecode-output" type="text" readonly spellcheck="false" />
            </label>
            <div class="actions">
              <button class="btn" id="copy-code">Copy code</button>
            </div>
            <p class="hint">Import via Settings → Game → Crosshair → Share or Import.</p>
          </div>

          <div class="tab-panel" data-panel="visual">
            <div class="editor-grid">
              <label class="field">
                <span>Style</span>
                <select id="ed-style">
                  <option value="0">0 — Default</option>
                  <option value="1">1 — Default static</option>
                  <option value="2">2 — Classic</option>
                  <option value="3">3 — Classic dynamic</option>
                  <option value="4">4 — Classic static</option>
                </select>
              </label>
              <label class="field">
                <span>Color</span>
                <select id="ed-color">
                  <option value="0">White</option>
                  <option value="1">Green</option>
                  <option value="2">Yellow</option>
                  <option value="3">Blue</option>
                  <option value="4">Cyan</option>
                  <option value="5">Custom (RGB)</option>
                </select>
              </label>
            </div>

            <label class="field" id="ed-custom-color-field">
              <span>Custom color</span>
              <input id="ed-custom-color" type="color" value="#32fa32" />
            </label>

            <label class="field range-field">
              <span>Size <output id="ed-length-val"></output></span>
              <input id="ed-length" type="range" min="0" max="15" step="0.5" />
            </label>
            <label class="field range-field">
              <span>Thickness <output id="ed-thickness-val"></output></span>
              <input id="ed-thickness" type="range" min="0" max="6" step="0.1" />
            </label>
            <label class="field range-field">
              <span>Gap <output id="ed-gap-val"></output></span>
              <input id="ed-gap" type="range" min="-10" max="10" step="0.5" />
            </label>
            <label class="field range-field">
              <span>Outline thickness <output id="ed-outline-val"></output></span>
              <input id="ed-outline" type="range" min="0" max="3" step="0.5" />
            </label>
            <label class="field range-field">
              <span>Alpha <output id="ed-alpha-val"></output></span>
              <input id="ed-alpha" type="range" min="0" max="255" step="5" />
            </label>

            <div class="editor-toggles">
              <label class="toggle"><input id="ed-dot" type="checkbox" /> Center dot</label>
              <label class="toggle"><input id="ed-tstyle" type="checkbox" /> T-style</label>
              <label class="toggle"><input id="ed-outline-on" type="checkbox" /> Outline</label>
              <label class="toggle"><input id="ed-alpha-on" type="checkbox" /> Use alpha</label>
            </div>

            <label class="field">
              <span>Generated share code</span>
              <input id="ed-sharecode" type="text" readonly spellcheck="false" />
            </label>
            <label class="field">
              <span>Console commands</span>
              <textarea id="ed-commands" rows="10" readonly spellcheck="false"></textarea>
            </label>
            <div class="actions">
              <button class="btn" id="ed-copy-code">Copy code</button>
              <button class="btn" id="ed-copy-commands">Copy commands</button>
              <button class="btn ghost" id="ed-reset">Reset</button>
            </div>
            <p class="hint">Drag the sliders to design your crosshair — the preview, share code, and commands update live.</p>
          </div>

          <div id="crosshair-status" class="status" role="status" aria-live="polite"></div>
        </section>
      </div>
    </main>

    <main id="sensitivity-tool" class="tool-view">
      <div class="layout layout-sensitivity">
        <section class="panel sens-summary-panel">
          <div class="panel-head">
            <h2>Distance / 360°</h2>
            <span class="panel-tag">Matched across games</span>
          </div>
          <div class="sens-hero-stat">
            <span id="sens-cm360" class="sens-big">—</span>
            <span class="sens-unit">cm / 360°</span>
          </div>
          <dl id="sens-stats" class="preview-stats sens-stats"></dl>
          <p class="sens-note">Converts using each game's yaw constant so the same mouse movement produces the same turn distance.</p>
        </section>

        <section class="panel converter-panel">
          <div class="sens-grid">
            <label class="field">
              <span>From game</span>
              <select id="sens-from-game"></select>
            </label>
            <label class="field">
              <span>To game</span>
              <select id="sens-to-game"></select>
            </label>
          </div>

          <div class="sens-grid">
            <label class="field">
              <span>Source sensitivity</span>
              <input id="sens-source" type="number" min="0" step="0.001" inputmode="decimal" placeholder="1.25" />
            </label>
            <label class="field">
              <span>Converted sensitivity</span>
              <input id="sens-target" type="text" readonly />
            </label>
          </div>

          <div class="sens-grid">
            <label class="field">
              <span>Source DPI</span>
              <input id="sens-source-dpi" type="number" min="1" step="50" inputmode="numeric" value="800" />
            </label>
            <label class="field">
              <span>Target DPI</span>
              <input id="sens-target-dpi" type="number" min="1" step="50" inputmode="numeric" value="800" />
            </label>
          </div>

          <div id="m-yaw-fields" class="sens-grid hidden">
            <label class="field">
              <span>CS2 source m_yaw</span>
              <input id="sens-source-myaw" type="number" min="0.001" step="0.001" inputmode="decimal" value="0.022" />
            </label>
            <label class="field">
              <span>CS2 target m_yaw</span>
              <input id="sens-target-myaw" type="number" min="0.001" step="0.001" inputmode="decimal" value="0.022" />
            </label>
          </div>

          <div class="sens-grid">
            <label class="field hidden" id="source-yaw-field">
              <span>Source custom yaw (°/count)</span>
              <input id="sens-source-yaw" type="number" min="0.00001" step="0.0001" inputmode="decimal" value="0.022" />
            </label>
            <label class="field hidden" id="target-yaw-field">
              <span>Target custom yaw (°/count)</span>
              <input id="sens-target-yaw" type="number" min="0.00001" step="0.0001" inputmode="decimal" value="0.022" />
            </label>
          </div>

          <div class="actions">
            <button class="btn primary" id="sens-swap">Swap games</button>
            <button class="btn" id="copy-sens">Copy converted sens</button>
            <button class="btn ghost" id="sens-cs2-val">CS2 → Valorant example</button>
          </div>

          <div id="sens-formula" class="sens-formula"></div>
          <div id="sensitivity-status" class="status" role="status" aria-live="polite"></div>
        </section>
      </div>
    </main>

    <footer class="footer">
      <section class="donate">
        <p class="donate-label">Found CS2 Utils useful? Support the project:</p>
        <div class="donate-actions">
          ${
            DONATE_PAYPAL_URL
              ? `<a class="btn donate-btn paypal" href="${DONATE_PAYPAL_URL}" target="_blank" rel="noopener noreferrer">${PAYPAL_ICON}<span>Donate via PayPal</span></a>`
              : ''
          }
          ${
            DONATE_STEAM_TRADE_URL
              ? `<a class="btn donate-btn steam" href="${DONATE_STEAM_TRADE_URL}" target="_blank" rel="noopener noreferrer">${STEAM_ICON}<span>Donate Steam skins</span></a>`
              : ''
          }
        </div>
      </section>
      <p class="footer-note">Not affiliated with Valve. Share codes and yaw values are community-verified.</p>
    </footer>
  </div>
`;

const canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#preview-canvas'));
const previewStats = document.querySelector('#preview-stats');
const crosshairStatus = document.querySelector('#crosshair-status');
const sensitivityStatus = document.querySelector('#sensitivity-status');

const sharecodeInput = /** @type {HTMLInputElement} */ (document.querySelector('#sharecode-input'));
const commandsOutput = /** @type {HTMLTextAreaElement} */ (document.querySelector('#commands-output'));
const commandsInput = /** @type {HTMLTextAreaElement} */ (document.querySelector('#commands-input'));
const sharecodeOutput = /** @type {HTMLInputElement} */ (document.querySelector('#sharecode-output'));

const sensFromGame = /** @type {HTMLSelectElement} */ (document.querySelector('#sens-from-game'));
const sensToGame = /** @type {HTMLSelectElement} */ (document.querySelector('#sens-to-game'));
const sensSource = /** @type {HTMLInputElement} */ (document.querySelector('#sens-source'));
const sensTarget = /** @type {HTMLInputElement} */ (document.querySelector('#sens-target'));
const sensSourceDpi = /** @type {HTMLInputElement} */ (document.querySelector('#sens-source-dpi'));
const sensTargetDpi = /** @type {HTMLInputElement} */ (document.querySelector('#sens-target-dpi'));
const sensSourceMYaw = /** @type {HTMLInputElement} */ (document.querySelector('#sens-source-myaw'));
const sensTargetMYaw = /** @type {HTMLInputElement} */ (document.querySelector('#sens-target-myaw'));
const sensSourceYaw = /** @type {HTMLInputElement} */ (document.querySelector('#sens-source-yaw'));
const sensTargetYaw = /** @type {HTMLInputElement} */ (document.querySelector('#sens-target-yaw'));
const sourceYawField = document.querySelector('#source-yaw-field');
const targetYawField = document.querySelector('#target-yaw-field');
const mYawFields = document.querySelector('#m-yaw-fields');
const sensCm360 = document.querySelector('#sens-cm360');
const sensStats = document.querySelector('#sens-stats');
const sensFormula = document.querySelector('#sens-formula');

const EXAMPLE_CODE = 'CSGO-UseJt-3oTvn-47wPX-hEyER-WZfiK';
const EXAMPLE_COMMANDS = `cl_crosshairstyle 4
cl_crosshairsize 3
cl_crosshairgap -2
cl_crosshairthickness 0.5
cl_crosshairdot 0
cl_crosshaircolor 1
cl_crosshaircolor_r 50
cl_crosshaircolor_g 250
cl_crosshaircolor_b 50
cl_crosshairalpha 200
cl_crosshairusealpha 1
cl_crosshair_drawoutline 0
cl_crosshair_recoil 0`;

/**
 * @param {HTMLElement | null} el
 * @param {string} message
 * @param {'ok' | 'error' | ''} kind
 */
function setStatus(el, message, kind = '') {
  if (!el) return;
  el.textContent = message;
  el.className = `status${kind ? ` ${kind}` : ''}`;
}

/**
 * @param {import('csgo-sharecode').Crosshair} crosshair
 */
function updatePreview(crosshair) {
  renderCrosshairPreview(canvas, crosshair);
  previewStats.innerHTML = `
    <div><dt>Style</dt><dd>${crosshair.style}</dd></div>
    <div><dt>Size</dt><dd>${crosshair.length}</dd></div>
    <div><dt>Gap</dt><dd>${crosshair.gap}</dd></div>
    <div><dt>Thickness</dt><dd>${crosshair.thickness}</dd></div>
    <div><dt>Dot</dt><dd>${crosshair.centerDotEnabled ? 'On' : 'Off'}</dd></div>
    <div><dt>Outline</dt><dd>${crosshair.outlineEnabled ? crosshair.outline : 'Off'}</dd></div>
    <div><dt>Color</dt><dd>${crosshair.color === 5 ? `RGB ${crosshair.red}/${crosshair.green}/${crosshair.blue}` : `Preset ${crosshair.color}`}</dd></div>
    <div><dt>Alpha</dt><dd>${crosshair.alphaEnabled ? crosshair.alpha : 'Off'}</dd></div>
  `;
}

/** @param {string} code */
function normalizeShareCode(code) {
  // Share code bodies are case-sensitive (Base57), so only strip whitespace and
  // normalize the leading "CSGO" prefix — never change the case of the payload.
  return code
    .trim()
    .replace(/\s+/g, '')
    .replace(/^csgo/i, 'CSGO');
}

function decodeFromCode() {
  const raw = sharecodeInput.value.trim();
  if (!raw) {
    setStatus(crosshairStatus, 'Paste a crosshair share code first.', 'error');
    return;
  }
  const code = normalizeShareCode(raw);
  if (!SHARECODE_RE.test(code)) {
    setStatus(crosshairStatus, 'Invalid format. Expected CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx', 'error');
    return;
  }
  try {
    const crosshair = decodeCrosshairShareCode(code);
    sharecodeInput.value = code;
    commandsOutput.value = formatCommands(crosshairToConVars(crosshair));
    updatePreview(crosshair);
    setStatus(crosshairStatus, 'Converted share code to console commands.', 'ok');
  } catch (err) {
    if (err instanceof InvalidCrosshairShareCode || err instanceof InvalidShareCode) {
      setStatus(crosshairStatus, 'That share code is not a valid crosshair code.', 'error');
    } else {
      setStatus(crosshairStatus, err instanceof Error ? err.message : 'Failed to decode share code.', 'error');
    }
  }
}

function encodeFromCommands() {
  const text = commandsInput.value.trim();
  if (!text) {
    setStatus(crosshairStatus, 'Paste crosshair console commands first.', 'error');
    return;
  }
  try {
    const crosshair = parseCommandsToCrosshair(text);
    sharecodeOutput.value = encodeCrosshair(crosshair);
    updatePreview(crosshair);
    setStatus(crosshairStatus, 'Converted commands to share code.', 'ok');
  } catch (err) {
    setStatus(crosshairStatus, err instanceof Error ? err.message : 'Failed to encode share code.', 'error');
  }
}

/** @param {HTMLElement | null} el @param {string} text @param {string} label */
async function copyText(el, text, label) {
  if (!text) {
    setStatus(el, `Nothing to copy for ${label}.`, 'error');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    setStatus(el, `Copied ${label} to clipboard.`, 'ok');
  } catch {
    setStatus(el, 'Clipboard access failed. Select and copy manually.', 'error');
  }
}

function updateMYawVisibility() {
  const show =
    GAMES[sensFromGame.value]?.supportsMYaw || GAMES[sensToGame.value]?.supportsMYaw;
  mYawFields?.classList.toggle('hidden', !show);

  sourceYawField?.classList.toggle('hidden', !GAMES[sensFromGame.value]?.custom);
  targetYawField?.classList.toggle('hidden', !GAMES[sensToGame.value]?.custom);
}

function updateSensitivity() {
  const sourceSens = Number(sensSource.value);
  const sourceDpi = Number(sensSourceDpi.value);
  const targetDpi = Number(sensTargetDpi.value);
  const sourceMYaw = Number(sensSourceMYaw.value) || 0.022;
  const targetMYaw = Number(sensTargetMYaw.value) || 0.022;
  const sourceCustomYaw = Number(sensSourceYaw.value);
  const targetCustomYaw = Number(sensTargetYaw.value);

  updateMYawVisibility();

  if (GAMES[sensFromGame.value]?.custom && !(sourceCustomYaw > 0)) {
    setStatus(sensitivityStatus, 'Enter a valid source custom yaw (° per count).', 'error');
    return;
  }
  if (GAMES[sensToGame.value]?.custom && !(targetCustomYaw > 0)) {
    setStatus(sensitivityStatus, 'Enter a valid target custom yaw (° per count).', 'error');
    return;
  }

  if (!Number.isFinite(sourceSens) || sourceSens <= 0) {
    sensTarget.value = '';
    sensCm360.textContent = '—';
    sensStats.innerHTML = '';
    sensFormula.textContent = '';
    return;
  }

  if (!Number.isFinite(sourceDpi) || sourceDpi <= 0 || !Number.isFinite(targetDpi) || targetDpi <= 0) {
    setStatus(sensitivityStatus, 'Enter valid DPI values.', 'error');
    return;
  }

  const result = convertSensitivity({
    sourceGame: sensFromGame.value,
    targetGame: sensToGame.value,
    sourceSens,
    sourceDpi,
    targetDpi,
    sourceMYaw,
    targetMYaw,
    sourceCustomYaw,
    targetCustomYaw,
  });

  const fromName = GAMES[sensFromGame.value].name;
  const toName = GAMES[sensToGame.value].name;
  const formatted = formatSens(result.targetSensitivity);

  sensTarget.value = formatted;
  sensCm360.textContent = formatDistance(result.cm360);
  sensStats.innerHTML = `
    <div><dt>Inches / 360°</dt><dd>${formatDistance(result.inches360)} in</dd></div>
    <div><dt>Source eDPI</dt><dd>${formatDistance(result.sourceEdpi, 0)}</dd></div>
    <div><dt>Target eDPI</dt><dd>${formatDistance(result.targetEdpi, 0)}</dd></div>
    <div><dt>Source yaw</dt><dd>${result.sourceYaw}</dd></div>
    <div><dt>Target yaw</dt><dd>${result.targetYaw}</dd></div>
    <div><dt>Multiplier</dt><dd>× ${formatSens(result.ratio, 5)}</dd></div>
  `;
  sensFormula.innerHTML = `
    <strong>Formula:</strong>
    target = source × (source DPI ÷ target DPI) × (source yaw ÷ target yaw)<br />
    ${formatted} = ${sourceSens} × (${sourceDpi} ÷ ${targetDpi}) × (${result.sourceYaw} ÷ ${result.targetYaw})
  `;
  setStatus(sensitivityStatus, `${fromName} → ${toName}: ${formatted}`, 'ok');
}

function swapSensitivityGames() {
  const from = sensFromGame.value;
  sensFromGame.value = sensToGame.value;
  sensToGame.value = from;

  if (sensTarget.value) {
    sensSource.value = sensTarget.value;
  }

  updateSensitivity();
}

function loadCs2ValorantExample() {
  sensFromGame.value = 'cs2';
  sensToGame.value = 'valorant';
  sensSource.value = '1.25';
  sensSourceDpi.value = '800';
  sensTargetDpi.value = '800';
  updateSensitivity();
}

document.querySelectorAll('.tool-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const tool = tab.getAttribute('data-tool');
    document.querySelectorAll('.tool-tab').forEach((t) => {
      const active = t.getAttribute('data-tool') === tool;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.tool-view').forEach((view) => {
      view.classList.toggle('active', view.id === `${tool}-tool`);
    });
  });
});

document.querySelectorAll('.converter-panel .tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const id = tab.getAttribute('data-tab');
    document.querySelectorAll('.converter-panel .tab').forEach((t) => {
      const active = t.getAttribute('data-tab') === id;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.converter-panel .tab-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.getAttribute('data-panel') === id);
    });
  });
});

document.querySelector('#decode-btn')?.addEventListener('click', decodeFromCode);
document.querySelector('#encode-btn')?.addEventListener('click', encodeFromCommands);
sharecodeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') decodeFromCode();
});

commandsInput.addEventListener('input', () => {
  const text = commandsInput.value.trim();
  if (!text) {
    renderCrosshairPreview(canvas, null);
    previewStats.innerHTML = '';
    return;
  }
  try {
    updatePreview(parseCommandsToCrosshair(text));
  } catch {
    /* keep last preview */
  }
});

sharecodeInput.addEventListener('input', () => {
  const code = normalizeShareCode(sharecodeInput.value);
  if (!SHARECODE_RE.test(code)) return;
  try {
    updatePreview(decodeCrosshairShareCode(code));
  } catch {
    /* ignore partial codes */
  }
});

document.querySelector('#copy-commands')?.addEventListener('click', () => {
  copyText(crosshairStatus, commandsOutput.value, 'commands');
});
document.querySelector('#copy-code')?.addEventListener('click', () => {
  copyText(crosshairStatus, sharecodeOutput.value, 'share code');
});
document.querySelector('#copy-sharecode-cmd')?.addEventListener('click', () => {
  const code = normalizeShareCode(sharecodeInput.value);
  if (!code) {
    setStatus(crosshairStatus, 'Enter a share code first.', 'error');
    return;
  }
  copyText(crosshairStatus, `cl_crosshair_sharecode "${code}"`, 'import command');
});
document.querySelector('#load-example-code')?.addEventListener('click', () => {
  sharecodeInput.value = EXAMPLE_CODE;
  decodeFromCode();
});
document.querySelector('#load-example-cmd')?.addEventListener('click', () => {
  commandsInput.value = EXAMPLE_COMMANDS;
  encodeFromCommands();
});

// --- Visual crosshair editor ---
const EDITOR_PRESET_COLORS = {
  0: [255, 255, 255],
  1: [50, 250, 50],
  2: [255, 255, 0],
  3: [50, 50, 250],
  4: [50, 250, 250],
};

const editor = { ...DEFAULT_CROSSHAIR };

const edStyle = /** @type {HTMLSelectElement} */ (document.querySelector('#ed-style'));
const edColor = /** @type {HTMLSelectElement} */ (document.querySelector('#ed-color'));
const edCustomColor = /** @type {HTMLInputElement} */ (document.querySelector('#ed-custom-color'));
const edCustomColorField = document.querySelector('#ed-custom-color-field');
const edLength = /** @type {HTMLInputElement} */ (document.querySelector('#ed-length'));
const edThickness = /** @type {HTMLInputElement} */ (document.querySelector('#ed-thickness'));
const edGap = /** @type {HTMLInputElement} */ (document.querySelector('#ed-gap'));
const edOutline = /** @type {HTMLInputElement} */ (document.querySelector('#ed-outline'));
const edAlpha = /** @type {HTMLInputElement} */ (document.querySelector('#ed-alpha'));
const edDot = /** @type {HTMLInputElement} */ (document.querySelector('#ed-dot'));
const edTStyle = /** @type {HTMLInputElement} */ (document.querySelector('#ed-tstyle'));
const edOutlineOn = /** @type {HTMLInputElement} */ (document.querySelector('#ed-outline-on'));
const edAlphaOn = /** @type {HTMLInputElement} */ (document.querySelector('#ed-alpha-on'));
const edSharecode = /** @type {HTMLInputElement} */ (document.querySelector('#ed-sharecode'));
const edCommands = /** @type {HTMLTextAreaElement} */ (document.querySelector('#ed-commands'));
const edLengthVal = document.querySelector('#ed-length-val');
const edThicknessVal = document.querySelector('#ed-thickness-val');
const edGapVal = document.querySelector('#ed-gap-val');
const edOutlineVal = document.querySelector('#ed-outline-val');
const edAlphaVal = document.querySelector('#ed-alpha-val');

/** @param {number} r @param {number} g @param {number} b */
function rgbToHex(r, g, b) {
  const to2 = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

/** @param {string} hex */
function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) return { r: editor.red, g: editor.green, b: editor.blue };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

/** Push the current editor state onto every control (used on init / reset). */
function applyStateToControls() {
  edStyle.value = String(editor.style);
  edColor.value = String(editor.color);
  edCustomColor.value = rgbToHex(editor.red, editor.green, editor.blue);
  edLength.value = String(editor.length);
  edThickness.value = String(editor.thickness);
  edGap.value = String(editor.gap);
  edOutline.value = String(editor.outline);
  edAlpha.value = String(editor.alpha);
  edDot.checked = editor.centerDotEnabled;
  edTStyle.checked = editor.tStyleEnabled;
  edOutlineOn.checked = editor.outlineEnabled;
  edAlphaOn.checked = editor.alphaEnabled;
}

/** Update the editor's own outputs (badges, code, commands) without touching the shared preview. */
function renderEditorOutputs() {
  edLengthVal.textContent = String(editor.length);
  edThicknessVal.textContent = String(editor.thickness);
  edGapVal.textContent = String(editor.gap);
  edOutlineVal.textContent = String(editor.outline);
  edAlphaVal.textContent = String(editor.alpha);

  edCustomColorField?.classList.toggle('hidden', editor.color !== 5);
  edOutline.disabled = !editor.outlineEnabled;
  edAlpha.disabled = !editor.alphaEnabled;

  try {
    edSharecode.value = encodeCrosshair(editor);
  } catch {
    edSharecode.value = '';
  }
  edCommands.value = formatCommands(crosshairToConVars(editor));
}

/** Render the shared preview + the editor outputs. */
function renderEditor() {
  updatePreview(editor);
  renderEditorOutputs();
}

/** Read every control into the editor state, then re-render. */
function readEditorControls() {
  editor.style = Number(edStyle.value);
  editor.length = Number(edLength.value);
  editor.thickness = Number(edThickness.value);
  editor.gap = Number(edGap.value);
  editor.outline = Number(edOutline.value);
  editor.alpha = Number(edAlpha.value);
  editor.centerDotEnabled = edDot.checked;
  editor.tStyleEnabled = edTStyle.checked;
  editor.outlineEnabled = edOutlineOn.checked;
  editor.alphaEnabled = edAlphaOn.checked;
  editor.color = Number(edColor.value);

  if (editor.color === 5) {
    const { r, g, b } = hexToRgb(edCustomColor.value);
    editor.red = r;
    editor.green = g;
    editor.blue = b;
    edCustomColor.value = rgbToHex(r, g, b);
  } else {
    const [r, g, b] = EDITOR_PRESET_COLORS[editor.color] ?? EDITOR_PRESET_COLORS[1];
    editor.red = r;
    editor.green = g;
    editor.blue = b;
    edCustomColor.value = rgbToHex(r, g, b);
  }

  renderEditor();
}

[edStyle, edColor, edCustomColor, edLength, edThickness, edGap, edOutline, edAlpha, edDot, edTStyle, edOutlineOn, edAlphaOn].forEach(
  (el) => {
    el.addEventListener('input', readEditorControls);
    el.addEventListener('change', readEditorControls);
  }
);

document.querySelector('#ed-copy-code')?.addEventListener('click', () => {
  copyText(crosshairStatus, edSharecode.value, 'share code');
});
document.querySelector('#ed-copy-commands')?.addEventListener('click', () => {
  copyText(crosshairStatus, edCommands.value, 'commands');
});
document.querySelector('#ed-reset')?.addEventListener('click', () => {
  Object.assign(editor, DEFAULT_CROSSHAIR);
  applyStateToControls();
  renderEditor();
  setStatus(crosshairStatus, 'Crosshair reset to defaults.', 'ok');
});

// Re-render the shared preview from the editor whenever its tab is opened.
document.querySelector('.converter-panel .tab[data-tab="visual"]')?.addEventListener('click', renderEditor);

applyStateToControls();
renderEditorOutputs();

sensFromGame.innerHTML = gameOptionsHtml('cs2');
sensToGame.innerHTML = gameOptionsHtml('valorant');

[sensFromGame, sensToGame, sensSource, sensSourceDpi, sensTargetDpi, sensSourceMYaw, sensTargetMYaw, sensSourceYaw, sensTargetYaw].forEach((el) => {
  el.addEventListener('input', updateSensitivity);
  el.addEventListener('change', updateSensitivity);
});

document.querySelector('#sens-swap')?.addEventListener('click', swapSensitivityGames);
document.querySelector('#copy-sens')?.addEventListener('click', () => {
  copyText(sensitivityStatus, sensTarget.value, 'converted sensitivity');
});
document.querySelector('#sens-cs2-val')?.addEventListener('click', loadCs2ValorantExample);

renderCrosshairPreview(canvas, null);
decodeFromCode();
loadCs2ValorantExample();
