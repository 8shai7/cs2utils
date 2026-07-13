// Helpers for "Try in game": practice CFG + Steam launch URL for a CS2 map guide.

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
  return [
    '// AimKit — private practice with Map Guide annotations',
    '// Put this file in: game/csgo/cfg/',
    'sv_cheats 1',
    'sv_allow_annotations 1',
    'sv_infinite_ammo 2',
    'sv_grenade_trajectory_prac_trailtime 8',
    'sv_grenade_trajectory_prac_pipreview 1',
    'mp_roundtime_defuse 60',
    'mp_freezetime 0',
    'mp_buy_anywhere 1',
    'mp_maxmoney 60000',
    'mp_startmoney 60000',
    'bot_kick',
    `annotation_load ${loadName}`,
    '',
  ].join('\n');
}

/**
 * Steam protocol URL that boots CS2 onto a private listen map, then execs our cfg.
 * The annotation .txt must already be under game/csgo/annotations/local/<name>/.
 */
export function buildSteamPracticeUrl(mapId, cfgBaseName = 'aimkit_practice') {
  const de = deMapName(mapId);
  if (!de) return null;
  // Args after "//" are passed to the CS2 client as launch options.
  const args = `+sv_lan 1 +game_type 0 +game_mode 0 +map ${de} +exec ${cfgBaseName}`;
  return `steam://rungameid/730//${args}`;
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

export function buildPracticePack({ mapId, guideText, importId = null }) {
  const de = deMapName(mapId);
  if (!de) throw new Error('Unknown map for practice launch.');
  const text = String(guideText || '').trim();
  if (!text) throw new Error('No map guide text to open in CS2.');

  const loadName = guideLoadName(mapId, importId);
  const cfgBaseName = 'aimkit_practice';
  const paths = practiceFilePaths(loadName, cfgBaseName);
  const cfgText = buildPracticeCfg({ loadName });
  const steamUrl = buildSteamPracticeUrl(mapId, cfgBaseName);

  return {
    map: mapId,
    deMap: de,
    loadName,
    cfgBaseName,
    guideText: text,
    cfgText,
    steamUrl,
    paths,
    steps: [
      `Copy the guide to game/csgo/${paths.guideRel}`,
      `Copy the CFG to game/csgo/${paths.cfgRel}`,
      'Click Open CS2 (private practice server loads the map + annotations).',
    ],
  };
}
