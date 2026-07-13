// Nade metadata + small display helpers shared by the frontend UI and the 2D
// throw renderer. The backend keeps its own copy of the allowed ids for validation.

export const MAPS = [
  { id: 'mirage', name: 'Mirage' },
  { id: 'dust2', name: 'Dust II' },
  { id: 'inferno', name: 'Inferno' },
  { id: 'nuke', name: 'Nuke' },
  { id: 'ancient', name: 'Ancient' },
  { id: 'anubis', name: 'Anubis' },
  { id: 'overpass', name: 'Overpass' },
  { id: 'vertigo', name: 'Vertigo' },
  { id: 'train', name: 'Train' },
];

export const NADE_TYPES = [
  { id: 'smoke', name: 'Smoke', color: '#cdd6e3' },
  { id: 'flash', name: 'Flash', color: '#f4ec9b' },
  { id: 'molotov', name: 'Molotov', color: '#ff7a3c' },
  { id: 'he', name: 'HE Grenade', color: '#8fd694' },
  { id: 'decoy', name: 'Decoy', color: '#9aa8ff' },
];

export const TECHNIQUES = [
  { id: 'stand', name: 'Standing throw' },
  { id: 'jump', name: 'Jump throw' },
  { id: 'jumpthrow', name: 'Jumpthrow bind' },
  { id: 'run', name: 'Running throw' },
  { id: 'runjump', name: 'Run + jump throw' },
  { id: 'walk', name: 'Walking throw' },
];

export const SIDES = [
  { id: 't', name: 'T side' },
  { id: 'ct', name: 'CT side' },
];

export function mapName(id) {
  return MAPS.find((m) => m.id === id)?.name ?? id;
}
export function typeInfo(id) {
  return NADE_TYPES.find((t) => t.id === id) ?? NADE_TYPES[0];
}
export function techniqueName(id) {
  return TECHNIQUES.find((t) => t.id === id)?.name ?? id;
}
export function sideName(id) {
  return SIDES.find((s) => s.id === id)?.name ?? id;
}

export function detectMediaKind(url) {
  const u = (url || '').toLowerCase();
  if (/youtube\.com|youtu\.be|\.mp4|\.webm|\.mov|streamable\.com/.test(u)) return 'video';
  return 'image';
}
