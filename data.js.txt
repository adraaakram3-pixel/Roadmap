// Vercel Serverless Function
// Reads/writes the whole tracker dataset as one JSON blob in Upstash Redis,
// under a single key, so every visitor sees the same shared data.
//
// A tiny "version" key changes on every save. The page checks only that key
// every 30 seconds and downloads the full roadmap only when it changed, which
// keeps database bandwidth very low (the free plan has a monthly limit).
//
//   GET  /api/data        -> { data, version }
//   GET  /api/data?v=1    -> { version }          (cheap change check)
//   POST /api/data        -> saves, returns { ok, version }

const REDIS_KEY = 'roadmap-data';
const VERSION_KEY = 'roadmap-version';

async function redis(cmd) {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!baseUrl || !token) {
    throw Object.assign(new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN environment variables in Vercel project settings.'), { status: 500 });
  }
  const r = await fetch(baseUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  let json;
  try { json = await r.json(); } catch (e) { json = {}; }
  // Never hide a database error as "no data": that is what made a suspended database look empty.
  if (!r.ok || json.error) {
    throw Object.assign(new Error('Database unavailable: ' + (json.error || ('HTTP ' + r.status))), { status: 503 });
  }
  return json.result;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      if (req.query && req.query.v) {
        const version = await redis(['GET', VERSION_KEY]);
        res.status(200).json({ version: version || null });
        return;
      }
      const raw = await redis(['GET', REDIS_KEY]);
      const version = await redis(['GET', VERSION_KEY]);
      res.status(200).json({ data: raw ? JSON.parse(raw) : null, version: version || null });
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!parsed || !Array.isArray(parsed.projects) || !parsed.projects.length) {
        res.status(400).json({ error: 'Refusing to save: no projects in the data.' });
        return;
      }
      const version = String(Date.now());
      const ok = await redis(['SET', REDIS_KEY, body]);
      if (ok !== 'OK') { res.status(500).json({ error: 'Failed to save to Redis' }); return; }
      await redis(['SET', VERSION_KEY, version]);
      res.status(200).json({ ok: true, version });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
