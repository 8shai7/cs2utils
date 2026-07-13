// Copy the built frontend (dist/) into server/public/ so the backend can serve
// the whole app from a single folder (upload just `server/` to your Node host).
import { rmSync, cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.resolve(root, 'dist');
const dest = path.resolve(root, 'server', 'public');

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('[copy-dist] dist/index.html not found — run "npm run build" first.');
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(dist, dest, { recursive: true });
console.log(`[copy-dist] copied ${dist} -> ${dest}`);
