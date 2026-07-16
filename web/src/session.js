// Shared session store so the header account menu and the Nades tool stay in sync.

import { api } from './api.js';

let current = null;
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn(current);
}

export function getUser() {
  return current;
}

/** Subscribe to session changes. Returns an unsubscribe function. */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export async function refresh() {
  current = await api.auth.me();
  emit();
  return current;
}

export async function login(input) {
  current = await api.auth.login(input);
  emit();
  return current;
}

export async function register(input) {
  // May return { verifyRequired } (no session) or { user } (auto-logged-in).
  const data = await api.auth.register(input);
  if (data && data.user) {
    current = data.user;
    emit();
  }
  return data;
}

export async function verifyEmail(token) {
  current = await api.auth.verify(token);
  emit();
  return current;
}

export function logout() {
  api.auth.logout();
  current = null;
  emit();
}
