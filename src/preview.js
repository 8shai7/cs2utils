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
 */
export function renderCrosshairPreview(canvas, crosshair) {
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

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 32) {
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
    ctx.font = '14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Enter a code or commands', cx, cy + 5);
    ctx.globalAlpha = 1;
    return;
  }

  const color = crosshairColor(crosshair);
  const alpha = crosshairAlpha(crosshair);
  const scale = 6;
  const gap = Math.max(0, crosshair.gap * scale);
  const length = Math.max(0.5, crosshair.length * scale);
  const thickness = Math.max(1, crosshair.thickness * scale);
  const outline = crosshair.outlineEnabled ? Math.max(1, crosshair.outline * scale) : 0;

  const arms = [
    { dx: 0, dy: -1, hide: crosshair.tStyleEnabled },
    { dx: 0, dy: 1, hide: false },
    { dx: -1, dy: 0, hide: false },
    { dx: 1, dy: 0, hide: false },
  ];

  const drawLine = (x1, y1, x2, y2, lineWidth, stroke, lineAlpha) => {
    ctx.globalAlpha = lineAlpha;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  for (const arm of arms) {
    if (arm.hide) continue;

    const start = gap;
    const end = gap + length;
    const x1 = cx + arm.dx * start;
    const y1 = cy + arm.dy * start;
    const x2 = cx + arm.dx * end;
    const y2 = cy + arm.dy * end;

    if (outline > 0) {
      drawLine(x1, y1, x2, y2, thickness + outline * 2, '#000', alpha);
    }
    drawLine(x1, y1, x2, y2, thickness, color, alpha);
  }

  if (crosshair.centerDotEnabled) {
    const dotSize = Math.max(thickness, 2);
    if (outline > 0) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#000';
      ctx.fillRect(cx - dotSize / 2 - outline, cy - dotSize / 2 - outline, dotSize + outline * 2, dotSize + outline * 2);
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(cx - dotSize / 2, cy - dotSize / 2, dotSize, dotSize);
  }

  ctx.globalAlpha = 1;

  if (crosshair.style === 2 || crosshair.style === 3) {
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = '#fff';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`style ${crosshair.style} · split preview simplified`, cx, size - 14);
    ctx.globalAlpha = 1;
  }
}
