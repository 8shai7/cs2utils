// Vercel serverless entry: reuse the Express app, ensuring the DB is initialized
// once per cold start before handling requests.
import app, { ready } from '../src/index.js';

export default async function handler(req, res) {
  // Health check works even if the DB is down, so you can confirm the function runs.
  if (req.url === '/api/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const status = await ready;
  if (!status.ok) {
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
