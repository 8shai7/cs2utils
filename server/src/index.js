import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './config.js';
import { initDb } from './db.js';
import { authRoutes } from './routes/authRoutes.js';
import { nadesRoutes } from './routes/nadesRoutes.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { uploadsRoutes } from './routes/uploadsRoutes.js';
import { commandsRoutes } from './routes/commandsRoutes.js';
import { seedIfEmpty, syncFromSource, startCommandsScheduler, startCs2Watcher } from './commandsSync.js';

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
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadsRoutes);

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
