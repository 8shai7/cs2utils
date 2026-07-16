// "Real email" checks: block throwaway/disposable domains and verify the domain
// can actually receive mail (MX, or A/AAAA fallback) via DNS.

import dns from 'node:dns/promises';
import { config } from './config.js';

// A pragmatic built-in list of common disposable / throwaway email providers.
const BUILTIN_DISPOSABLE = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.info',
  'grr.la',
  'sharklasers.com',
  '10minutemail.com',
  '10minutemail.net',
  'tempmail.com',
  'temp-mail.org',
  'tempmail.dev',
  'tempmailo.com',
  'throwawaymail.com',
  'yopmail.com',
  'yopmail.net',
  'getnada.com',
  'nada.email',
  'dispostable.com',
  'trashmail.com',
  'trashmail.de',
  'maildrop.cc',
  'mailnesia.com',
  'mailcatch.com',
  'mohmal.com',
  'fakeinbox.com',
  'spam4.me',
  'mytemp.email',
  'tmpmail.org',
  'tmpmail.net',
  'emailondeck.com',
  'moakt.com',
  'mailtemp.net',
  'burnermail.io',
  'anonaddy.com',
  'guerrillamailblock.com',
  'temp-mail.io',
  'inboxkitten.com',
  'discard.email',
  'harakirimail.com',
  'einrot.com',
  'fakemail.net',
  'tempr.email',
  'luxusmail.org',
  'vmani.com',
  'cs.email',
  'girl.re',
  'test.com',
  'example.com',
]);

export function emailDomain(email) {
  return String(email || '')
    .split('@')[1]
    ?.trim()
    .toLowerCase() || '';
}

export function isDisposableEmail(email) {
  const domain = emailDomain(email);
  if (!domain) return true;
  if (BUILTIN_DISPOSABLE.has(domain)) return true;
  return config.disposableEmailDomains.includes(domain);
}

/** True if the domain has DNS records that can receive email (MX, or A/AAAA). */
export async function domainCanReceiveMail(email) {
  const domain = emailDomain(email);
  if (!domain) return false;
  try {
    const mx = await dns.resolveMx(domain);
    if (mx && mx.length && mx.some((r) => r.exchange)) return true;
  } catch {
    /* fall through to A/AAAA */
  }
  try {
    const a = await dns.resolve4(domain);
    if (a && a.length) return true;
  } catch {
    /* ignore */
  }
  try {
    const aaaa = await dns.resolve6(domain);
    if (aaaa && aaaa.length) return true;
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * Validate that an email is "real": not disposable and (optionally) has a
 * mail-capable domain. Returns { ok } or { ok:false, reason }.
 */
export async function validateRealEmail(email) {
  if (isDisposableEmail(email)) {
    return { ok: false, reason: 'Disposable/temporary email addresses are not allowed.' };
  }
  if (config.checkEmailMx) {
    const deliverable = await domainCanReceiveMail(email);
    if (!deliverable) {
      return { ok: false, reason: "That email domain can't receive mail. Use a real email address." };
    }
  }
  return { ok: true };
}
