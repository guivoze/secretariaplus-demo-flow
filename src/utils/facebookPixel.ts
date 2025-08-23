// Configuração do Facebook Pixel
export const FACEBOOK_PIXEL_CONFIG = {
  pixelId: '1245486659923087',
  conversionApiToken:
    'EAARpggKMPi0BPdxUqL28mTFJlUIlkFmZBcWH5NTm0pZAYg15EMB3LX6rlgK1ZBDXpvZBAPB1MQoJMKrGTgodAXh74quZCGXAnZA33VPaHu3SwZAlQzPB8CdWBe0C0ZCKJqXdr3gU5trgUUcsihEReeDE0dZClZCWuQNCnMeYqrx8Nn5gQC9srjD6Iy0oFARLnTfks5RQZDZD',
  testEventCode: null, // Adicione aqui se tiver um código de teste
  // Configurações adicionais
  enableEnhancedEcommerce: true,
  enableAdvancedMatching: true,
  enableAutomaticAdvancedMatching: true,
};

// Tipagem de dados do usuário utilizados nos eventos de Lead
export interface AIInsights {
  name?: string;
  where?: string;
  procedure1?: string;
  procedure2?: string;
  procedure3?: string;
}

export interface LeadUserData {
  instagram: string;
  nome: string;
  email: string;
  whatsapp: string;
  especialidade: string;
  eventID?: string;
  fbp?: string | null;
  fbc?: string | null;
  external_id?: string | null;
  faturamento?: string;
  followers?: string;
  posts?: string;
  clinicName?: string;
  procedures?: string[];
  aiInsights?: AIInsights;
}

interface TrackResult {
  success: boolean;
  response?: unknown;
  error?: unknown;
  reason?: string;
}

// Função para disparar evento via Conversion API (server-side)
export const trackConversionApi = async (
  eventName: string,
  parameters: Record<string, unknown>
): Promise<TrackResult> => {
  try {
    const response = await fetch('/api/facebook-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        parameters,
        pixelId: FACEBOOK_PIXEL_CONFIG.pixelId,
        accessToken: FACEBOOK_PIXEL_CONFIG.conversionApiToken,
      }),
    });

    if (response.ok) {
      console.log(`[Facebook Conversion API] Evento "${eventName}" enviado com sucesso`);
      return { success: true, response: await response.json() };
    }

    console.error(`[Facebook Conversion API] Erro ao enviar evento "${eventName}"`);
    return { success: false, error: await response.json() };
  } catch (error) {
    console.error('[Facebook Conversion API] Erro na requisição:', error);
    return { success: false, error };
  }
};

// Função para disparar evento "Lead" via Conversion API com dados enriquecidos
export const trackLeadConversionApi = async (
  userData: LeadUserData
): Promise<TrackResult> => {
  // Filtrar leads de "Estética Geral" - não são considerados leads válidos
  if (userData.especialidade === 'Estética Geral (salão, micro, make)') {
    console.log('[Facebook Conversion API] Lead filtrado - especialidade "Estética Geral" não é considerada lead válido');
    return { success: false, reason: 'filtered_specialty' };
  }

  // Dados básicos do evento
  const baseParameters = {
    content_name: 'Demo SecretáriaPlus - Free Test',
    content_category: 'Lead Generation',
    content_type: 'product',
    content_ids: ['demo_secretariaplus'],
    value: 1.00,
    currency: 'BRL',
  };

  // Dados do usuário para atribuição avançada
  const userParameters = {
    // Dados pessoais
    instagram: userData.instagram,
    nome: userData.nome,
    email: userData.email,
    whatsapp: userData.whatsapp,
    especialidade: userData.especialidade,
    
    // Dados do negócio
    faturamento: userData.faturamento || 'N/A',
    clinic_name: userData.clinicName || 'N/A',
    
    // Dados do Instagram para segmentação
    followers_count: userData.followers || 'N/A',
    posts_count: userData.posts || 'N/A',
    
    // Dados de procedimentos para segmentação
    procedures: userData.procedures?.join(', ') || 'N/A',
    
    // Insights de IA para segmentação avançada
  ai_insights_name: userData.aiInsights?.name || 'N/A',
  ai_insights_location: userData.aiInsights?.where || 'N/A',
  ai_insights_procedure1: userData.aiInsights?.procedure1 || 'N/A',
  ai_insights_procedure2: userData.aiInsights?.procedure2 || 'N/A',
  ai_insights_procedure3: userData.aiInsights?.procedure3 || 'N/A',
    
    // Dados de contexto para atribuição
    lead_source: 'Instagram Demo',
    lead_medium: 'Web Demo',
    lead_campaign: 'SecretáriaPlus Free Test',
    
    // Dados de comportamento
    demo_step: 'Lead Complete',
    completion_time: new Date().toISOString(),
    
    // Dados de segmentação por especialidade
    specialty_category: getSpecialtyCategory(userData.especialidade),
    specialty_tier: getSpecialtyTier(userData.especialidade, userData.faturamento),
    
    // Dados de valor do lead
    lead_value_score: calculateLeadScore(userData),
    lead_quality: assessLeadQuality(userData),
    
    // Dados adicionais para riqueza
    external_id: userData.external_id || `${userData.instagram}_${Date.now()}`,
    content_language: 'pt_BR',
    delivery_category: 'home_delivery',
  };

  const identificationParameters = {
    eventID: userData.eventID,
    fbp: userData.fbp,
    fbc: userData.fbc,
    external_id: userData.external_id,
  };

  const parameters = { ...baseParameters, ...userParameters, ...identificationParameters };

  return await trackConversionApi('Lead', parameters);
};

