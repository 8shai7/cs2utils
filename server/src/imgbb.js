import { config } from './config.js';

export function imgbbConfigured() {
  return Boolean(config.imgbbApiKey);
}

/**
 * Upload an image buffer to ImgBB and return the hosted URL.
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
export async function uploadToImgbb(buffer) {
  if (!imgbbConfigured()) throw new Error('Image hosting is not configured (IMGBB_API_KEY).');
  const form = new FormData();
  form.append('key', config.imgbbApiKey);
  form.append('image', buffer.toString('base64'));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  let res;
  try {
    res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success || !data?.data?.url) {
    throw new Error(data?.error?.message || `ImgBB upload failed (${res.status}).`);
  }
  return data.data.url;
}
