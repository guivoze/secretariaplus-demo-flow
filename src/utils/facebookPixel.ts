// Configuração do Facebook Pixel (VERSÃO SEGURA)
// Token removido do frontend por segurança - agora gerenciado pelo backend
export const FACEBOOK_PIXEL_CONFIG = {
  pixelId: '1245486659923087', // Public pixel ID - seguro manter no frontend
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
        // Token removido - será obtido pelo backend via variável de ambiente
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

  // CRÍTICO: Garantir que event_source_url seja sempre enviado
  const eventSourceUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : 'https://flow.secretariaplus.com.br';

  // Dados básicos do evento
  const baseParameters = {
    content_name: 'Demo SecretáriaPlus - Free Test',
    content_category: 'Lead Generation',
    content_type: 'product',
    content_ids: ['demo_secretariaplus'],
    value: 1.00,
    currency: 'BRL',
    // CRÍTICO: URL da fonte do evento para atribuição correta
    event_source_url: eventSourceUrl,
  };

  // Dados do usuário para atribuição avançada (NUNCA enviar PII cru como custom param)
  // Só enviar dados não sensíveis como custom params
  const userParameters = {
    instagram: userData.instagram,
    especialidade: userData.especialidade,
    faturamento: userData.faturamento || 'N/A',
    clinic_name: userData.clinicName || 'N/A',
    followers_count: userData.followers || 'N/A',
    posts_count: userData.posts || 'N/A',
    procedures: userData.procedures?.join(', ') || 'N/A',
    ai_insights_name: userData.aiInsights?.name || 'N/A',
    ai_insights_location: userData.aiInsights?.where || 'N/A',
    ai_insights_procedure1: userData.aiInsights?.procedure1 || 'N/A',
    ai_insights_procedure2: userData.aiInsights?.procedure2 || 'N/A',
    ai_insights_procedure3: userData.aiInsights?.procedure3 || 'N/A',
    lead_source: 'Instagram Demo',
    lead_medium: 'Web Demo',
    lead_campaign: 'SecretáriaPlus Free Test',
    demo_step: 'Lead Complete',
    completion_time: new Date().toISOString(),
    specialty_category: getSpecialtyCategory(userData.especialidade),
    specialty_tier: getSpecialtyTier(userData.especialidade, userData.faturamento),
    lead_value_score: calculateLeadScore(userData),
    lead_quality: assessLeadQuality(userData),
    content_language: 'pt_BR',
    delivery_category: 'home_delivery',
  };

  // Identificação para deduplicação e atribuição (CRÍTICO)
  const identificationParameters = {
    eventID: userData.eventID || ('evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)),
    fbp: userData.fbp,
    fbc: userData.fbc,
    external_id: userData.external_id,
    // PII (email, nome, telefone) será enviado via user_data no backend
    email: userData.email, // Será hasheado no backend
    whatsapp: userData.whatsapp, // Será hasheado no backend
    nome: userData.nome, // Será hasheado no backend
  };

  // Nunca envie email, nome, telefone, cidade, UF, CEP, país como custom param
  // Eles só devem ser enviados via Advanced Matching do Pixel (browser) ou user_data (server)
  const parameters = { ...baseParameters, ...userParameters, ...identificationParameters };

  // Disparar evento no servidor
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
