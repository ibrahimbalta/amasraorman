export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Prevent browser & CDN caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!kvUrl || !kvToken) {
      return res.status(200).json({
        success: false,
        error: 'Vercel KV or Upstash Redis environment variables are missing.'
      });
    }

    // Support fetching multiple image keys at once via query param
    // e.g. /api/get-image?keys=img_hero_bg,img_service_0,img_service_1
    const keysParam = req.query.keys || '';
    if (!keysParam) {
      return res.status(400).json({ success: false, error: 'Missing keys parameter.' });
    }

    const keys = keysParam.split(',').filter(k => k.trim());
    const images = {};

    // Fetch all keys in parallel
    const fetches = keys.map(async (key) => {
      try {
        const response = await fetch(`${kvUrl}/get/${key.trim()}`, {
          headers: {
            Authorization: `Bearer ${kvToken}`
          }
        });
        const result = await response.json();
        if (result.result) {
          images[key.trim()] = result.result;
        }
      } catch (e) {
        // Skip failed individual keys
      }
    });

    await Promise.all(fetches);

    return res.status(200).json({
      success: true,
      images: images
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
