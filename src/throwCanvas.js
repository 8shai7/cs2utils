/**
 * 2D throw visualizer.
 *
 * The app cannot generate real gameplay video, so each nade is "converted" to a
 * 2D top-down representation: a stylized map backdrop with the throw position,
 * the landing spot, and an arced trajectory between them.
 */

import { typeInfo, mapName } from './nades.js';

/** Draw the stylized top-down map backdrop + label. */
function drawMapBackdrop(ctx, size, mapId) {
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#26313f');
  gradient.addColorStop(0.5, '#2f3d4e');
  gradient.addColorStop(1, '#222b37');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i += size / 10) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.font = '600 22px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mapName(mapId).toUpperCase(), size / 2, size / 2);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ mapId: string, type?: string, start?: {x:number,y:number}|null, end?: {x:number,y:number}|null }} nade
 */
export function renderThrow(canvas, { mapId, type = 'smoke', start = null, end = null }) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = canvas.width;
  ctx.clearRect(0, 0, size, size);
  drawMapBackdrop(ctx, size, mapId);

  const color = typeInfo(type).color;

  if (start && end) {
    const sx = start.x * size;
    const sy = start.y * size;
    const ex = end.x * size;
    const ey = end.y * size;

    // Arced trajectory (quadratic curve bowing "up" from the straight line).
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    const dist = Math.hypot(ex - sx, ey - sy);
    const cx = mx;
    const cy = my - Math.max(24, dist * 0.35);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(cx, cy, ex, ey);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrowhead pointing into the landing spot.
    const t = 0.92;
    const bx = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex;
    const by = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ey;
    const angle = Math.atan2(ey - by, ex - bx);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - 12 * Math.cos(angle - 0.4), ey - 12 * Math.sin(angle - 0.4));
    ctx.lineTo(ex - 12 * Math.cos(angle + 0.4), ey - 12 * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  if (start) drawMarker(ctx, start.x * size, start.y * size, '#3ecf8e', 'THROW');
  if (end) drawLanding(ctx, end.x * size, end.y * size, color);

  if (!start || !end) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '13px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(
      !start ? 'Click the map to set your throw position' : 'Click again to set the landing spot',
      size / 2,
      size - 12,
    );
  }
}

function drawMarker(ctx, x, y, color, label) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0d1117';
  ctx.stroke();
  if (label) {
    ctx.fillStyle = '#fff';
    ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(label, x, y - 10);
  }
}

function drawLanding(ctx, x, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 6, y - 6);
  ctx.lineTo(x + 6, y + 6);
  ctx.moveTo(x + 6, y - 6);
  ctx.lineTo(x - 6, y + 6);
  ctx.stroke();
}

/**
 * Convert a click on the canvas element to normalized 0..1 coordinates.
 * @param {HTMLCanvasElement} canvas
 * @param {MouseEvent} event
 */
export function canvasPointToNormalized(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
}
