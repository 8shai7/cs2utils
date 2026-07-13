// CS2 radar overview transforms: world (x,y) → normalized 0..1 radar coords.
// Values from Valve resource/overviews/de_*.txt (SteamDatabase GameTracking-CS2).
// Our bundled radar PNGs are 1024×1024; scale is world-units per radar pixel.

export const RADAR_SIZE = 1024;

/** @type {Record<string, { posX: number, posY: number, scale: number }>} */
export const MAP_RADAR = {
  mirage: { posX: -3230, posY: 1713, scale: 5 },
  dust2: { posX: -2476, posY: 3239, scale: 4.4 },
  inferno: { posX: -2087, posY: 3870, scale: 4.9 },
  nuke: { posX: -3453, posY: 2887, scale: 7 },
  ancient: { posX: -2953, posY: 2164, scale: 5 },
  anubis: { posX: -2796, posY: 3328, scale: 5.22 },
  overpass: { posX: -4831, posY: 1781, scale: 5.2 },
  vertigo: { posX: -3168, posY: 1762, scale: 4 },
  train: { posX: -2308, posY: 2078, scale: 4.082077 },
};

/** MapName from a guide file (e.g. "de_nuke") → our map id. */
export function mapIdFromGuideName(name) {
  const raw = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/^de_/, '')
    .replace(/_radar$/, '');
  if (raw === 'dust2' || raw === 'dust_2' || raw === 'dustii') return 'dust2';
  if (Object.prototype.hasOwnProperty.call(MAP_RADAR, raw)) return raw;
  return null;
}

/**
 * Convert Source world XY to normalized radar coords (origin top-left, y down).
 * Returns null if the map is unknown.
 */
export function worldToRadar(mapId, worldX, worldY) {
  const meta = MAP_RADAR[mapId];
  if (!meta) return null;
  const x = (Number(worldX) - meta.posX) / meta.scale / RADAR_SIZE;
  const y = (meta.posY - Number(worldY)) / meta.scale / RADAR_SIZE;
  return {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y)),
  };
}

/** Inverse of worldToRadar (Z defaults to 0 — fine for practice markers). */
export function radarToWorld(mapId, normX, normY, z = 0) {
  const meta = MAP_RADAR[mapId];
  if (!meta) return null;
  return {
    x: meta.posX + Number(normX) * RADAR_SIZE * meta.scale,
    y: meta.posY - Number(normY) * RADAR_SIZE * meta.scale,
    z: Number(z) || 0,
  };
}
