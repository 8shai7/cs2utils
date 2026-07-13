// Copy the frontend build (web/dist/) to the repo-root dist/ so a static host
// whose Output Directory is `dist` (and whose build command is `npm run build`)
// works even though the frontend project lives in web/.
import { rmSync, cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(root, 'web', 'dist');
const dest = path.resolve(root, 'dist');

if (!existsSync(path.join(src, 'index.html'))) {
  console.error('[build] web/dist/index.html not found — the frontend build did not run.');
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log(`[build] copied ${src} -> ${dest}`);
