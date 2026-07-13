// Parse CS2 Map Guide / annotation .txt files (Valve KV3) into nade drafts.
// Format: MapName + MapAnnotationNodeN blocks with grenade main/aim_target/destination.

import { mapIdFromGuideName, worldToRadar } from './mapRadar.js';
import { TYPE_IDS } from './meta.js';

const MAX_IMPORT = 80;

function stripComments(text) {
  // Remove <!-- ... --> headers and // line comments (not inside strings — fine for these files).
  return String(text || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

/** Minimal KV3 object parser for annotation files (dict / array / scalar). */
function parseKv3(text) {
  const src = stripComments(text);
  let i = 0;
  const n = src.length;

  function skipWs() {
    while (i < n && /\s/.test(src[i])) i += 1;
  }

  function parseString() {
    const quote = src[i];
    i += 1;
    let out = '';
    while (i < n) {
      const c = src[i];
      if (c === '\\' && i + 1 < n) {
        out += src[i + 1];
        i += 2;
        continue;
      }
      if (c === quote) {
        i += 1;
        return out;
      }
      out += c;
      i += 1;
    }
    throw new Error('Unterminated string in map guide.');
  }

  function parseNumberOrBoolOrNull() {
    const start = i;
    while (i < n && /[^\s,{}\[\]=]/.test(src[i])) i += 1;
    const tok = src.slice(start, i);
    if (tok === 'true') return true;
    if (tok === 'false') return false;
    if (tok === 'null') return null;
    const num = Number(tok);
    if (!Number.isFinite(num)) throw new Error(`Unexpected token "${tok}" in map guide.`);
    return num;
  }

  function parseValue() {
    skipWs();
    if (i >= n) throw new Error('Unexpected end of map guide.');
    const c = src[i];
    if (c === '"' || c === "'") return parseString();
    if (c === '{') return parseObject();
    if (c === '[') return parseArray();
    return parseNumberOrBoolOrNull();
  }

  function parseArray() {
    i += 1; // [
    const arr = [];
    skipWs();
    while (i < n && src[i] !== ']') {
      arr.push(parseValue());
      skipWs();
      if (src[i] === ',') {
        i += 1;
        skipWs();
      }
    }
    if (src[i] !== ']') throw new Error('Unterminated array in map guide.');
    i += 1;
    return arr;
  }

  function parseKey() {
    skipWs();
    if (src[i] === '"' || src[i] === "'") return parseString();
    const start = i;
    while (i < n && /[A-Za-z0-9_]/.test(src[i])) i += 1;
    if (start === i) throw new Error('Expected key in map guide.');
    return src.slice(start, i);
  }

  function parseObject() {
    i += 1; // {
    const obj = {};
    skipWs();
    while (i < n && src[i] !== '}') {
      const key = parseKey();
      skipWs();
      if (src[i] === '=') i += 1;
      else if (src[i] === ':') i += 1; // tolerate JSON-ish
      else throw new Error(`Expected = after key "${key}".`);
      obj[key] = parseValue();
      skipWs();
      if (src[i] === ',') {
        i += 1;
        skipWs();
      }
    }
    if (src[i] !== '}') throw new Error('Unterminated object in map guide.');
    i += 1;
    return obj;
  }

  skipWs();
  if (src[i] !== '{') throw new Error('Map guide must start with a { … } root object (KV3).');
  const root = parseObject();
  return root;
}

function textOf(field) {
  if (!field) return '';
  if (typeof field === 'string') return field.trim();
  if (typeof field === 'object' && field.Text != null) return String(field.Text).trim();
  return '';
}

function mapGrenadeType(raw) {
  const t = String(raw || 'smoke').toLowerCase();
  if (t === 'incendiary' || t === 'fire' || t === 'molly') return 'molotov';
  if (TYPE_IDS.includes(t)) return t;
  return 'smoke';
}

function techniqueFromNode(main) {
  if (main && main.JumpThrow === true) return 'jumpthrow';
  return 'stand';
}

function positionXY(node) {
  const p = node?.Position;
  if (!Array.isArray(p) || p.length < 2) return null;
  return { x: Number(p[0]), y: Number(p[1]), z: Number(p[2] ?? 0) };
}

/**
 * Parse a CS2 annotation/map-guide text file into nade drafts ready for create.
 * @returns {{ map: string, mapName: string, nades: object[], skipped: number }}
 */
export function parseMapGuide(text) {
  if (!text || !String(text).trim()) {
    throw new Error('Paste or upload a CS2 map guide (.txt) file.');
  }
  let root;
  try {
    root = parseKv3(text);
  } catch (err) {
    throw new Error(err.message || 'Could not parse map guide file.');
  }

  const mapName = root.MapName || root.mapName || '';
  const map = mapIdFromGuideName(mapName);
  if (!map) {
    throw new Error(
      mapName
        ? `Unsupported map "${mapName}". AimKit supports the active-duty maps listed in Nades.`
        : 'Map guide is missing MapName (e.g. "de_mirage").',
    );
  }

  /** Collect MapAnnotationNode* entries (and tolerate an Annotations array). */
  const nodes = [];
  for (const [key, value] of Object.entries(root)) {
    if (/^MapAnnotationNode\d+$/i.test(key) && value && typeof value === 'object') {
      nodes.push(value);
    }
  }
  if (Array.isArray(root.Annotations)) {
    for (const value of root.Annotations) {
      if (value && typeof value === 'object') nodes.push(value);
    }
  }
  if (Array.isArray(root.nodes)) {
    for (const value of root.nodes) {
      if (value && typeof value === 'object') nodes.push(value);
    }
  }

  const byId = new Map();
  for (const node of nodes) {
    if (node.Id) byId.set(String(node.Id), node);
  }

  const mains = nodes.filter((n) => n.Type === 'grenade' && (n.SubType === 'main' || !n.SubType));
  const childrenOf = (masterId) =>
    nodes.filter((n) => n.Type === 'grenade' && String(n.MasterNodeId || '') === String(masterId));

  const nades = [];
  let skipped = 0;

  for (const main of mains) {
    if (nades.length >= MAX_IMPORT) {
      skipped += 1;
      continue;
    }
    const kids = childrenOf(main.Id);
    const dest = kids.find((n) => n.SubType === 'destination') || null;
    const aim = kids.find((n) => n.SubType === 'aim_target') || null;

    const startWorld = positionXY(main);
    const endWorld = positionXY(dest) || positionXY(aim);
    if (!startWorld || !endWorld) {
      skipped += 1;
      continue;
    }

    const start = worldToRadar(map, startWorld.x, startWorld.y);
    const end = worldToRadar(map, endWorld.x, endWorld.y);
    if (!start || !end) {
      skipped += 1;
      continue;
    }

    const title =
      textOf(main.Title) ||
      textOf(aim?.Title) ||
      textOf(dest?.Title) ||
      `Imported lineup ${nades.length + 1}`;
    const descParts = [textOf(main.Desc), textOf(aim?.Desc)].filter(Boolean);
    const description = descParts.join('\n');

    nades.push({
      map,
      type: mapGrenadeType(main.GrenadeType),
      technique: techniqueFromNode(main),
      title: title.slice(0, 160),
      description: description.slice(0, 4000),
      start,
      end,
      sourceNodeId: main.Id || null,
    });
  }

  if (!nades.length) {
    throw new Error(
      mains.length
        ? 'Found grenade nodes but none had usable throw/landing positions.'
        : 'No grenade lineups found in this map guide (looking for Type = "grenade").',
    );
  }

  return { map, mapName: String(mapName), nades, skipped, totalNodes: nodes.length };
}

export { MAX_IMPORT };
