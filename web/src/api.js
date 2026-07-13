// Frontend API client for the AimKit backend.
//
// In dev, requests go to `/api` and Vite proxies them to the Node server. In
// production set VITE_API_URL (e.g. https://api.yoursite.com/api) at build time.

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'cs2utils.token';

/** Origin used to resolve relative /uploads media URLs (empty = same origin). */
const MEDIA_ORIGIN = /^https?:\/\//.test(API_BASE) ? new URL(API_BASE).origin : '';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Store an auth token obtained out-of-band (e.g. Steam login redirect). */
export function setAuthToken(token) {
  setToken(token);
}
function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore storage errors */
  }
}

async function request(method, path, body, { auth = false } = {}) {
  const headers = {};
  if (body !== undefined && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the API running?');
  }
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status}).`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** Full-page URL to begin Steam login. */
export const steamLoginUrl = `${API_BASE}/auth/steam`;

/** Store a token obtained out-of-band (e.g. from the Steam login redirect). */
export function adoptToken(token) {
  setToken(token);
}

export function isAdmin(user) {
  return !!user && (user.role === 'admin' || user.role === 'owner');
}
export function isOwner(user) {
  return !!user && user.role === 'owner';
}

/** Resolve a media URL for display (absolute URLs pass through, /uploads gets the API origin). */
export function resolveMediaUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//.test(url) || url.startsWith('data:')) return url;
  return MEDIA_ORIGIN + url;
}

export const api = {
  auth: {
    async register(input) {
      const data = await request('POST', '/auth/register', input);
      setToken(data.token);
      return data.user;
    },
    async login(input) {
      const data = await request('POST', '/auth/login', input);
      setToken(data.token);
      return data.user;
    },
    logout() {
      setToken(null);
    },
    async captcha() {
      return request('GET', '/auth/captcha');
    },
    async changePassword(input) {
      return request('POST', '/auth/password', input, { auth: true });
    },
    async forgot(email) {
      return request('POST', '/auth/forgot', { email });
    },
    async reset(token, password) {
      return request('POST', '/auth/reset', { token, password });
    },
    async me() {
      if (!getToken()) return null;
      try {
        const data = await request('GET', '/auth/me', undefined, { auth: true });
        return data.user;
      } catch {
        setToken(null);
        return null;
      }
    },
    async profile() {
      return request('GET', '/auth/profile', undefined, { auth: true });
    },
    async setAvatar(url) {
      const data = await request('POST', '/auth/avatar', { url }, { auth: true });
      return data.user;
    },
    async uploadAvatar(file) {
      const form = new FormData();
      form.append('file', file);
      const data = await request('POST', '/auth/avatar/upload', form, { auth: true });
      return data.user;
    },
    async changePassword(input) {
      return request('POST', '/auth/password', input, { auth: true });
    },
    async changeUsername(username) {
      const data = await request('POST', '/auth/username', { username }, { auth: true });
      if (data.token) setToken(data.token);
      return data.user;
    },
    async setCredentials(input) {
      const data = await request('POST', '/auth/credentials', input, { auth: true });
      if (data.token) setToken(data.token);
      return data.user;
    },
    async forgot(email) {
      return request('POST', '/auth/forgot', { email });
    },
    async reset(token, password) {
      return request('POST', '/auth/reset', { token, password });
    },
    steamLoginUrl() {
      return `${API_BASE}/auth/steam`;
    },
    async steamLinkUrl() {
      const data = await request('GET', '/auth/steam/link-url', undefined, { auth: true });
      return data.url;
    },
    async steamUnlink() {
      const data = await request('POST', '/auth/steam/unlink', {}, { auth: true });
      return data.user;
    },
  },
  settings: {
    async get() {
      return request('GET', '/settings');
    },
  },
  contact: {
    async send(data) {
      return request('POST', '/contact', data);
    },
  },
  pros: {
    async list({ q = '', sort = 'name' } = {}) {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (sort) params.set('sort', sort);
      const qs = params.toString();
      return request('GET', `/pros${qs ? `?${qs}` : ''}`);
    },
  },
  configs: {
    async list({ sort = 'top', q = '' } = {}) {
      const params = new URLSearchParams();
      if (sort) params.set('sort', sort);
      if (q) params.set('q', q);
      const qs = params.toString();
      const data = await request('GET', `/configs${qs ? `?${qs}` : ''}`, undefined, { auth: true });
      return data.configs;
    },
    async create(input) {
      const data = await request('POST', '/configs', input, { auth: true });
      return data.config;
    },
    async rate(id, rating) {
      return request('POST', `/configs/${id}/rate`, { rating }, { auth: true });
    },
    async remove(id) {
      return request('DELETE', `/configs/${id}`, undefined, { auth: true });
    },
  },
  highlights: {
    async list({ q = '' } = {}) {
      const qs = q ? `?q=${encodeURIComponent(q)}` : '';
      const data = await request('GET', `/highlights${qs}`, undefined, { auth: true });
      return data.highlights;
    },
    async create(input) {
      const data = await request('POST', '/highlights', input, { auth: true });
      return data.highlight;
    },
    async report(id, reason) {
      return request('POST', `/highlights/${id}/report`, { reason }, { auth: true });
    },
    async remove(id) {
      return request('DELETE', `/highlights/${id}`, undefined, { auth: true });
    },
  },
  nades: {
    async list({ map = '', type = '' } = {}) {
      const q = new URLSearchParams();
      if (map) q.set('map', map);
      if (type) q.set('type', type);
      const qs = q.toString();
      const data = await request('GET', `/nades${qs ? `?${qs}` : ''}`);
      return data.nades;
    },
    async mine() {
      const data = await request('GET', '/nades/mine', undefined, { auth: true });
      return data.nades;
    },
    async create(input) {
      const data = await request('POST', '/nades', input, { auth: true });
      return data.nade;
    },
    async addMedia(nadeId, media) {
      const data = await request('POST', `/nades/${nadeId}/media`, media, { auth: true });
      return data.media;
    },
    async remove(nadeId) {
      return request('DELETE', `/nades/${nadeId}`, undefined, { auth: true });
    },
    async parseMapGuide(text) {
      return request('POST', '/nades/map-guide/parse', { text }, { auth: true });
    },
    async importMapGuide({ text, nades, side, guideText, fileName } = {}) {
      return request('POST', '/nades/map-guide/import', { text, nades, side, guideText, fileName }, { auth: true });
    },
    async practicePackFromText({ text, map, importId } = {}) {
      return request('POST', '/nades/map-guide/practice-pack', { text, map, importId }, { auth: true });
    },
    async practicePackFromImport(importId) {
      return request('GET', `/nades/map-guide/imports/${importId}/practice-pack`, undefined, { auth: !!getToken() });
    },
    async practicePackFromNades(nadeIds) {
      return request('POST', '/nades/map-guide/practice-pack-from-nades', { nadeIds }, { auth: !!getToken() });
    },
  },
  commands: {
    async catalog() {
      return request('GET', '/commands/catalog');
    },
    async social() {
      return request('GET', '/commands/social', undefined, { auth: true });
    },
    async recommend(key) {
      return request('POST', `/commands/${key}/recommend`, {}, { auth: true });
    },
    async addComment(key, body) {
      return request('POST', `/commands/${key}/comments`, { body }, { auth: true });
    },
  },
  admin: {
    async pending() {
      const data = await request('GET', '/admin/nades/pending', undefined, { auth: true });
      return data.nades;
    },
    async pendingComments() {
      const data = await request('GET', '/admin/comments/pending', undefined, { auth: true });
      return data.comments;
    },
    async pendingCommentsCount() {
      const data = await request('GET', '/admin/comments/pending/count', undefined, { auth: true });
      return data.count;
    },
    async reviewComment(id, decision) {
      return request('POST', `/admin/comments/${id}/review`, { decision }, { auth: true });
    },
    async syncCommands() {
      return request('POST', '/admin/commands/sync', {}, { auth: true });
    },
    async checkCommandsCs2() {
      return request('POST', '/admin/commands/check-cs2', {}, { auth: true });
    },
    async saveSettings(data) {
      return request('POST', '/admin/settings', data, { auth: true });
    },
    async highlightReports() {
      const data = await request('GET', '/admin/highlights/reports', undefined, { auth: true });
      return data.highlights;
    },
    async highlightReportsCount() {
      const data = await request('GET', '/admin/highlights/reports/count', undefined, { auth: true });
      return data.count;
    },
    async reviewHighlight(id, decision) {
      return request('POST', `/admin/highlights/${id}/review`, { decision }, { auth: true });
    },
    async syncPros() {
      return request('POST', '/admin/pros/sync', {}, { auth: true });
    },
    async importCommands(content) {
      return request('POST', '/admin/commands/import', { content }, { auth: true });
    },
    async importPros(content) {
      return request('POST', '/admin/pros/import', { content }, { auth: true });
    },
    async banUser(id, { hours, permanent }) {
      const data = await request('POST', `/admin/users/${id}/ban`, { hours, permanent }, { auth: true });
      return data.user;
    },
    async unbanUser(id) {
      const data = await request('POST', `/admin/users/${id}/unban`, {}, { auth: true });
      return data.user;
    },
    async pendingCount() {
      const data = await request('GET', '/admin/nades/pending/count', undefined, { auth: true });
      return data.count;
    },
    async reviewNade(id, decision, note = '') {
      return request('POST', `/admin/nades/${id}/review`, { decision, note }, { auth: true });
    },
    async reviewNadesBulk(ids, decision, note = '') {
      return request('POST', '/admin/nades/review-bulk', { ids, decision, note }, { auth: true });
    },
    async reviewMedia(mediaId, decision) {
      return request('POST', `/admin/media/${mediaId}/review`, { decision }, { auth: true });
    },
    async reviewMediaBulk(ids, decision) {
      return request('POST', '/admin/media/review-bulk', { ids, decision }, { auth: true });
    },
    async users() {
      const data = await request('GET', '/admin/users', undefined, { auth: true });
      return data.users;
    },
    async setRole(userId, role) {
      const data = await request('POST', `/admin/users/${userId}/role`, { role }, { auth: true });
      return data.user;
    },
    async contactMessages() {
      const data = await request('GET', '/admin/contact', undefined, { auth: true });
      return data.messages;
    },
  },
  uploads: {
    async image(file) {
      const form = new FormData();
      form.append('file', file);
      const data = await request('POST', '/uploads', form, { auth: true });
      return data;
    },
  },
};
