// Allowed values for nade metadata, mirrored on the frontend. Used for validation.

export const MAP_IDS = ['mirage', 'dust2', 'inferno', 'nuke', 'ancient', 'anubis', 'overpass', 'vertigo', 'train'];
export const TYPE_IDS = ['smoke', 'flash', 'molotov', 'he', 'decoy'];
export const TECHNIQUE_IDS = ['stand', 'jump', 'jumpthrow', 'run', 'runjump', 'walk'];
export const SIDE_IDS = ['t', 'ct'];

export function detectMediaKind(url) {
  const u = (url || '').toLowerCase();
  if (/youtube\.com|youtu\.be|\.mp4|\.webm|\.mov|streamable\.com/.test(u)) return 'video';
  return 'image';
}
