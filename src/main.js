import {
  decodeCrosshairShareCode,
  encodeCrosshair,
  crosshairToConVars,
  InvalidCrosshairShareCode,
  InvalidShareCode,
} from 'csgo-sharecode';
import { parseCommandsToCrosshair, formatCommands } from './convars.js';
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

    <footer class="footer">Not affiliated with Valve. Share codes and yaw values are community-verified.</footer>
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
}

function updateSensitivity() {
  const sourceSens = Number(sensSource.value);
  const sourceDpi = Number(sensSourceDpi.value);
  const targetDpi = Number(sensTargetDpi.value);
  const sourceMYaw = Number(sensSourceMYaw.value) || 0.022;
  const targetMYaw = Number(sensTargetMYaw.value) || 0.022;

  updateMYawVisibility();

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

sensFromGame.innerHTML = gameOptionsHtml('cs2');
sensToGame.innerHTML = gameOptionsHtml('valorant');

[sensFromGame, sensToGame, sensSource, sensSourceDpi, sensTargetDpi, sensSourceMYaw, sensTargetMYaw].forEach((el) => {
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
