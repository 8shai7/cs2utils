// Helpers for "Try in game": practice CFG + Steam launch URL for a CS2 map guide.

import { radarToWorld } from './mapRadar.js';
import { parseMapGuideLineups } from './parseMapGuide.js';
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

function normTitle(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function fmtWorldNum(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '0.0';
  if (Number.isInteger(v)) return `${v}.0`;
  return String(Number(v.toFixed(6)));
}

function serializeKv3Value(value, indent) {
  const pad = '\t'.repeat(indent);
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return fmtWorldNum(value);
  if (typeof value === 'string') return `"${kv3Escape(value)}"`;
  if (Array.isArray(value)) {
    return `[ ${value.map((v) => serializeKv3Value(v, indent)).join(', ')} ]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (!keys.length) return `{\n${pad}}`;
    const body = keys
      .map((k) => `${pad}\t${k} = ${serializeKv3Value(value[k], indent + 1)}`)
      .join('\n');
    return `{\n${body}\n${pad}}`;
  }
  return `"${kv3Escape(String(value))}"`;
}

/** Write a guide file from exact CS2 annotation node objects (preserves world XYZ). */
export function buildGuideTextFromNodes(mapId, nodeGroups) {
  const de = deMapName(mapId);
  if (!de) throw new Error('Unknown map.');
  const groups = Array.isArray(nodeGroups) ? nodeGroups : [];
  const lines = [
    '<!-- kv3 encoding:text:version{e21c7f3c-8a33-41c5-9977-a76d3a32aa0d} format:generic:version{7412167c-06e9-4698-aff2-e63eb59037e7} -->',
    '{',
    `\tMapName = "${de}"`,
    '\tScreenText =',
    '\t{',
    '\t}',
  ];
  let nodeIdx = 0;
  for (const nodes of groups) {
    for (const node of nodes || []) {
      if (!node || typeof node !== 'object') continue;
      lines.push(`\tMapAnnotationNode${nodeIdx++} = ${serializeKv3Value(node, 1)}`);
    }
  }
  if (nodeIdx === 0) throw new Error('No annotation nodes to open in CS2.');
  lines.push('}');
  return `${lines.join('\n')}\n`;
}

/**
 * Match selected nades to lineups inside an original guide and return their node groups.
 * Matching prefers guide_node_id / sourceNodeId, then title+type, then title.
 */
export function matchNadesToGuideLineups(guideText, nades) {
  const { lineups } = parseMapGuideLineups(guideText);
  const used = new Set();
  const matched = [];
  const unmatched = [];

  for (const nade of nades) {
    const nodeId = nade.guideNodeId || nade.sourceNodeId || nade.guide_node_id || null;
    let hit = null;
    if (nodeId) {
      hit = lineups.find((l) => l.sourceNodeId && String(l.sourceNodeId) === String(nodeId) && !used.has(l.sourceNodeId));
    }
    if (!hit) {
      const title = normTitle(nade.title);
      const type = String(nade.type || '').toLowerCase();
      const byTitle = lineups.filter((l) => !used.has(l.sourceNodeId) && normTitle(l.title) === title);
      hit = byTitle.find((l) => l.type === type) || byTitle[0] || null;
    }
    if (hit) {
      used.add(hit.sourceNodeId);
      matched.push(hit);
    } else {
      unmatched.push(nade);
    }
  }
  return { matched, unmatched };
}

/**
 * Build guide text for selected nades, preferring exact nodes from original imports.
 * @param {string} mapId
 * @param {object[]} nades selected nade drafts
 * @param {Map<number,string>|Record<number,string>} [guidesByImportId] import id → guide_text
 */
export function buildGuideTextForSelectedNades(mapId, nades, guidesByImportId = new Map()) {
  const guideMap =
    guidesByImportId instanceof Map ? guidesByImportId : new Map(Object.entries(guidesByImportId).map(([k, v]) => [Number(k), v]));

  const exactGroups = [];
  const synthesized = [];

  // Group nades that share an import so we can match within each guide once.
  const byImport = new Map();
  for (const nade of nades) {
    const importId = nade.guideImportId || nade.guide_import_id || null;
    if (importId && guideMap.has(Number(importId))) {
      if (!byImport.has(Number(importId))) byImport.set(Number(importId), []);
      byImport.get(Number(importId)).push(nade);
    } else if (nade.startWorld || nade.endWorld) {
      synthesized.push(nade);
    } else {
      synthesized.push(nade);
    }
  }

  for (const [importId, group] of byImport) {
    try {
      const { matched, unmatched } = matchNadesToGuideLineups(guideMap.get(importId), group);
      for (const hit of matched) exactGroups.push(hit.nodes);
      synthesized.push(...unmatched);
    } catch {
      synthesized.push(...group);
    }
  }

  if (exactGroups.length && !synthesized.length) {
    return buildGuideTextFromNodes(mapId, exactGroups);
  }

  // Merge exact nodes + synthesized lineups into one file.
  if (exactGroups.length) {
    const exactText = buildGuideTextFromNodes(mapId, exactGroups);
    if (!synthesized.length) return exactText;
    // Append synthesized by parsing isn't needed — rebuild all via world when mixed.
    // Prefer keeping exact nodes; append synthesized as new nodes.
    const synthText = buildGuideTextFromNades(mapId, synthesized);
    return mergeGuideTexts(mapId, [exactText, synthText]);
  }

  return buildGuideTextFromNades(mapId, synthesized.length ? synthesized : nades);
}

function mergeGuideTexts(mapId, texts) {
  const allNodes = [];
  for (const text of texts) {
    try {
      const { lineups } = parseMapGuideLineups(text);
      for (const l of lineups) allNodes.push(l.nodes);
    } catch {
      // ignore parse failures of intermediate text
    }
  }
  if (!allNodes.length) throw new Error('Could not build practice annotation file.');
  return buildGuideTextFromNodes(mapId, allNodes);
}

/**
 * Rebuild a CS2 annotation KV3 file from AimKit nade drafts.
 * Prefers stored world XYZ (from the original guide); falls back to radar→world.
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
    const start =
      nade.startWorld && Number.isFinite(nade.startWorld.x)
        ? {
            x: Number(nade.startWorld.x),
            y: Number(nade.startWorld.y),
            z: Number(nade.startWorld.z) || 0,
          }
        : nade.start
          ? radarToWorld(mapId, nade.start.x, nade.start.y, nade.start.z || 0)
          : null;
    const end =
      nade.endWorld && Number.isFinite(nade.endWorld.x)
        ? {
            x: Number(nade.endWorld.x),
            y: Number(nade.endWorld.y),
            z: Number(nade.endWorld.z) || 0,
          }
        : nade.end
          ? radarToWorld(mapId, nade.end.x, nade.end.y, nade.end.z || 0)
          : null;
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
      `Position = [ ${fmtWorldNum(start.x)}, ${fmtWorldNum(start.y)}, ${fmtWorldNum(start.z)} ]`,
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

    const aim =
      nade.aimWorld && Number.isFinite(nade.aimWorld.x)
        ? {
            x: Number(nade.aimWorld.x),
            y: Number(nade.aimWorld.y),
            z: Number(nade.aimWorld.z) || 0,
          }
        : {
            x: start.x + (end.x - start.x) * 0.15,
            y: start.y + (end.y - start.y) * 0.15,
            z: start.z + 80,
          };
    emitNode(`MapAnnotationNode${nodeIdx++}`, [
      'Enabled = true',
      'Type = "grenade"',
      `Id = "${aimId}"`,
      'SubType = "aim_target"',
      `Position = [ ${fmtWorldNum(aim.x)}, ${fmtWorldNum(aim.y)}, ${fmtWorldNum(aim.z)} ]`,
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
      `Position = [ ${fmtWorldNum(end.x)}, ${fmtWorldNum(end.y)}, ${fmtWorldNum(end.z)} ]`,
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

export function buildPracticePackFromNades(mapId, nades, { loadName, guidesByImportId } = {}) {
  const guideText = buildGuideTextForSelectedNades(mapId, nades, guidesByImportId || new Map());
  return buildPracticePack({
    mapId,
    guideText,
    loadName: loadName || guideLoadName(mapId, `browse_${nades.length}`),
  });
}
