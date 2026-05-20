export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

    // Basic admin authentication matching 7467 credentials
    const adminPassword = req.headers['x-admin-password'] || req.body?.password;
    if (adminPassword !== '7467') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized access. Invalid password.'
      });
    }

    const payload = req.body.data;
    if (!payload) {
      return res.status(400).json({
        success: false,
        error: 'Missing payload data.'
      });
    }

    // Save to Vercel KV under key 'amasra_site_data'
    // Using robust Upstash REST API command array style ["SET", "key", "value"]
    // This is the absolute safest way to avoid escaping and serialization issues.
    const response = await fetch(kvUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['SET', 'amasra_site_data', JSON.stringify(payload)])
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
      message: 'Data successfully synchronized with Vercel KV bulut veritabani!'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Increase bodyParser limit to 4.5mb (Vercel max serverless payload limit)
// This resolves the HTTP 413 (Payload Too Large) error when saving compressed base64 images
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4.5mb'
    }
  }
};
