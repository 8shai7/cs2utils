/** @typedef {{ id: string, name: string, yaw: number, supportsMYaw?: boolean }} GameProfile */

/** @type {Record<string, GameProfile>} */
export const GAMES = {
  cs2: { id: 'cs2', name: 'Counter-Strike 2', yaw: 0.022, supportsMYaw: true },
  csgo: { id: 'csgo', name: 'CS:GO', yaw: 0.022 },
  valorant: { id: 'valorant', name: 'Valorant', yaw: 0.07 },
  apex: { id: 'apex', name: 'Apex Legends', yaw: 0.022 },
  overwatch2: { id: 'overwatch2', name: 'Overwatch 2', yaw: 0.0066 },
  r6: { id: 'r6', name: 'Rainbow Six Siege', yaw: 0.00572958 },
  fortnite: { id: 'fortnite', name: 'Fortnite', yaw: 0.005555 },
  cod: { id: 'cod', name: 'Call of Duty', yaw: 0.0066 },
  tf2: { id: 'tf2', name: 'Team Fortress 2', yaw: 0.022 },
  marvel: { id: 'marvel', name: 'Marvel Rivals', yaw: 0.022 },
  deadlock: { id: 'deadlock', name: 'Deadlock', yaw: 0.044 },
  tf: { id: 'tf', name: 'The Finals', yaw: 0.0066 },
};

/** @type {GameProfile[]} */
export const GAME_LIST = Object.values(GAMES);

/**
 * @param {string} gameId
 * @param {number} [mYaw]
 * @returns {number}
 */
export function getEffectiveYaw(gameId, mYaw = 0.022) {
  const game = GAMES[gameId];
  if (!game) throw new Error(`Unknown game: ${gameId}`);
  if (game.supportsMYaw) return mYaw;
  return game.yaw;
}

/**
 * @param {number} sens
 * @param {number} dpi
 * @param {number} yaw
 * @returns {number}
 */
export function cm360(sens, dpi, yaw) {
  if (sens <= 0 || dpi <= 0 || yaw <= 0) return NaN;
  return 914.4 / (sens * dpi * yaw);
}

/**
 * @param {number} cm
 * @param {number} dpi
 * @param {number} yaw
 * @returns {number}
 */
export function sensitivityFromCm360(cm, dpi, yaw) {
  if (cm <= 0 || dpi <= 0 || yaw <= 0) return NaN;
  return 914.4 / (cm * dpi * yaw);
}

/**
 * @param {object} params
 * @param {string} params.sourceGame
 * @param {string} params.targetGame
 * @param {number} params.sourceSens
 * @param {number} params.sourceDpi
 * @param {number} params.targetDpi
 * @param {number} [params.sourceMYaw]
 * @param {number} [params.targetMYaw]
 */
export function convertSensitivity({
  sourceGame,
  targetGame,
  sourceSens,
  sourceDpi,
  targetDpi,
  sourceMYaw = 0.022,
  targetMYaw = 0.022,
}) {
  const sourceYaw = getEffectiveYaw(sourceGame, sourceMYaw);
  const targetYaw = getEffectiveYaw(targetGame, targetMYaw);
  const targetSens = sourceSens * (sourceDpi / targetDpi) * (sourceYaw / targetYaw);
  const distanceCm = cm360(sourceSens, sourceDpi, sourceYaw);
  const targetCm = cm360(targetSens, targetDpi, targetYaw);

  return {
    targetSensitivity: targetSens,
    cm360: distanceCm,
    inches360: distanceCm / 2.54,
    sourceEdpi: sourceSens * sourceDpi,
    targetEdpi: targetSens * targetDpi,
    sourceYaw,
    targetYaw,
    targetCm360: targetCm,
    ratio: sourceYaw / targetYaw,
  };
}

/**
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function formatSens(value, digits = 4) {
  if (!Number.isFinite(value)) return '—';
  return String(Number(value.toFixed(digits)));
}

/**
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function formatDistance(value, digits = 1) {
  if (!Number.isFinite(value)) return '—';
  return value.toFixed(digits);
}

/**
 * @param {string} selectedId
 * @returns {string}
 */
export function gameOptionsHtml(selectedId) {
  return GAME_LIST.map(
    (game) => `<option value="${game.id}"${game.id === selectedId ? ' selected' : ''}>${game.name}</option>`,
  ).join('');
}
