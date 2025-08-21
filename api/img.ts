import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOW_HOSTS = [
  'scontent.cdninstagram.com',
  'instagram.fcgk1-1.fna.fbcdn.net',
  'lookaside.instagram.com',
  'scontent.xx.fbcdn.net',
  'instagram.fgru1-1.fna.fbcdn.net',
  'scontent-gru1-1.xx.fbcdn.net',
  'scontent-ams4-1.cdninstagram.com',
  'scontent-gru2-1.cdninstagram.com',
  'scontent-gru1-1.cdninstagram.com',
  'scontent-cgh1-1.cdninstagram.com'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { url, w = '400', q = '70' } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    console.log('Processing URL:', url);

    // Reconstruir URL corretamente se necessário
    let targetUrl = url;
    if (!url.startsWith('http')) {
      targetUrl = `https://${url}`;
    }

    // Verificar se o host é permitido
    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch (parseError) {
      console.error('URL parse error:', parseError);
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Verificação mais flexível de hosts
    const isAllowed = ALLOW_HOSTS.some(host => 
      parsed.hostname === host || 
      parsed.hostname.includes(host) || 
      parsed.hostname.endsWith('.cdninstagram.com') ||
      parsed.hostname.endsWith('.fbcdn.net')
    );

    console.log('Host check:', parsed.hostname, 'Allowed:', isAllowed);

    if (!isAllowed) {
      return res.status(403).json({ 
        error: 'Host not allowed',
        hostname: parsed.hostname 
      });
    }

    // Buscar a imagem original com timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('Fetch response:', response.status, response.statusText);

    if (!response.ok) {
      return res.status(502).json({ 
        error: 'Failed to fetch image',
        status: response.status,
        statusText: response.statusText
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    console.log('Image fetched successfully, size:', imageBuffer.byteLength);

    // Configurar headers de cache agressivo
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.setHeader('CDN-Cache-Control', 'max-age=31536000');
    
    res.status(200).send(Buffer.from(imageBuffer));

  } catch (error) {
    console.error('Image proxy error:', error);
    
    // Erro mais específico
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout' });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}