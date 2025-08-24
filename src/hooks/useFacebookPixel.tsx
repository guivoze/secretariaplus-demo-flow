import { useCallback } from 'react';
import { trackLeadConversionApi, LeadUserData } from '@/utils/facebookPixel';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    generateEventId: () => string;
    getExternalId: () => string;
    getFbp: () => string | null;
    getFbc: () => string | null;
  }
}

// Função para obter dados enriquecidos completos
const getEnrichedData = () => {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    // IDs de tracking não sensíveis (sem eventID aqui - vai no 4º argumento)
    external_id: window.getExternalId ? window.getExternalId() : null,
    fbp: window.getFbp ? window.getFbp() : null,
    fbc: window.getFbc ? window.getFbc() : null,

    // Dados temporais
    event_day: days[now.getDay()],
    event_day_in_month: now.getDate().toString(),
    event_month: months[now.getMonth()],
    event_time: now.getTime(),
    event_time_interval: getTimeInterval(now.getHours()),

    // Dados de contexto (sem PII geográfico)
    traffic_source: getTrafficSource(),
    plugin: 'SecretáriaPlus Demo',
    plugin_info: 'https://flow.secretariaplus.com.br',

    // Dados de dispositivo
    user_agent: navigator.userAgent,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    // Dados de página
    page_title: document.title,
    event_source_url: window.location.href,
    event_url: window.location.href,
    content_language: 'pt_BR'
  };
};

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('55') ? '+' + digits : '+55' + digits;
}

export const useFacebookPixel = () => {
  const trackEvent = useCallback(
    (eventName: string, parameters?: Record<string, unknown>, eventData?: Record<string, unknown>) => {
      if (typeof window !== 'undefined' && window.fbq) {
        const enrichedParams = {
          ...getEnrichedData(),
          ...parameters,
        };
        
        // Se eventData foi fornecido (para deduplicação), incluí-lo como 4º parâmetro
        if (eventData) {
          window.fbq('track', eventName, enrichedParams, eventData);
          console.log(`[Facebook Pixel] Evento "${eventName}" disparado com eventID:`, eventData);
        } else {
          window.fbq('track', eventName, enrichedParams);
          console.log(`[Facebook Pixel] Evento "${eventName}" disparado:`, enrichedParams);
        }
      }
    },
    []
  );

  const trackLead = useCallback(async (userData: LeadUserData) => {
    // Filtrar Estética Geral
    if (userData.especialidade === 'Estética Geral (salão, micro, make)') {
      console.log('[Facebook Pixel] Lead filtrado - Estética Geral');
      return;
    }

    // Normalizar dados sensíveis para Advanced Matching
    const normalizedEmail = normalizeEmail(userData.email);
    const normalizedPhone = normalizePhone(userData.whatsapp);
    const normalizedUser = {
      email: normalizedEmail,
      ph: normalizedPhone,
      fn: userData.nome ? userData.nome.split(' ')[0] : undefined,
      ln: userData.nome ? userData.nome.split(' ').slice(1).join(' ') : undefined,
      external_id: window.getExternalId ? window.getExternalId() : null,
    };

    // Gerar event_id ÚNICO para deduplicação (CRÍTICO)
    const eventId = window.generateEventId ? window.generateEventId() : 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Parâmetros básicos para o pixel (SEM dados sensíveis)
    const pixelParameters = {
      content_name: 'Demo SecretáriaPlus - Free Test',
      content_category: 'Lead Generation',
      content_type: 'product',
      content_ids: ['demo_secretariaplus'],
      value: 1.0,
      currency: 'BRL',
      // Dados de contexto (não sensíveis)
      instagram: userData.instagram,
      especialidade: userData.especialidade,
      faturamento: userData.faturamento || 'N/A',
      clinic_name: userData.clinicName || 'N/A',
      lead_source: 'Instagram Demo',
      lead_medium: 'Web Demo',
      lead_campaign: 'SecretáriaPlus Free Test',
    };

    // CORRETO: Advanced Matching no 3º argumento do evento Lead
    const amParams = {
      em: normalizedEmail,
      ph: normalizedPhone,
      fn: normalizedUser.fn,
      ln: normalizedUser.ln,
      external_id: normalizedUser.external_id,
    };

    // Dispara via Pixel com Advanced Matching CORRETO e eventID para deduplicação
    trackEvent('Lead', { ...pixelParameters, ...amParams }, { eventID: eventId });

    // Dispara via Conversion API com o MESMO eventID
    try {
      await trackLeadConversionApi({
        instagram: userData.instagram,
        nome: userData.nome,
        email: normalizedEmail,
        whatsapp: normalizedPhone,
        especialidade: userData.especialidade,
        eventID: eventId, // MESMO ID para deduplicação
        fbp: window.getFbp ? window.getFbp() : null,
        fbc: window.getFbc ? window.getFbc() : null,
        external_id: window.getExternalId ? window.getExternalId() : null,
        faturamento: userData.faturamento,
        followers: userData.followers,
        posts: userData.posts,
        clinicName: userData.clinicName,
        procedures: userData.procedures,
        aiInsights: userData.aiInsights,
      });
    } catch (error) {
      console.error('[Facebook Pixel] Erro na Conversion API:', error);
    }
  }, [trackEvent]);

  return {
    trackEvent,
    trackLead,
    trackPageView: () => trackEvent('PageView'),
    trackCustomEvent: trackEvent,
  };
};

function getTimeInterval(hour: number): string {
  if (hour >= 0 && hour < 6) return '0-6';
  if (hour >= 6 && hour < 12) return '6-12';
  if (hour >= 12 && hour < 18) return '12-18';
  return '18-24';
}

function getTrafficSource(): string {
  const referrer = document.referrer.toLowerCase();
  if (!referrer) return 'Direct';
  if (referrer.includes('google')) return 'Google';
  if (referrer.includes('facebook')) return 'Facebook';
  if (referrer.includes('instagram')) return 'Instagram';
  return 'Referral';
}
