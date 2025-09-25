// Vercel Serverless Function
module.exports = async (req, res) => {
  const ALLOW_ORIGIN = 'https://maple.inc'; // adjust for staging if needed
  const DUB_API_KEY = process.env.DUB_API_KEY; // set this in Vercel env vars

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const r = await fetch('https://api.dub.co/track/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DUB_API_KEY}` // 🔑 required
      },
      body: JSON.stringify(req.body || {}),
    });

    const text = await r.text();
    res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
    res.setHeader('Content-Type', 'application/json');
    return res.status(r.status).send(text);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
    return res.status(500).json({ error: 'Proxy error', detail: String(e) });
  }
};
