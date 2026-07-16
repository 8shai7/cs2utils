// "Try in game" — optional downloads + Steam launch for a private CS2 practice map.
// Browsers block writing into Program Files, so users copy downloaded files themselves.

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * @param {object} pack
 * @param {{ guide?: boolean, cfg?: boolean }} [opts]
 */
export function downloadPracticePack(pack, opts = {}) {
  const guide = opts.guide !== false;
  const cfg = opts.cfg !== false;
  const downloaded = [];
  if (guide && pack.guideText) {
    downloadTextFile(`${pack.loadName}.txt`, pack.guideText);
    downloaded.push(`${pack.loadName}.txt`);
  }
  if (cfg && pack.cfgText) {
    const delay = downloaded.length ? 400 : 0;
    setTimeout(() => downloadTextFile(`${pack.cfgBaseName}.cfg`, pack.cfgText), delay);
    downloaded.push(`${pack.cfgBaseName}.cfg`);
  }
  return downloaded;
}

export function openSteamPractice(pack) {
  if (!pack?.steamUrl) throw new Error('Missing Steam launch URL.');
  // Prefer a temporary <a> click — more reliable for steam:// than location.href,
  // and keeps the AimKit tab in place.
  const a = document.createElement('a');
  a.href = pack.steamUrl;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function copyPracticeConsoleCommand(pack) {
  const cmd = pack?.consoleCommand;
  if (!cmd) throw new Error('Missing console command.');
  await navigator.clipboard.writeText(cmd);
  return cmd;
}

export function readDownloadOptions(root) {
  const guide = root?.querySelector('#try-dl-guide')?.checked !== false;
  const cfg = root?.querySelector('#try-dl-cfg')?.checked !== false;
  // If checkboxes missing (shouldn't), default to both.
  if (!root?.querySelector('#try-dl-guide') && !root?.querySelector('#try-dl-cfg')) {
    return { guide: true, cfg: true };
  }
  return {
    guide: !!root.querySelector('#try-dl-guide')?.checked,
    cfg: !!root.querySelector('#try-dl-cfg')?.checked,
  };
}

export function practicePackModalHtml(pack, { esc, lineupCount = 1 }) {
  if (!pack) return '';
  const countLabel =
    lineupCount > 1
      ? `${lineupCount} lineups merged into one annotation file`
      : '1 lineup annotation file';
  const guidePath = `game/csgo/annotations/local/${pack.loadName}/${pack.loadName}.txt`;
  const cfgPath = `game/csgo/cfg/${pack.cfgBaseName}.cfg`;
  return `
    <div class="try-game-modal" role="dialog" aria-modal="true" aria-label="Try in game">
      <div class="try-game-card">
        <header class="try-game-head">
          <h3>Try in CS2</h3>
          <p class="hint">Private practice on <strong>${esc(pack.deMap)}</strong> — ${esc(
            countLabel,
          )}. Skip downloads if you already have the files in your CS2 folders.</p>
        </header>

        <div class="try-game-choices">
          <label class="try-game-choice" for="try-dl-guide">
            <input type="checkbox" id="try-dl-guide" checked />
            <span class="try-game-choice-body">
              <span class="try-game-choice-title">Annotation file <code>${esc(pack.loadName)}.txt</code></span>
              <span class="try-game-path"><span class="try-game-path-arrow" aria-hidden="true">→</span><code>${esc(
                guidePath,
              )}</code></span>
            </span>
          </label>
          <label class="try-game-choice" for="try-dl-cfg">
            <input type="checkbox" id="try-dl-cfg" checked />
            <span class="try-game-choice-body">
              <span class="try-game-choice-title">Practice CFG <code>${esc(pack.cfgBaseName)}.cfg</code></span>
              <span class="try-game-path"><span class="try-game-path-arrow" aria-hidden="true">→</span><code>${esc(
                cfgPath,
              )}</code></span>
              <span class="hint try-game-choice-note">loads <code>annotation_load ${esc(pack.loadName)}</code></span>
            </span>
          </label>
        </div>

        <ol class="nade-steps try-game-steps">
          <li>Download only what you still need (or nothing if it’s already installed).</li>
          <li>
            Copy the annotation into
            <code>game/csgo/annotations/local/${esc(pack.loadName)}/${esc(pack.loadName)}.txt</code>
            (create the <code>${esc(pack.loadName)}</code> folder — CS2 expects that nested path).
          </li>
          <li>Copy the CFG into <code>game/csgo/cfg/${esc(pack.cfgBaseName)}.cfg</code>.</li>
          <li>
            Click <strong>Open CS2</strong> — Steam starts a private <code>${esc(pack.deMap)}</code> server
            with <code>+exec ${esc(pack.cfgBaseName)}</code>.
          </li>
          <li class="hint">
            If CS2 was already open, quit first, or paste in console (~):
            <code>${esc(pack.consoleCommand || `map ${pack.deMap}; exec ${pack.cfgBaseName}`)}</code>
          </li>
          <li class="hint">
            If markers still don’t show: confirm the nested folder path, then run
            <code>sv_allow_annotations_access_level 2; annotation_load ${esc(pack.loadName)}</code>
          </li>
        </ol>

        <div class="try-game-actions actions">
          <button class="btn" type="button" data-try-game-download>Download selected</button>
          <button class="btn primary" type="button" data-try-game-open>Open CS2</button>
          <button class="btn ghost" type="button" data-try-game-copy-cmd>Copy console cmd</button>
          <button class="btn ghost" type="button" data-try-game-close>Close</button>
        </div>
        <p class="hint try-game-status" data-try-game-status></p>
      </div>
    </div>`;
}
