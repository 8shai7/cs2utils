/** @typedef {import('csgo-sharecode').Crosshair} Crosshair */

const PRESET_COLORS = {
  0: [255, 255, 255],
  1: [50, 250, 50],
  2: [255, 255, 0],
  3: [50, 50, 250],
  4: [50, 250, 250],
};

/**
 * @param {Crosshair} crosshair
 * @returns {string}
 */
export function crosshairColor(crosshair) {
  if (crosshair.color === 5) {
    return `rgb(${crosshair.red}, ${crosshair.green}, ${crosshair.blue})`;
  }
  const preset = PRESET_COLORS[crosshair.color] ?? PRESET_COLORS[1];
  return `rgb(${preset[0]}, ${preset[1]}, ${preset[2]})`;
}

/**
 * @param {Crosshair} crosshair
 * @returns {number}
 */
function crosshairAlpha(crosshair) {
  if (!crosshair.alphaEnabled) return 1;
  return Math.min(1, Math.max(0, crosshair.alpha / 255));
}

/** Source HUD YRES — crosshair units are authored against a 480p reference. */
function yres(value, resHeight) {
  return Number(value) * (Number(resHeight) / 480);
}

/** Match Liquipedia / Source HUD rounding for crosshair pip sizes. */
function roundHud(number) {
  const n = Number(number);
  if (!Number.isFinite(n)) return 0;
  const whole = Math.trunc(n);
  const frac = Math.abs(n - whole);
  const frac3 = Math.round(frac * 1000) / 1000;
  if (frac3 > 0.5) return n >= 0 ? Math.ceil(n) : Math.floor(n);
  if (frac3 === 0.5) return n >= 0 ? Math.floor(n - 0.1) : Math.ceil(n + 0.1);
  return n >= 0 ? Math.floor(n) : Math.ceil(n);
}

function simpleRound(number) {
  const n = Number(number);
  return n >= 0 ? Math.floor(n + 0.5) : Math.ceil(n - 0.5);
}

/**
 * Pixel sizes for a crosshair at a given vertical resolution (CS2 / Source HUD).
 * @param {Crosshair} crosshair
 * @param {number} resHeight
 */
export function crosshairPixelMetrics(crosshair, resHeight = 1080) {
  const h = Number(resHeight) || 1080;
  const length = Math.max(0, roundHud(yres(crosshair.length, h)));
  const thickness = Math.max(1, roundHud(yres(crosshair.thickness, h)));
  // Classic styles: inner gap between opposite arms (Liquipedia Module:Crosshair).
  const gapInner = 2 * (4 + simpleRound(crosshair.gap)) + thickness;
  const outline = crosshair.outlineEnabled
    ? Math.max(1, roundHud(yres(crosshair.outline, h)))
    : 0;
  return { length, thickness, gapInner, outline, resHeight: h };
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Crosshair | null} crosshair
 * @param {number | { resHeight?: number }} [scaleOrOpts]
 *   Legacy: a number was "canvas px per crosshair unit" (incorrect for CS2).
 *   Prefer `{ resHeight }` — vertical resolution the preview should simulate.
 */
export function renderCrosshairPreview(canvas, crosshair, scaleOrOpts = 1080) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // CS2-style blurred map backdrop
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3a4a38');
  gradient.addColorStop(0.45, '#5c6b52');
  gradient.addColorStop(1, '#2a3328');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const gridStep = Math.max(24, Math.round(size / 9));
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = Math.max(1, Math.round(size / 280));
  for (let i = 0; i < size; i += gridStep) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  if (!crosshair) {
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#fff';
    ctx.font = `${Math.round(size * 0.05)}px Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Enter a code or commands', cx, cy + size * 0.02);
    ctx.globalAlpha = 1;
    return;
  }

  const resHeight =
    typeof scaleOrOpts === 'object' && scaleOrOpts
      ? Number(scaleOrOpts.resHeight) || 1080
      : // Legacy numeric scale assumed 1080p units; map back to a height.
        Math.round((Number(scaleOrOpts) || 1) * 1080);

  const color = crosshairColor(crosshair);
  const alpha = crosshairAlpha(crosshair);
  const { length, thickness, gapInner, outline } = crosshairPixelMetrics(crosshair, resHeight);

  const px = Math.round(cx);
  const py = Math.round(cy);
  const half = Math.floor(thickness / 2);
  const gapHalf = gapInner / 2;

  const drawRect = (x, y, w, h) => {
    if (w <= 0 || h <= 0) return;
    if (outline > 0) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#000';
      ctx.fillRect(x - outline, y - outline, w + outline * 2, h + outline * 2);
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  if (length > 0) {
    // right, left, bottom, and (unless T-style) top arms
    drawRect(px + gapHalf, py - half, length, thickness);
    drawRect(px - gapHalf - length, py - half, length, thickness);
    drawRect(px - half, py + gapHalf, thickness, length);
    if (!crosshair.tStyleEnabled) drawRect(px - half, py - gapHalf - length, thickness, length);
  }

  if (crosshair.centerDotEnabled) {
    const dot = thickness;
    drawRect(px - Math.floor(dot / 2), py - Math.floor(dot / 2), dot, dot);
  }

  ctx.globalAlpha = 1;

  if (crosshair.style === 2 || crosshair.style === 3) {
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#fff';
    ctx.font = `${Math.round(size * 0.039)}px JetBrains Mono, monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(`style ${crosshair.style} · dynamic (shown static)`, cx, size - Math.round(size * 0.05));
    ctx.globalAlpha = 1;
  }
}