// Função para categorizar especialidades
function getSpecialtyCategory(especialidade: string): string {
  const categories = {
    'HOF': 'Harmonização Facial',
    'Odonto': 'Odontologia',
    'Harmonização Corporal': 'Harmonização Corporal',
    'Dermato': 'Dermatologia',
    'Cir. Plástica': 'Cirurgia Plástica',
    'Estética Geral (salão, micro, make)': 'Estética Geral'
  };
  return categories[especialidade] || 'Outros';
}

// Função para classificar tier da especialidade
function getSpecialtyTier(especialidade: string, faturamento?: string): string {
  const highValue = ['HOF', 'Cir. Plástica', 'Harmonização Corporal'];
  const mediumValue = ['Dermato', 'Odonto'];
  const lowValue = ['Estética Geral (salão, micro, make)'];
  
  if (lowValue.includes(especialidade)) return 'Filtered Out';
  if (highValue.includes(especialidade)) return 'High Value';
  if (mediumValue.includes(especialidade)) return 'Medium Value';
  return 'Unknown';
}

// Função para calcular score do lead
function calculateLeadScore(userData: LeadUserData): number {
  let score = 0;
  
  // Base score
  score += 10;
  
  // Especialidade
  if (['HOF', 'Cir. Plástica'].includes(userData.especialidade)) score += 20;
  else if (['Dermato', 'Harmonização Corporal'].includes(userData.especialidade)) score += 15;
  else if (['Odonto'].includes(userData.especialidade)) score += 10;
  else score += 5;
  
  // Faturamento
  if (userData.faturamento) {
    const fat = userData.faturamento.toLowerCase();
    if (fat.includes('100k') || fat.includes('200k') || fat.includes('500k')) score += 15;
    else if (fat.includes('50k') || fat.includes('80k')) score += 10;
    else if (fat.includes('20k') || fat.includes('30k')) score += 5;
  }
  
  // Instagram data
  if (userData.followers) {
    const followers = parseInt(userData.followers.replace(/[^\d]/g, ''));
    if (followers > 10000) score += 10;
    else if (followers > 5000) score += 7;
    else if (followers > 1000) score += 5;
  }
  
  return Math.min(score, 100);
}

// Função para avaliar qualidade do lead
function assessLeadQuality(userData: LeadUserData): string {
  const score = calculateLeadScore(userData);
  
  if (score >= 80) return 'Premium';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Standard';
}

// Função para verificar se o pixel está carregado
export const isPixelLoaded = (): boolean => {
  return typeof window !== 'undefined' &&
    typeof (window as { fbq?: unknown }).fbq === 'function';
};

// Função para aguardar o pixel carregar
export const waitForPixel = (): Promise<void> => {
  return new Promise((resolve) => {
    if (isPixelLoaded()) {
      resolve();
      return;
    }
    
    const checkPixel = () => {
      if (isPixelLoaded()) {
        resolve();
      } else {
        setTimeout(checkPixel, 100);
      }
    };
    
    checkPixel();
  });
};
