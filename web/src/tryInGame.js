// "Try in game" — download map guide + practice CFG, then launch a private
// CS2 practice map via Steam.
//
// Browsers block writing into Program Files (where CS2 usually lives:
// "can't open this folder because it contains system files"), so we never
// ask for the game install folder. Users copy two downloaded files once.

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

export function downloadPracticePack(pack) {
  downloadTextFile(`${pack.loadName}.txt`, pack.guideText);
  setTimeout(() => downloadTextFile(`${pack.cfgBaseName}.cfg`, pack.cfgText), 400);
}

export function openSteamPractice(pack) {
  if (!pack?.steamUrl) throw new Error('Missing Steam launch URL.');
  // Navigate so Steam protocol handler can catch it (popup blockers often block window.open).
  window.location.href = pack.steamUrl;
}

/**
 * Full "Try in game" flow: download files, then open Steam.
 * @returns {Promise<{ mode: 'download', message: string }>}
 */
export async function tryInGame(pack) {
  if (!pack?.guideText || !pack?.steamUrl) {
    throw new Error('Practice pack is incomplete.');
  }

  downloadPracticePack(pack);
  await new Promise((r) => setTimeout(r, 700));
  openSteamPractice(pack);

  return {
    mode: 'download',
    message: `Downloaded ${pack.loadName}.txt + ${pack.cfgBaseName}.cfg. Copy them into your CS2 folders (see steps), then the private ${pack.deMap} server opens.`,
  };
}

export function practicePackModalHtml(pack, { esc }) {
  if (!pack) return '';
  return `
    <div class="try-game-modal" role="dialog" aria-modal="true" aria-label="Try in game">
      <div class="try-game-card">
        <h3>Try in CS2</h3>
        <p class="hint">Opens a <strong>private practice server</strong> on <strong>${esc(
          pack.deMap,
        )}</strong> with this lineup’s annotations.</p>
        <p class="hint">Browsers can’t write into the CS2 install folder (Program Files is blocked), so AimKit downloads two files for you to drop in once:</p>
        <ol class="nade-steps try-game-steps">
          <li>Move <code>${esc(pack.loadName)}.txt</code> to<br />
            <code>…/Counter-Strike Global Offensive/game/csgo/annotations/local/${esc(
              pack.loadName,
            )}/${esc(pack.loadName)}.txt</code>
            <br /><span class="hint">(create the <code>${esc(pack.loadName)}</code> folder if needed)</span>
          </li>
          <li>Move <code>${esc(pack.cfgBaseName)}.cfg</code> to<br />
            <code>…/game/csgo/cfg/${esc(pack.cfgBaseName)}.cfg</code>
          </li>
          <li>Click <strong>Download &amp; open CS2</strong> — Steam loads a private <code>${esc(
            pack.deMap,
          )}</code> server and runs <code>annotation_load ${esc(pack.loadName)}</code>.</li>
        </ol>
        <div class="actions">
          <button class="btn primary" type="button" data-try-game-go>Download &amp; open CS2</button>
          <button class="btn" type="button" data-try-game-download>Download files only</button>
          <button class="btn ghost" type="button" data-try-game-close>Close</button>
        </div>
        <p class="hint" data-try-game-status></p>
      </div>
    </div>`;
}
