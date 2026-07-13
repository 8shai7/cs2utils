// "Try in game" — write map guide + practice CFG into the local CS2 install
// (File System Access API when available), then launch a private practice map via Steam.

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

async function ensureDir(parent, name) {
  return parent.getDirectoryHandle(name, { create: true });
}

async function writeTextFile(dirHandle, fileName, text) {
  const file = await dirHandle.getFileHandle(fileName, { create: true });
  const writable = await file.createWritable();
  await writable.write(text);
  await writable.close();
}

/** Walk/create nested relative path under a directory handle (e.g. annotations/local/name). */
async function ensurePath(root, relDir) {
  const parts = relDir.split('/').filter(Boolean);
  let cur = root;
  for (const part of parts) {
    cur = await ensureDir(cur, part);
  }
  return cur;
}

/**
 * Ask the user to pick their CS2 `game/csgo` folder and write guide + cfg into it.
 * Returns { ok: true } or throws.
 */
export async function writePracticeFilesToCs2(pack) {
  if (typeof window === 'undefined' || typeof window.showDirectoryPicker !== 'function') {
    const err = new Error('Your browser cannot write directly into the CS2 folder.');
    err.code = 'NO_FS_ACCESS';
    throw err;
  }

  const root = await window.showDirectoryPicker({
    id: 'aimkit-cs2-csgo',
    mode: 'readwrite',
    startIn: 'documents',
  });

  // Soft check: prefer a folder that looks like game/csgo.
  let hasCfg = false;
  let hasAnnotations = false;
  for await (const name of root.keys()) {
    if (name === 'cfg') hasCfg = true;
    if (name === 'annotations') hasAnnotations = true;
  }
  if (!hasCfg && !hasAnnotations) {
    const err = new Error(
      'Pick the CS2 folder named "csgo" (…/Counter-Strike Global Offensive/game/csgo).',
    );
    err.code = 'WRONG_FOLDER';
    throw err;
  }

  const guideDirRel = pack.paths.guideRel.split('/').slice(0, -1).join('/');
  const guideName = pack.paths.guideRel.split('/').pop();
  const guideDir = await ensurePath(root, guideDirRel);
  await writeTextFile(guideDir, guideName, pack.guideText);

  // Flat fallback some older clients still resolve.
  const flatParts = pack.paths.guideFlatRel.split('/');
  const flatName = flatParts.pop();
  const flatDir = await ensurePath(root, flatParts.join('/'));
  await writeTextFile(flatDir, flatName, pack.guideText);

  const cfgParts = pack.paths.cfgRel.split('/');
  const cfgName = cfgParts.pop();
  const cfgDir = await ensurePath(root, cfgParts.join('/'));
  await writeTextFile(cfgDir, cfgName, pack.cfgText);

  return { ok: true, rootName: root.name };
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
 * Full "Try in game" flow. Returns a status object for the UI.
 * @returns {Promise<{ mode: 'auto'|'download', message: string }>}
 */
export async function tryInGame(pack) {
  if (!pack?.guideText || !pack?.steamUrl) {
    throw new Error('Practice pack is incomplete.');
  }

  let wrote = false;
  let writeNote = '';
  try {
    await writePracticeFilesToCs2(pack);
    wrote = true;
    writeNote = 'Guide + practice CFG written into your CS2 folder.';
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Folder picker cancelled.');
    }
    downloadPracticePack(pack);
    writeNote =
      err?.code === 'WRONG_FOLDER'
        ? err.message
        : 'Downloaded guide + CFG — place them in your CS2 folders (see steps), then Steam will open.';
  }

  // Give downloads a moment when falling back, then launch Steam.
  await new Promise((r) => setTimeout(r, wrote ? 200 : 700));
  openSteamPractice(pack);

  return {
    mode: wrote ? 'auto' : 'download',
    message: wrote
      ? `${writeNote} Opening a private ${pack.deMap} practice server…`
      : `${writeNote} Opening CS2…`,
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
        )}</strong> and loads this Map Guide’s annotations.</p>
        <ol class="nade-steps try-game-steps">
          <li>When prompted, choose your CS2 <code>game/csgo</code> folder so AimKit can install the guide automatically.</li>
          <li>If your browser can’t write files, download and copy:
            <ul>
              <li><code>${esc(pack.paths.guideRel)}</code></li>
              <li><code>${esc(pack.paths.cfgRel)}</code></li>
            </ul>
          </li>
          <li>Steam launches CS2 → private map → <code>annotation_load ${esc(pack.loadName)}</code>.</li>
        </ol>
        <div class="actions">
          <button class="btn primary" type="button" data-try-game-go>Install &amp; open CS2</button>
          <button class="btn" type="button" data-try-game-download>Download files only</button>
          <button class="btn ghost" type="button" data-try-game-close>Close</button>
        </div>
        <p class="hint" data-try-game-status></p>
      </div>
    </div>`;
}
