// Helpers for "Try in game": practice CFG + Steam launch URL for a CS2 map guide.

import { radarToWorld } from './mapRadar.js';
import { randomUUID } from 'node:crypto';

const DE_MAP = {
  mirage: 'de_mirage',
  dust2: 'de_dust2',
  inferno: 'de_inferno',
  nuke: 'de_nuke',
  ancient: 'de_ancient',
  anubis: 'de_anubis',
  overpass: 'de_overpass',
  vertigo: 'de_vertigo',
  train: 'de_train',
};

export function deMapName(mapId) {
  return DE_MAP[mapId] || null;
}

/** Stable local annotation name (no extension). */
export function guideLoadName(mapId, importId) {
  const map = String(mapId || 'map').replace(/[^a-z0-9]/gi, '') || 'map';
  if (importId) return `aimkit_${map}_${importId}`;
  return `aimkit_${map}`;
}

export function buildPracticeCfg({ loadName }) {
  const name = String(loadName || '').trim();
  if (!name) throw new Error('Missing annotation load name for practice CFG.');
  return [
    '// AimKit — private practice with Map Guide annotations',
    '// Put this file in: game/csgo/cfg/',
    '// Annotation file must be at: game/csgo/annotations/local/<name>/<name>.txt',
    'sv_cheats 1',
    // March 2026 "Guns, Guides, and Games" replaced sv_allow_annotations with
    // access levels: 0=off, 1=view, 2=edit/load custom local guides.
    'sv_allow_annotations_access_level 2',
    'sv_annotation_limits_max_rounds_per_half -1',
    'sv_infinite_ammo 2',
    'sv_grenade_trajectory_prac_trailtime 8',
    'sv_grenade_trajectory_prac_pipreview 1',
    'mp_roundtime_defuse 60',
    'mp_freezetime 0',
    'mp_buy_anywhere 1',
    'mp_maxmoney 60000',
    'mp_startmoney 60000',
    'bot_kick',
    `annotation_load ${name}`,
    '',
  ].join('\n');
}

/**
 * Steam protocol URL that boots CS2 onto a private listen map, then execs our cfg.
 * The annotation .txt must already be under game/csgo/annotations/local/<name>/.
 *
 * Args MUST be URL-encoded: browsers / xdg-open truncate at the first space, so an
 * unencoded `+map de_mirage` becomes just `+sv_lan` (or nothing) and CS2 opens to
 * the main menu with no local server.
 */
export function buildSteamPracticeUrl(mapId, cfgBaseName = 'aimkit_practice') {
  const de = deMapName(mapId);
  if (!de) return null;
  // Keep under Steam's ~128-byte decoded param buffer. Map first so a listen
  // server always starts even if later tokens are dropped.
  const args = `+map ${de} +sv_lan 1 +game_type 0 +game_mode 0 +exec ${cfgBaseName}`;
  const encoded = args
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => encodeURIComponent(token))
    .join('%20');
  return `steam://rungameid/730//${encoded}`;
}

/** In-game console fallback when Steam launch options are ignored (CS2 already open). */
export function buildPracticeConsoleCommand(mapId, cfgBaseName = 'aimkit_practice') {
  const de = deMapName(mapId);
  if (!de) return null;
  // Set access level before exec so even an older downloaded CFG can still load guides.
  return `map ${de}; sv_cheats 1; sv_allow_annotations_access_level 2; exec ${cfgBaseName}`;
}

/** Relative paths under game/csgo/ for writing via the File System Access API. */
export function practiceFilePaths(loadName, cfgBaseName = 'aimkit_practice') {
  return {
    guideRel: `annotations/local/${loadName}/${loadName}.txt`,
    guideFlatRel: `annotations/local/${loadName}.txt`,
    cfgRel: `cfg/${cfgBaseName}.cfg`,
    loadName,
    cfgBaseName,
  };
}

function kv3Escape(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\n');
}

function mapGrenadeTypeOut(type) {
  const t = String(type || 'smoke').toLowerCase();
  if (t === 'molotov') return 'molotov';
  if (['smoke', 'flash', 'he', 'decoy', 'incendiary'].includes(t)) return t;
  return 'smoke';
}

/**
 * Rebuild a CS2 annotation KV3 file from AimKit nade drafts (radar 0..1 → world).
 * Approximate (Z lost) but enough for Try in game markers.
 */
