// Vercel serverless entry: reuse the Express app, ensuring the DB is initialized
// once per cold start before handling requests.
import app, { ready } from '../src/index.js';
import { config } from '../src/config.js';

// Mirror the Express `cors` config for responses we send WITHOUT going through
// the app (the init-failure 500 below). Preflight (OPTIONS) and /api/health go
// straight through Express so its cors middleware handles them.
function setCors(req, res) {
  const conf = config.corsOrigin;
  if (conf === '*') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    const origin = req.headers.origin;
    const allowed = conf.split(',').map((s) => s.trim());
    if (origin && allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
}

export default async function handler(req, res) {
  const path = (req.url || '').split('?')[0];

  // Preflight and the health check don't need the DB — let Express (with its
  // cors middleware) handle them so they always carry CORS headers.
  if (req.method === 'OPTIONS' || path === '/api/health') {
    return app(req, res);
  }

  const status = await ready;
  if (!status.ok) {
    setCors(req, res);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Backend failed to initialize.',
        detail: status.error?.code || status.error?.message || String(status.error),
      }),
    );
    return;
  }
  return app(req, res);
}
