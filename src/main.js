import {
  decodeCrosshairShareCode,
  encodeCrosshair,
  crosshairToConVars,
  InvalidCrosshairShareCode,
  InvalidShareCode,
} from 'csgo-sharecode';
import { parseCommandsToCrosshair, formatCommands } from './convars.js';
import { renderCrosshairPreview } from './preview.js';
import './style.css';

const SHARECODE_RE = /^CSGO(-[\w]{5}){5}$/i;

/** @type {import('csgo-sharecode').Crosshair | null} */
let currentCrosshair = null;

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="page">
    <header class="hero">
      <div class="hero-badge">Counter-Strike 2</div>
      <h1>Crosshair Converter</h1>
      <p class="hero-sub">
        Turn share codes into console commands, or build a code from your cvars.
        Live preview updates as you type.
      </p>
    </header>

    <main class="layout">
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
            <input
              id="sharecode-input"
              type="text"
              spellcheck="false"
              placeholder="CSGO-UseJt-3oTvn-47wPX-hEyER-WZfiK"
              autocomplete="off"
            />
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
          <p class="hint">
            Paste into the developer console, or use
            <code>cl_crosshair_sharecode "YOUR-CODE"</code> for a one-liner import.
          </p>
        </div>

        <div class="tab-panel" data-panel="cmd-to-code">
          <label class="field">
            <span>Console commands</span>
            <textarea
              id="commands-input"
              rows="14"
              spellcheck="false"
              placeholder="cl_crosshairstyle 4;&#10;cl_crosshairsize 3;&#10;cl_crosshairgap -2;&#10;..."
            ></textarea>
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
          <p class="hint">
            Import in-game via Settings → Game → Crosshair → Share or Import.
          </p>
        </div>

        <div id="status" class="status" role="status" aria-live="polite"></div>
      </section>
    </main>

    <footer class="footer">
      Uses the CS:GO/CS2 share code format. Not affiliated with Valve.
    </footer>
  </div>
`;

const canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#preview-canvas'));
const previewStats = document.querySelector('#preview-stats');
const statusEl = document.querySelector('#status');

const sharecodeInput = /** @type {HTMLInputElement} */ (document.querySelector('#sharecode-input'));
const commandsOutput = /** @type {HTMLTextAreaElement} */ (document.querySelector('#commands-output'));
const commandsInput = /** @type {HTMLTextAreaElement} */ (document.querySelector('#commands-input'));
const sharecodeOutput = /** @type {HTMLInputElement} */ (document.querySelector('#sharecode-output'));

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
 * @param {string} message
 * @param {'ok' | 'error' | ''} kind
 */
function setStatus(message, kind = '') {
  statusEl.textContent = message;
  statusEl.className = `status${kind ? ` ${kind}` : ''}`;
}

/**
 * @param {import('csgo-sharecode').Crosshair} crosshair
 */
function updatePreview(crosshair) {
  currentCrosshair = crosshair;
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

/**
 * @param {string} code
 * @returns {string}
 */
function normalizeShareCode(code) {
  return code.trim().toUpperCase().replace(/\s+/g, '');
}

function decodeFromCode() {
  const raw = sharecodeInput.value.trim();
  if (!raw) {
    setStatus('Paste a crosshair share code first.', 'error');
    return;
  }

  const code = normalizeShareCode(raw);
  if (!SHARECODE_RE.test(code)) {
    setStatus('Invalid format. Expected CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx', 'error');
    return;
  }

  try {
    const crosshair = decodeCrosshairShareCode(code);
    const commands = formatCommands(crosshairToConVars(crosshair));
    sharecodeInput.value = code;
    commandsOutput.value = commands;
    updatePreview(crosshair);
    setStatus('Converted share code to console commands.', 'ok');
  } catch (err) {
    if (err instanceof InvalidCrosshairShareCode || err instanceof InvalidShareCode) {
      setStatus('That share code is not a valid crosshair code.', 'error');
    } else {
      setStatus(err instanceof Error ? err.message : 'Failed to decode share code.', 'error');
    }
  }
}

function encodeFromCommands() {
  const text = commandsInput.value.trim();
  if (!text) {
    setStatus('Paste crosshair console commands first.', 'error');
    return;
  }

  try {
    const crosshair = parseCommandsToCrosshair(text);
    const code = encodeCrosshair(crosshair);
    sharecodeOutput.value = code;
    updatePreview(crosshair);
    setStatus('Converted commands to share code.', 'ok');
  } catch (err) {
    setStatus(err instanceof Error ? err.message : 'Failed to encode share code.', 'error');
  }
}

async function copyText(text, label) {
  if (!text) {
    setStatus(`Nothing to copy for ${label}.`, 'error');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    setStatus(`Copied ${label} to clipboard.`, 'ok');
  } catch {
    setStatus('Clipboard access failed. Select and copy manually.', 'error');
  }
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const id = tab.getAttribute('data-tab');
    document.querySelectorAll('.tab').forEach((t) => {
      const active = t.getAttribute('data-tab') === id;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.tab-panel').forEach((panel) => {
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
    /* keep last good preview while typing */
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
  copyText(commandsOutput.value, 'commands');
});

document.querySelector('#copy-code')?.addEventListener('click', () => {
  copyText(sharecodeOutput.value, 'share code');
});

document.querySelector('#copy-sharecode-cmd')?.addEventListener('click', () => {
  const code = normalizeShareCode(sharecodeInput.value);
  if (!code) {
    setStatus('Enter a share code first.', 'error');
    return;
  }
  copyText(`cl_crosshair_sharecode "${code}"`, 'import command');
});

document.querySelector('#load-example-code')?.addEventListener('click', () => {
  sharecodeInput.value = EXAMPLE_CODE;
  decodeFromCode();
});

document.querySelector('#load-example-cmd')?.addEventListener('click', () => {
  commandsInput.value = EXAMPLE_COMMANDS;
  encodeFromCommands();
});

renderCrosshairPreview(canvas, null);
decodeFromCode();
