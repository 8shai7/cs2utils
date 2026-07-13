// Self-hosted CAPTCHA (no external service). svg-captcha draws the characters as
// SVG *paths* (not selectable text), and only a salted hash of the answer is put
// in the signed token — so the answer is never readable by the client.

import svgCaptcha from 'svg-captcha';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { config } from './config.js';

function hashAnswer(answer) {
  return crypto
    .createHash('sha256')
    .update(String(answer).trim().toUpperCase() + config.jwtSecret)
    .digest('hex');
}

/** Create a new CAPTCHA challenge: a signed token + an SVG image to show the user. */
export function createCaptcha() {
  const c = svgCaptcha.create({
    size: 5,
    noise: 3,
    color: true,
    ignoreChars: '0oO1ilLI',
    background: '#0e1017',
  });
  const token = jwt.sign({ h: hashAnswer(c.text), k: 'captcha' }, config.jwtSecret, { expiresIn: '10m' });
  return { token, svg: c.data };
}

/** Verify a user's answer against the signed challenge token. */
export function verifyCaptcha(token, answer) {
  if (!token || !answer) return false;
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload.k !== 'captcha') return false;
    return hashAnswer(answer) === payload.h;
  } catch {
    return false;
  }
}
