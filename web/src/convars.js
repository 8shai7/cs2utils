/** @typedef {import('csgo-sharecode').Crosshair} Crosshair */

const CONVAR_MAP = {
  cl_crosshair_drawoutline: 'outlineEnabled',
  cl_crosshair_dynamic_maxdist_splitratio: 'splitSizeRatio',
  cl_crosshair_dynamic_splitalpha_innermod: 'innerSplitAlpha',
  cl_crosshair_dynamic_splitalpha_outermod: 'outerSplitAlpha',
  cl_crosshair_dynamic_splitdist: 'splitDistance',
  cl_crosshair_outlinethickness: 'outline',
  cl_crosshair_t: 'tStyleEnabled',
  cl_crosshairalpha: 'alpha',
  cl_crosshaircolor: 'color',
  cl_crosshaircolor_b: 'blue',
  cl_crosshaircolor_g: 'green',
  cl_crosshaircolor_r: 'red',
  cl_crosshairdot: 'centerDotEnabled',
  cl_crosshairgap: 'gap',
  cl_crosshairgap_useweaponvalue: 'deployedWeaponGapEnabled',
  cl_crosshairsize: 'length',
  cl_crosshairstyle: 'style',
  cl_crosshairthickness: 'thickness',
  cl_crosshairusealpha: 'alphaEnabled',
  cl_fixedcrosshairgap: 'fixedCrosshairGap',
  cl_crosshair_recoil: 'followRecoil',
};

const BOOLEAN_KEYS = new Set([
  'outlineEnabled',
  'tStyleEnabled',
  'centerDotEnabled',
  'deployedWeaponGapEnabled',
  'alphaEnabled',
  'followRecoil',
]);

const DEFAULT_CROSSHAIR = /** @type {Crosshair} */ ({
  length: 3,
  red: 50,
  green: 250,
  blue: 50,
  gap: -2,
  alphaEnabled: true,
  alpha: 200,
  outlineEnabled: false,
  outline: 1,
  color: 1,
  thickness: 0.5,
  centerDotEnabled: false,
  splitDistance: 3,
  followRecoil: false,
  fixedCrosshairGap: 3,
  innerSplitAlpha: 0,
  outerSplitAlpha: 1,
  splitSizeRatio: 1,
  tStyleEnabled: false,
  deployedWeaponGapEnabled: true,
  style: 4,
});

/**
 * @param {string} raw
 * @returns {string}
 */
function parseValue(raw) {
  const trimmed = raw.trim().replace(/^["']|["']$/g, '');
  const lower = trimmed.toLowerCase();
  if (lower === 'true') return '1';
  if (lower === 'false') return '0';
  return trimmed;
}

/**
 * @param {string} text
 * @returns {Record<string, string>}
 */
export function parseConVars(text) {
  const vars = {};
  const normalized = text
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  for (const chunk of normalized.split(/[;\n]+/)) {
    const line = chunk.trim();
    if (!line) continue;

    const match = line.match(/^(cl_[\w]+)\s+(.+)$/);
    if (!match) continue;

    vars[match[1]] = parseValue(match[2]);
  }

  return vars;
}

/**
 * @param {string | number | boolean | undefined} value
 * @param {boolean} asBool
 * @returns {number | boolean}
 */
function coerce(value, asBool) {
  if (value === undefined) return asBool ? false : 0;
  if (asBool) {
    if (typeof value === 'boolean') return value;
    const n = Number(value);
    return n !== 0;
  }
  return Number(value);
}

/**
 * @param {Record<string, string>} vars
 * @returns {Crosshair}
 */
export function conVarsToCrosshair(vars) {
  /** @type {Partial<Crosshair>} */
  const crosshair = { ...DEFAULT_CROSSHAIR };

  for (const [convar, key] of Object.entries(CONVAR_MAP)) {
    if (!(convar in vars)) continue;
    const asBool = BOOLEAN_KEYS.has(key);
    crosshair[key] = coerce(vars[convar], asBool);
  }

  return /** @type {Crosshair} */ (crosshair);
}

/**
 * @param {string} text
 * @returns {Crosshair}
 */
export function parseCommandsToCrosshair(text) {
  return conVarsToCrosshair(parseConVars(text));
}

/**
 * @param {string} commands
 * @returns {string}
 */
export function formatCommands(commands) {
  return commands
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

export { DEFAULT_CROSSHAIR };
