// API route para Facebook Conversion API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventName, parameters, pixelId, accessToken } = req.body;

    if (!eventName || !parameters || !pixelId || !accessToken) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Obter dados enriquecidos do servidor
    const enrichedData = getServerEnrichedData(req);

    // Preparar dados para o Facebook Conversion API com atribuição avançada
    const conversionData = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: req.headers.referer || 'https://flow.secretariaplus.com.br',
          user_data: {
            em: parameters.email ? hashEmail(parameters.email) : undefined,
            ph: parameters.whatsapp ? hashPhone(parameters.whatsapp) : undefined,
            // Adicionar mais dados de usuário se disponível
            external_id: parameters.instagram ? hashString(parameters.instagram) : undefined,
            // Dados geográficos
            country: enrichedData.country,
            ct: enrichedData.city,
            st: enrichedData.state,
            zp: enrichedData.zip,
            // Dados de contexto
            client_user_agent: req.headers['user-agent'] || 'unknown',
            client_ip_address: enrichedData.ip_address,
          },
          custom_data: {
            // Dados básicos do evento
            content_name: parameters.content_name,
            content_category: parameters.content_category,
            value: parameters.value,
            currency: parameters.currency,
            content_ids: parameters.content_ids,
            content_type: parameters.content_type,
            
            // Dados pessoais do lead
            instagram: parameters.instagram,
            nome: parameters.nome,
            especialidade: parameters.especialidade,
            
            // Dados do negócio
            faturamento: parameters.faturamento,
            clinic_name: parameters.clinic_name,
            
            // Dados do Instagram
            followers_count: parameters.followers_count,
            posts_count: parameters.posts_count,
            
            // Dados de procedimentos
            procedures: parameters.procedures,
            
            // Insights de IA
            ai_insights_name: parameters.ai_insights_name,
            ai_insights_location: parameters.ai_insights_location,
            ai_insights_procedure1: parameters.ai_insights_procedure1,
            ai_insights_procedure2: parameters.ai_insights_procedure2,
            ai_insights_procedure3: parameters.ai_insights_procedure3,
            
            // Dados de contexto para atribuição
            lead_source: parameters.lead_source,
            lead_medium: parameters.lead_medium,
            lead_campaign: parameters.lead_campaign,
            
            // Dados de comportamento
            demo_step: parameters.demo_step,
            completion_time: parameters.completion_time,
            
            // Dados de segmentação
            specialty_category: parameters.specialty_category,
            specialty_tier: parameters.specialty_tier,
            
            // Dados de valor do lead
            lead_value_score: parameters.lead_value_score,
            lead_quality: parameters.lead_quality,
            
            // Dados enriquecidos do servidor
            event_day: enrichedData.event_day,
            event_day_in_month: enrichedData.event_day_in_month,
            event_month: enrichedData.event_month,
            event_time: enrichedData.event_time,
            event_time_interval: enrichedData.event_time_interval,
            
            // Dados geográficos
            country: enrichedData.country,
            ct: enrichedData.city,
            st: enrichedData.state,
            zp: enrichedData.zip,
            
            // Dados de contexto
            traffic_source: enrichedData.traffic_source,
            plugin: enrichedData.plugin,
            plugin_info: enrichedData.plugin_info,
            
            // Dados de dispositivo
            user_agent: req.headers['user-agent'] || 'unknown',
            ip_address: enrichedData.ip_address,
            timezone: enrichedData.timezone,
            
            // Dados de página
            page_title: enrichedData.page_title,
            page_id: enrichedData.page_id,
            
            // Dados adicionais para riqueza
            external_id: parameters.external_id || `${parameters.instagram}_${Date.now()}`,
            content_language: 'pt_BR',
            delivery_category: 'home_delivery',
            
            // Dados de UTM se disponível
            utm_source: req.headers['x-utm-source'] || enrichedData.utm_source || 'direct',
            utm_medium: req.headers['x-utm-medium'] || enrichedData.utm_medium || 'none',
            utm_campaign: req.headers['x-utm-campaign'] || enrichedData.utm_campaign || 'none',
          },
        },
      ],
      access_token: accessToken,
      test_event_code: null, // Adicione aqui se tiver um código de teste
    };

    // Enviar para o Facebook Conversion API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversionData),
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log('[Facebook Conversion API] Sucesso:', result);
      console.log('[Facebook Conversion API] Dados enviados:', JSON.stringify(conversionData, null, 2));
      return res.status(200).json({ success: true, result });
    } else {
      console.error('[Facebook Conversion API] Erro:', result);
      return res.status(response.status).json({ error: result });
    }
  } catch (error) {
    console.error('[Facebook Conversion API] Erro interno:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Função para obter dados enriquecidos do servidor
function getServerEnrichedData(req) {
  const now = new Date();
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  
  return {
    // Dados temporais
    event_day: now.toLocaleDateString('en-US', { weekday: 'long' }),
    event_day_in_month: now.getDate().toString(),
    event_month: now.toLocaleDateString('en-US', { month: 'long' }),
    event_time: now.getTime(),
    event_time_interval: getTimeInterval(now),
    
    // Dados geográficos (simulados - em produção usar serviço real)
    country: 'BR',
    city: 'São Paulo',
    state: 'SP',
    zip: '00000-000',
    
    // Dados de contexto
    traffic_source: getTrafficSource(req),
    plugin: 'SecretáriaPlus Demo',
    plugin_info: 'https://flow.secretariaplus.com.br',
    
    // Dados de dispositivo
    ip_address: ip,
    timezone: 'America/Sao_Paulo',
    
    // Dados de página
    page_title: 'SecretáriaPlus - Free Test',
    page_id: 'demo_flow',
    
    // Dados de UTM
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'none',
  };
}

// Função para determinar intervalo de tempo
function getTimeInterval(date) {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return '6-12';
  if (hour >= 12 && hour < 18) return '12-18';
  if (hour >= 18 && hour < 24) return '18-24';
  return '0-6';
}

// Função para determinar fonte de tráfego
function getTrafficSource(req) {
  const referrer = req.headers.referer;
  if (!referrer) return 'Direct';
  if (referrer.includes('google')) return 'Google';
  if (referrer.includes('facebook')) return 'Facebook';
  if (referrer.includes('instagram')) return 'Instagram';
  if (referrer.includes('vercel')) return 'Vercel';
  return 'Referral';
}

// Função para hash do email (SHA256)
function hashEmail(email) {
  // Em produção, use uma biblioteca de hash real
  // Aqui é apenas um exemplo simplificado
  return btoa(email.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '');
}

// Função para hash do telefone (SHA256)
function hashPhone(phone) {
  // Em produção, use uma biblioteca de hash real
  // Aqui é apenas um exemplo simplificado
  const cleanPhone = phone.replace(/\D/g, '');
  return btoa(cleanPhone).replace(/[^a-zA-Z0-9]/g, '');
}

// Função para hash de string genérica
function hashString(str) {
  // Em produção, use uma biblioteca de hash real
  // Aqui é apenas um exemplo simplificado
  return btoa(str.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '');
}
