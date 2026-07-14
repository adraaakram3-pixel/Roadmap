// Vercel Serverless Function
// Reads/writes the whole tracker dataset as one JSON blob in Upstash Redis,
// under a single key, so every visitor sees the same shared data.

const REDIS_KEY = 'roadmap-data';

module.exports = async (req, res) => {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!baseUrl || !token) {
    res.status(500).json({
      error: 'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN environment variables in Vercel project settings.'
    });
    return;
  }

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${baseUrl}/get/${REDIS_KEY}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await r.json();
      const data = json.result ? JSON.parse(json.result) : null;
      res.status(200).json({ data });
      return;
    }

    if (req.method === 'POST') {
      const value = JSON.stringify(req.body);
      const r = await fetch(`${baseUrl}/set/${REDIS_KEY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain'
        },
        body: value
      });
      const json = await r.json();
      if (json.result !== 'OK') {
        res.status(500).json({ error: 'Failed to save to Redis', detail: json });
        return;
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
