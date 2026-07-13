import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { initDb } from './db.js';
import { authRoutes } from './routes/authRoutes.js';
import { nadesRoutes } from './routes/nadesRoutes.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { uploadsRoutes } from './routes/uploadsRoutes.js';
import { commandsRoutes } from './routes/commandsRoutes.js';
import { configsRoutes } from './routes/configsRoutes.js';
import { highlightsRoutes } from './routes/highlightsRoutes.js';
import { prosRoutes } from './routes/prosRoutes.js';
import { contactRoutes } from './routes/contactRoutes.js';
import { settingsRoutes } from './routes/settingsRoutes.js';
import { seedIfEmpty, syncFromSource, startCommandsScheduler, startCs2Watcher } from './commandsSync.js';
import { seedProsIfEmpty, syncPros } from './proSettings.js';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((s) => s.trim()),
  }),
);
app.use(express.json({ limit: '1mb' }));

const uploadDir = path.resolve(process.cwd(), config.uploadDir);
fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/nades', nadesRoutes);
app.use('/api/commands', commandsRoutes);
app.use('/api/configs', configsRoutes);
app.use('/api/highlights', highlightsRoutes);
app.use('/api/pros', prosRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadsRoutes);

// Unknown /api routes → JSON 404 (so the SPA fallback below never turns an API
// miss into an HTML page).
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// In production, serve the built frontend from the same origin so that the
// browser's `/api` requests hit this server (no separate host / proxy needed).
// Build it with `npm run build` (repo root) → `dist/`, or set FRONTEND_DIR.
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = process.env.FRONTEND_DIR
  ? path.resolve(process.env.FRONTEND_DIR)
  : path.resolve(moduleDir, '../../dist');
if (fs.existsSync(path.join(frontendDir, 'index.html'))) {
  app.use(express.static(frontendDir));
  // SPA fallback: any non-API GET returns index.html.
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next();
    res.sendFile(path.join(frontendDir, 'index.html'), (err) => err && next(err));
  });
  console.log('[server] serving frontend from', frontendDir);
} else {
  console.log('[server] no frontend build at', frontendDir, '— serving API only');
}

// Centralized JSON error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error('[server]', err);
  res.status(status).json({ error: err.message || 'Server error.' });
});

initDb()
  .then(async () => {
    await seedIfEmpty();
    await seedProsIfEmpty();
    // Best-effort pro settings sync (uses source if configured; else HLTV → falls back to seed).
    syncPros({}).catch(() => {});
    // Best-effort initial sync (no-op if no source configured); never blocks boot.
    syncFromSource({})
      .then((r) => {
        if (r.synced) console.log(`[server] command catalog synced from source (${r.count} commands)`);
      })
      .catch(() => {});
    startCommandsScheduler();
    // Watch for CS2 patches and re-sync the catalog whenever the build changes.
    startCs2Watcher();

    app.listen(config.port, () => {
      console.log(`[server] AimKit API listening on http://localhost:${config.port}`);
      console.log(`[server] owner email: ${config.ownerEmail}`);
    });
  })
  .catch((err) => {
    console.error('[server] Failed to initialize database:', err.message);
    process.exit(1);
  });
