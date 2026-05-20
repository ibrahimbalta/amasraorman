export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-password'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!kvUrl || !kvToken) {
      return res.status(500).json({
        success: false,
        error: 'Vercel KV or Upstash Redis environment variables are missing.'
      });
    }

    // Basic admin authentication
    const adminPassword = req.headers['x-admin-password'] || req.body?.password;
    if (adminPassword !== '7467') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized access. Invalid password.'
      });
    }

    const { key, imageData } = req.body;
    if (!key || !imageData) {
      return res.status(400).json({
        success: false,
        error: 'Missing key or imageData.'
      });
    }

    // Save image to its own KV key (e.g. "img_hero_bg", "img_service_0", etc.)
    const response = await fetch(kvUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['SET', key, imageData])
    });

    const result = await response.json();

    if (result.error) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: `Image saved to KV key: ${key}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Each image is sent individually, so 4.5MB per image is more than enough
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4.5mb'
    }
  }
};
