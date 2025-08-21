import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { url, w = '400', q = '70' } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    // Reconstruir URL se necessário
    let targetUrl = url;
    if (!url.startsWith('http')) {
      targetUrl = `https://${url}`;
    }

    // Headers para simular navegador real
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'Referer': 'https://www.instagram.com/',
      'Origin': 'https://www.instagram.com',
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site'
    };

    // Buscar imagem como se fosse um navegador
    const response = await fetch(targetUrl, { headers });

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch image' });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Retornar imagem com cache agressivo
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.status(200).send(Buffer.from(imageBuffer));

  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}