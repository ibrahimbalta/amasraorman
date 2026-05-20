export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
      return res.status(200).json({
        success: false,
        error: 'Vercel KV is not connected yet.'
      });
    }

    const response = await fetch(`${kvUrl}/get/amasra_site_data`, {
      headers: {
        Authorization: `Bearer ${kvToken}`
      }
    });

    const result = await response.json();
    
    let siteData = null;
    if (result.result) {
      siteData = JSON.parse(result.result);
    }

    return res.status(200).json({
      success: true,
      data: siteData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
