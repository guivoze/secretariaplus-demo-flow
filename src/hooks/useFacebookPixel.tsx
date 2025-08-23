import { useCallback } from 'react';
import { trackLeadConversionApi } from '@/utils/facebookPixel';

declare global {
  interface Window {
    fbq: any;
  }
}

export const useFacebookPixel = () => {
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
      console.log(`[Facebook Pixel] Evento "${eventName}" disparado:`, parameters);
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
      window.fbq('track', 'PageView');
      console.log('[Facebook Pixel] PageView disparado');
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
    
    if (highValue.includes(especialidade)) return 'High Value';
    if (mediumValue.includes(especialidade)) return 'Medium Value';
    if (lowValue.includes(especialidade)) return 'Standard Value';
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
