/**
 * PSA — Perfect Sensitivity Approximation.
 *
 * A binary-search method for dialing in FPS mouse sensitivity: starting from a
 * base sensitivity, each round presents a lower and a higher value to test
 * in-game. The player picks whichever side feels better and the search range
 * halves, converging on a personal ideal over a fixed number of rounds.
 *
 * @typedef {{
 *   base: number,
 *   lo: number,
 *   hi: number,
 *   round: number,
 *   choices: { round: number, side: 'lower' | 'higher', lo: number, hi: number, lower: number, higher: number }[],
 * }} PsaState
 */

export const PSA_ROUNDS = 7;

/** Round 1 spans 0.5×–1.5× of the base sensitivity. */
export const PSA_RANGE_FACTOR = 0.5;

/**
 * @param {number} base starting in-game sensitivity
 * @returns {PsaState}
 */
export function createPsaState(base) {
  return {
    base,
    lo: base * (1 - PSA_RANGE_FACTOR),
    hi: base * (1 + PSA_RANGE_FACTOR),
    round: 1,
    choices: [],
  };
}

/**
 * The two values to test this round plus the current midpoint estimate.
 *
 * Uses the quarter-points of the live range (not the endpoints). Presenting
 * lo/hi directly made the chosen side stay identical every round — e.g. always
 * picking "lower" kept showing the same lower number.
 *
 * @param {PsaState} state
 */
export function psaCandidates(state) {
  const mid = (state.lo + state.hi) / 2;
  return {
    lower: (state.lo + mid) / 2,
    higher: (mid + state.hi) / 2,
    mid,
  };
}

/**
 * Whether the search has finished all rounds.
 * @param {PsaState} state
 */
export function psaComplete(state) {
  return state.round > PSA_ROUNDS;
}

/**
 * The current best estimate (midpoint of the live range).
 * @param {PsaState} state
 */
export function psaEstimate(state) {
  return (state.lo + state.hi) / 2;
}

/**
 * Width of the live range as a fraction of the current estimate (e.g. 0.05 = ±2.5%).
 * @param {PsaState} state
 */
export function psaSpread(state) {
  const mid = psaEstimate(state);
  if (mid <= 0) return 0;
  return (state.hi - state.lo) / mid;
}

/**
 * Apply a choice and narrow the range toward that side.
 * @param {PsaState} state
 * @param {'lower' | 'higher'} side
 * @returns {PsaState}
 */
export function psaChoose(state, side) {
  if (psaComplete(state)) return state;
  const mid = (state.lo + state.hi) / 2;
  const { lower, higher } = psaCandidates(state);
  const choice = { round: state.round, side, lo: state.lo, hi: state.hi, lower, higher };
  const next = {
    ...state,
    choices: [...state.choices, choice],
    round: state.round + 1,
  };
  if (side === 'lower') {
    next.hi = mid;
  } else {
    next.lo = mid;
  }
  return next;
}

/**
 * Undo the most recent choice, restoring the previous range.
 * @param {PsaState} state
 * @returns {PsaState}
 */
export function psaUndo(state) {
  if (state.choices.length === 0) return state;
  const choices = state.choices.slice(0, -1);
  const last = state.choices[state.choices.length - 1];
  return {
    ...state,
    lo: last.lo,
    hi: last.hi,
    round: last.round,
    choices,
  };
}

/**
 * Final recommended sensitivity once all rounds are complete.
 * @param {PsaState} state
 */
export function psaFinal(state) {
  return psaEstimate(state);
}