export function buildGuideTextFromNades(mapId, nades) {
  const de = deMapName(mapId);
  if (!de) throw new Error('Unknown map.');
  const list = Array.isArray(nades) ? nades : [];
  if (!list.length) throw new Error('No nades to open in CS2.');

  const lines = [
    '<!-- kv3 encoding:text:version{e21c7f3c-8a33-41c5-9977-a76d3a32aa0d} format:generic:version{7412167c-06e9-4698-aff2-e63eb59037e7} -->',
    '{',
    `\tMapName = "${de}"`,
    '\tScreenText =',
    '\t{',
    '\t}',
  ];

  let nodeIdx = 0;
  for (const nade of list) {
    if (!nade?.start || !nade?.end) continue;
    const start = radarToWorld(mapId, nade.start.x, nade.start.y, 0);
    const end = radarToWorld(mapId, nade.end.x, nade.end.y, 0);
    if (!start || !end) continue;

    const mainId = randomUUID();
    const aimId = randomUUID();
    const destId = randomUUID();
    const title = kv3Escape(nade.title || `AimKit lineup ${nodeIdx + 1}`);
    const desc = kv3Escape(nade.description || '');
    const jump = nade.technique === 'jumpthrow' || nade.technique === 'jump' || nade.technique === 'runjump';
    const gType = mapGrenadeTypeOut(nade.type);

    const emitNode = (key, body) => {
      lines.push(`\t${key} =`);
      lines.push('\t{');
      for (const line of body) lines.push(`\t\t${line}`);
      lines.push('\t}');
    };

    emitNode(`MapAnnotationNode${nodeIdx++}`, [
      'Enabled = true',
      'Type = "grenade"',
      `Id = "${mainId}"`,
      'SubType = "main"',
      `Position = [ ${start.x.toFixed(6)}, ${start.y.toFixed(6)}, ${start.z.toFixed(6)} ]`,
      'Angles = [ 0.0, 0.0, 0.0 ]',
      'VisiblePfx = true',
      'TextFacePlayer = true',
      'Title =',
      '{',
      `\tText = "${title}"`,
      '\tFontSize = 125',
      '\tFadeInDist = 600.0',
      '\tFadeOutDist = 40.0',
      '}',
      'Desc =',
      '{',
      `\tText = "${desc}"`,
      '\tFontSize = 75',
      '\tFadeInDist = 300.0',
      '\tFadeOutDist = 40.0',
      '}',
      `JumpThrow = ${jump ? 'true' : 'false'}`,
      `GrenadeType = "${gType}"`,
    ]);

    const aim = {
      x: start.x + (end.x - start.x) * 0.15,
      y: start.y + (end.y - start.y) * 0.15,
      z: start.z + 80,
    };
    emitNode(`MapAnnotationNode${nodeIdx++}`, [
      'Enabled = true',
      'Type = "grenade"',
      `Id = "${aimId}"`,
      'SubType = "aim_target"',
      `Position = [ ${aim.x.toFixed(6)}, ${aim.y.toFixed(6)}, ${aim.z.toFixed(6)} ]`,
      'Angles = [ 0.0, 0.0, 0.0 ]',
      'VisiblePfx = true',
      'TextFacePlayer = false',
      'Title =',
      '{',
      `\tText = "${title}"`,
      '\tFontSize = 125',
      '\tFadeInDist = 50.0',
      '\tFadeOutDist = -1.0',
      '}',
      'Desc =',
      '{',
      `\tText = "${desc}"`,
      '\tFontSize = 75',
      '\tFadeInDist = 50.0',
      '\tFadeOutDist = -1.0',
      '}',
      `MasterNodeId = "${mainId}"`,
    ]);

    emitNode(`MapAnnotationNode${nodeIdx++}`, [
      'Enabled = true',
      'Type = "grenade"',
      `Id = "${destId}"`,
      'SubType = "destination"',
      `Position = [ ${end.x.toFixed(6)}, ${end.y.toFixed(6)}, ${end.z.toFixed(6)} ]`,
      'Angles = [ 0.0, 0.0, 0.0 ]',
      'VisiblePfx = true',
      'TextFacePlayer = false',
      'Title =',
      '{',
      '\tText = ""',
      '\tFontSize = 75',
      '\tFadeInDist = 50.0',
      '\tFadeOutDist = -1.0',
      '}',
      'Desc =',
      '{',
      '\tText = ""',
      '\tFontSize = 75',
      '\tFadeInDist = 50.0',
      '\tFadeOutDist = -1.0',
      '}',
      `MasterNodeId = "${mainId}"`,
      'DistanceThreshold = 80.0',
    ]);
  }

  if (nodeIdx === 0) throw new Error('No valid nade positions to open in CS2.');
  lines.push('}');
  return `${lines.join('\n')}\n`;
}

export function buildPracticePack({ mapId, guideText, importId = null, loadName: loadNameOverride = null }) {
  const de = deMapName(mapId);
  if (!de) throw new Error('Unknown map for practice launch.');
  const text = String(guideText || '').trim();
  if (!text) throw new Error('No map guide text to open in CS2.');

  const loadName = loadNameOverride || guideLoadName(mapId, importId);
  const cfgBaseName = 'aimkit_practice';
  const paths = practiceFilePaths(loadName, cfgBaseName);
  const cfgText = buildPracticeCfg({ loadName });
  const steamUrl = buildSteamPracticeUrl(mapId, cfgBaseName);
  const consoleCommand = buildPracticeConsoleCommand(mapId, cfgBaseName);

  return {
    map: mapId,
    deMap: de,
    loadName,
    cfgBaseName,
    guideText: text,
    cfgText,
    steamUrl,
    consoleCommand,
    paths,
    steps: [
      `Copy the guide to game/csgo/${paths.guideRel}`,
      `Copy the CFG to game/csgo/${paths.cfgRel}`,
      'Click Open CS2 (private practice server loads the map + annotations).',
    ],
  };
}

export function buildPracticePackFromNades(mapId, nades, { loadName } = {}) {
  const guideText = buildGuideTextFromNades(mapId, nades);
  return buildPracticePack({
    mapId,
    guideText,
    loadName: loadName || guideLoadName(mapId, `browse_${nades.length}`),
  });
}
