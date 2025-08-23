import { useCallback } from 'react';
import { trackLeadConversionApi } from '@/utils/facebookPixel';

declare global {
  interface Window {
    fbq: any;
  }
}

// Função para obter dados geográficos e temporais
const getEnrichedData = () => {
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return {
    // Dados temporais
    event_day: now.toLocaleDateString('en-US', { weekday: 'long' }),
    event_day_in_month: now.getDate().toString(),
    event_month: now.toLocaleDateString('en-US', { month: 'long' }),
    event_time: now.getTime(),
    event_time_interval: getTimeInterval(now),
    
    // Dados geográficos (simulados - em produção usar serviço real)
    country: 'BR', // Brasil
    ct: 'São Paulo', // Cidade
    st: 'SP', // Estado
    zp: '00000-000', // CEP
    
    // Dados de contexto
    traffic_source: getTrafficSource(),
    plugin: 'SecretáriaPlus Demo',
    plugin_info: 'https://flow.secretariaplus.com.br',
    
    // Dados de dispositivo
    user_agent: navigator.userAgent,
    timezone: timezone,
    
    // Dados de página
    page_title: document.title,
    event_source_url: window.location.href,
    event_url: window.location.href,
  };
};

// Função para determinar intervalo de tempo
const getTimeInterval = (date: Date): string => {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return '6-12';
  if (hour >= 12 && hour < 18) return '12-18';
  if (hour >= 18 && hour < 24) return '18-24';
  return '0-6';
};

// Função para determinar fonte de tráfego
const getTrafficSource = (): string => {
  const referrer = document.referrer;
  if (!referrer) return 'Direct';
  if (referrer.includes('google')) return 'Google';
  if (referrer.includes('facebook')) return 'Facebook';
  if (referrer.includes('instagram')) return 'Instagram';
  if (referrer.includes('vercel')) return 'Vercel';
  return 'Referral';
};

export const useFacebookPixel = () => {
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      // Enriquecer parâmetros com dados contextuais
      const enrichedParams = {
        ...parameters,
        ...getEnrichedData(),
        // Dados de sessão
        session_id: sessionStorage.getItem('session_id') || 'unknown',
        page_id: window.location.pathname,
      };
      
      window.fbq('track', eventName, enrichedParams);
      console.log(`[Facebook Pixel] Evento "${eventName}" disparado:`, enrichedParams);
    } else {
      console.warn('[Facebook Pixel] fbq não está disponível');
    }
  }, []);

  const trackLead = useCallback(async (userData: {
    instagram: string;
    nome: string;
    email: string;
    whatsapp: string;
    especialidade: string;
    faturamento?: string;
    followers?: string;
    posts?: string;
    clinicName?: string;
    procedures?: string[];
    aiInsights?: any;
  }) => {
    // Filtrar leads de "Estética Geral" - não são considerados leads válidos
    if (userData.especialidade === 'Estética Geral (salão, micro, make)') {
      console.log('[Facebook Pixel] Lead filtrado - especialidade "Estética Geral" não é considerada lead válido');
      return;
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

    // Dados do usuário para atribuição
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
      external_id: `${userData.instagram}_${Date.now()}`,
      content_language: 'pt_BR',
      delivery_category: 'home_delivery',
    };

    const parameters = { ...baseParameters, ...userParameters };

    // Disparar evento no cliente (Pixel)
    trackEvent('Lead', parameters);

    // Disparar evento via Conversion API (server-side) como backup
    try {
      await trackLeadConversionApi(userData);
    } catch (error) {
      console.error('[Facebook Pixel] Erro ao disparar via Conversion API:', error);
    }
  }, [trackEvent]);

  const trackPageView = useCallback(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      const enrichedParams = getEnrichedData();
      window.fbq('track', 'PageView', enrichedParams);
      console.log('[Facebook Pixel] PageView disparado com dados enriquecidos:', enrichedParams);
    }
  }, []);

  const trackCustomEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    trackEvent(eventName, parameters);
  }, [trackEvent]);

  // Função para categorizar especialidades
  const getSpecialtyCategory = (especialidade: string): string => {
    const categories = {
      'HOF': 'Harmonização Facial',
      'Odonto': 'Odontologia',
      'Harmonização Corporal': 'Harmonização Corporal',
      'Dermato': 'Dermatologia',
      'Cir. Plástica': 'Cirurgia Plástica',
      'Estética Geral (salão, micro, make)': 'Estética Geral'
    };
    return categories[especialidade] || 'Outros';
  };

  // Função para classificar tier da especialidade
  const getSpecialtyTier = (especialidade: string, faturamento?: string): string => {
    const highValue = ['HOF', 'Cir. Plástica', 'Harmonização Corporal'];
    const mediumValue = ['Dermato', 'Odonto'];
    const lowValue = ['Estética Geral (salão, micro, make)'];
    
    if (lowValue.includes(especialidade)) return 'Filtered Out';
    if (highValue.includes(especialidade)) return 'High Value';
    if (mediumValue.includes(especialidade)) return 'Medium Value';
    return 'Unknown';
  };

  // Função para calcular score do lead
  const calculateLeadScore = (userData: any): number => {
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
  };

  // Função para avaliar qualidade do lead
  const assessLeadQuality = (userData: any): string => {
    const score = calculateLeadScore(userData);
    
    if (score >= 80) return 'Premium';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Standard';
  };

  return {
    trackEvent,
    trackLead,
    trackPageView,
    trackCustomEvent
  };
};
