// Site settings (owner-configurable) stored in app_meta. Currently the donate
// links shown in the footer.

import { pool } from './db.js';

const KEYS = {
  paypal: 'donate_paypal_url',
  steam: 'donate_steam_url',
};

async function getMeta(k) {
  const [rows] = await pool.query('SELECT v FROM app_meta WHERE k = ?', [k]);
  return rows.length ? rows[0].v || '' : '';
}
async function setMeta(k, v) {
  await pool.query('INSERT INTO app_meta (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [k, v || '']);
}

export async function getSettings() {
  return {
    paypalUrl: await getMeta(KEYS.paypal),
    steamTradeUrl: await getMeta(KEYS.steam),
  };
}

export async function saveSettings({ paypalUrl, steamTradeUrl }) {
  await setMeta(KEYS.paypal, paypalUrl || '');
  await setMeta(KEYS.steam, steamTradeUrl || '');
  return getSettings();
}
