// Simple in-memory sliding-window rate limiter. Best-effort on serverless (each
// function instance has its own memory), but combined with CAPTCHAs it meaningfully
// curbs abuse of the auth/email endpoints.

const buckets = new Map(); // key -> number[] (timestamps, ms)
let lastSweep = 0;

function sweep(now, windowMs) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, arr] of buckets) {
    const kept = arr.filter((t) => now - t < windowMs);
    if (kept.length) buckets.set(key, kept);
    else buckets.delete(key);
  }
}

/**
 * @returns {{ ok: true } | { ok: false, retryAfterSec: number }}
 */
export function rateLimit(key, max, windowMs) {
  const now = Date.now();
  sweep(now, windowMs);
  const arr = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - arr[0])) / 1000));
    buckets.set(key, arr);
    return { ok: false, retryAfterSec };
  }
  arr.push(now);
  buckets.set(key, arr);
  return { ok: true };
}

/** Best-effort client IP (works behind Vercel/Hostinger proxies). */
export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return String(fwd).split(',')[0].trim();
  return req.socket?.remoteAddress || req.ip || 'unknown';
}
