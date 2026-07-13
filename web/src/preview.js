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

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} length
 * @param {number} thickness
 * @param {string} color
 * @param {number} alpha
 */
function drawArm(ctx, cx, cy, length, thickness, color, alpha) {
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fillRect(cx - thickness / 2, cy - length, thickness, length * 2);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Crosshair | null} crosshair
 * @param {number} [scale] canvas pixels per crosshair unit. When the canvas
 *   backing store represents the full screen height (1080 units), pass
 *   canvas.height / 1080 so the crosshair is drawn as a true fraction of the
 *   whole screen rather than relative to the small preview box.
 */
export function renderCrosshairPreview(canvas, crosshair, scale = 1) {
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

  // Grid + fonts are sized relative to the canvas so the look is consistent
  // regardless of the backing-store resolution (the box may be a high-res
  // full-screen render that CSS downscales to the panel).
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

  const color = crosshairColor(crosshair);
  const alpha = crosshairAlpha(crosshair);

  // Real in-game pixel sizes: at 1080p, 1 unit ≈ 1 px and thickness 1 = 1 px.
  // The game rounds to whole pixels and scales with vertical resolution.
  const length = Math.max(0, Math.round(crosshair.length * scale));
  const thickness = Math.max(1, Math.round(crosshair.thickness * scale));
  const gap = Math.round(crosshair.gap * scale);
  const outline = crosshair.outlineEnabled ? Math.max(1, Math.round(crosshair.outline * scale)) : 0;

  // Align to the pixel grid so real 1px lines render crisply.
  const px = Math.round(cx) + (thickness % 2 ? 0.0 : 0);
  const py = Math.round(cy);

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

  const half = Math.floor(thickness / 2);

  if (length > 0) {
    // right, left, bottom, and (unless T-style) top arms
    drawRect(px + gap, py - half, length, thickness);
    drawRect(px - gap - length, py - half, length, thickness);
    drawRect(px - half, py + gap, thickness, length);
    if (!crosshair.tStyleEnabled) drawRect(px - half, py - gap - length, thickness, length);
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
