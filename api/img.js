import sharp from 'sharp';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url, w = '300', q = '80' } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    const width = parseInt(w, 10);
    const quality = parseInt(q, 10);

    // Reconstruir URL se necessário
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    // Buscar imagem fingindo ser navegador
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    
    // Redimensionar e otimizar com Sharp
    const optimizedBuffer = await sharp(Buffer.from(buffer))
      .resize(width, width, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ 
        quality: quality,
        progressive: true 
      })
      .toBuffer();

    // Headers de cache
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    // Enviar imagem otimizada
    res.send(optimizedBuffer);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}