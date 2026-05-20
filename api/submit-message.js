export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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
        error: 'KV environment variables are missing.'
      });
    }

    const message = req.body.message;
    if (!message || !message.name || !message.phone || !message.message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required message fields (name, phone, message).'
      });
    }

    // Read current site data from KV
    const getResponse = await fetch(`${kvUrl}/get/amasra_site_data`, {
      headers: { Authorization: `Bearer ${kvToken}` }
    });
    const getResult = await getResponse.json();

    let siteData = null;
    if (getResult.result) {
      siteData = JSON.parse(getResult.result);
    }

    if (!siteData) {
      return res.status(500).json({
        success: false,
        error: 'Site data not found in cloud database. Please save site data from admin panel first.'
      });
    }

    // Ensure messages array exists
    if (!siteData.messages) {
      siteData.messages = [];
    }

    // Generate unique ID
    const newId = siteData.messages.length > 0
      ? Math.max(...siteData.messages.map(m => m.id)) + 1
      : 1;

    // Build the message object server-side for security
    const newMsg = {
      id: newId,
      name: message.name,
      phone: message.phone,
      email: message.email || '',
      location: message.location || '',
      message: message.message,
      date: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }).slice(0, 16),
      status: 'new'
    };

    // Append message atomically
    siteData.messages.push(newMsg);

    // Save updated data back to KV
    const saveResponse = await fetch(`${kvUrl}/set/amasra_site_data`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSON.stringify(siteData))
    });

    const saveResult = await saveResponse.json();

    if (saveResult.error) {
      return res.status(500).json({
        success: false,
        error: saveResult.error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Keşif talebi başarıyla bulut veritabanına kaydedildi.',
      messageId: newId
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
