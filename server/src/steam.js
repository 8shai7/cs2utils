// Steam OpenID 2.0 login + Steam Web API profile fetch.

import { config } from './config.js';

const OPENID_NS = 'http://specs.openid.net/auth/2.0';

/** Build the Steam OpenID redirect URL. */
export function buildSteamLoginUrl(realm, returnTo) {
  const p = new URLSearchParams({
    'openid.ns': OPENID_NS,
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnTo,
    'openid.realm': realm,
    'openid.identity': `${OPENID_NS}/identifier_select`,
    'openid.claimed_id': `${OPENID_NS}/identifier_select`,
  });
  return `https://steamcommunity.com/openid/login?${p.toString()}`;
}

/** Verify a Steam OpenID callback and return the SteamID64, or null if invalid. */
export async function verifySteamAssertion(query) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (k.startsWith('openid.')) body.append(k, String(v));
  }
  body.set('openid.mode', 'check_authentication');

  const res = await fetch('https://steamcommunity.com/openid/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const text = await res.text();
  if (!/is_valid\s*:\s*true/i.test(text)) return null;

  const claimed = String(query['openid.claimed_id'] || '');
  const m = /\/openid\/id\/(\d{17})/.exec(claimed);
  return m ? m[1] : null;
}

/** Fetch persona name + avatar for a SteamID64 via the Steam Web API. */
export async function fetchSteamProfile(steamId) {
  if (!config.steamApiKey) return null;
  try {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${config.steamApiKey}&steamids=${steamId}`;
    const res = await fetch(url);
    const data = await res.json();
    const p = data?.response?.players?.[0];
    return p ? { name: p.personaname, avatar: p.avatarfull, profileUrl: p.profileurl } : null;
  } catch {
    return null;
  }
}
