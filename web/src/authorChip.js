// Shared uploader chip: circular avatar + username (+ optional date).

import { resolveMediaUrl } from './api.js';

function esc(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @param {{ authorName?: string, authorAvatar?: string }} author
 * @param {{ date?: string }} [opts]
 */
export function authorChipHtml(author, opts = {}) {
  const name = String(author?.authorName || 'Unknown').trim() || 'Unknown';
  const avatar = author?.authorAvatar ? resolveMediaUrl(author.authorAvatar) : '';
  const initial = (name[0] || '?').toUpperCase();
  const date = opts.date ? String(opts.date) : '';
  return `<span class="author-chip">
    <span class="author-avatar" aria-hidden="true">${
      avatar
        ? `<img src="${esc(avatar)}" alt="" loading="lazy" />`
        : `<span class="author-initial">${esc(initial)}</span>`
    }</span>
    <span class="author-meta">
      <span class="author-name">${esc(name)}</span>${
        date ? `<span class="author-date">${esc(date)}</span>` : ''
      }
    </span>
  </span>`;
}
