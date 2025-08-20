import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOW_HOSTS = [
  'scontent.cdninstagram.com',
  'instagram.fcgk1-1.fna.fbcdn.net',
  'lookaside.instagram.com',
  'scontent.xx.fbcdn.net',
  'instagram.fgru1-1.fna.fbcdn.net',
  'scontent-gru1-1.xx.fbcdn.net'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { url, w = '400', q = '70' } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    const width = parseInt(w as string, 10);
    const quality = parseInt(q as string, 10);

    // Verificar se o host é permitido
    const parsed = new URL(url);
    const isAllowed = ALLOW_HOSTS.some(host => 
      parsed.hostname.includes(host) || parsed.hostname.endsWith(host)
    );

    if (!isAllowed) {
      return res.status(403).json({ error: 'Host not allowed' });
    }

    // Buscar a imagem original
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch image' });
    }

    const imageBuffer = await response.arrayBuffer();
    
    // Configurar headers de cache agressivo
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.setHeader('CDN-Cache-Control', 'max-age=31536000');
    
    // Para desenvolvimento simples, retorna a imagem sem processamento
    // Em produção, você pode adicionar Sharp aqui se quiser redimensionar
    res.status(200).send(Buffer.from(imageBuffer));

  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
