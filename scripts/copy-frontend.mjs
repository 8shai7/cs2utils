// Copy the built frontend (web/dist/) into the repo-root public/ folder so the
// backend (repo root) serves the whole app from one place.
import { rmSync, cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); // repo root
const dist = path.resolve(root, 'web', 'dist');
const dest = path.resolve(root, 'public');

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('[copy-frontend] web/dist/index.html not found — run "npm --prefix web run build" first.');
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(dist, dest, { recursive: true });
console.log(`[copy-frontend] copied ${dist} -> ${dest}`);
