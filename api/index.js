// Vercel serverless entry: reuse the Express app, ensuring the DB is initialized
// once per cold start before handling requests.
import app, { ready } from '../src/index.js';

export default async function handler(req, res) {
  try {
    await ready;
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Backend failed to initialize (database?).' }));
    console.error('[vercel] init failed:', err);
    return;
  }
  return app(req, res);
}
