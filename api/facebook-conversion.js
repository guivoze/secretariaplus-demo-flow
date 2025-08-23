import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventName, parameters, pixelId } = req.body;
    
    // Obtém o token da variável de ambiente (configurada na Vercel)
    const accessToken = process.env.FACEBOOK_CONVERSION_API_TOKEN;
    
    if (!eventName || !parameters || !pixelId) {
      return res.status(400).json({ error: 'Missing required parameters: eventName, parameters, pixelId' });
    }
    
    if (!accessToken) {
      return res.status(500).json({ error: 'Facebook Conversion API token not configured. Please set FACEBOOK_CONVERSION_API_TOKEN environment variable.' });
    }

    // Usar o mesmo eventID do pixel ou gerar um novo
    const eventId = parameters.eventID ||
      ('api_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));

    const { email, whatsapp, nome, fbp, fbc, external_id, ...custom_data } = parameters;

    const conversionData = {
      data: [
        {
          event_name: eventName,
          event_id: eventId,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: req.headers.referer || 'https://flow.secretariaplus.com.br',
          user_data: {
            fbp: fbp || undefined,
            fbc: fbc || undefined,
            external_id: external_id ? hashString(external_id) : undefined,
            em: email ? hashEmail(email) : undefined,
            ph: whatsapp ? hashPhone(whatsapp) : undefined,
            fn: nome ? hashString(nome.split(' ')[0]) : undefined,
            ln: nome ? hashString(nome.split(' ').slice(1).join(' ')) : undefined,
            country: hashString(parameters.country || 'br'),
            ct: hashString(parameters.ct || 'sao paulo'),
            st: hashString(parameters.st || 'sp'),
            zp: hashString(parameters.zp || '00000000'),
            client_user_agent: req.headers['user-agent'],
            client_ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          },
          custom_data,
        },
      ],
      access_token: accessToken,
      test_event_code: null,
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversionData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('[Facebook Conversion API] Erro:', result);
      return res.status(response.status).json({ error: result });
    }

    console.log('[Facebook Conversion API] Sucesso:', result);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('[Facebook Conversion API] Erro interno:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function hashEmail(email) {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
}

function hashPhone(phone) {
  const formatted = formatPhoneE164(phone);
  return crypto.createHash('sha256').update(formatted).digest('hex');
}

function hashString(str) {
  return crypto
    .createHash('sha256')
    .update(str.toLowerCase().trim())
    .digest('hex');
}

function formatPhoneE164(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('55') ? '+' + digits : '+55' + digits;
}
