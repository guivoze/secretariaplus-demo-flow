import { useCallback } from 'react';
import { trackLeadConversionApi, LeadUserData } from '@/utils/facebookPixel';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    generateEventId: () => string;
    getExternalId: () => string;
    getFbp: () => string | null;
    getFbc: () => string | null;
    updateFacebookAdvancedMatching: (userData: Record<string, unknown>) => void;
  }
}

// Função para obter dados enriquecidos completos
const getEnrichedData = () => {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    // IDs de tracking
    eventID: window.generateEventId ? window.generateEventId() : 'evt_' + Date.now(),
    external_id: window.getExternalId ? window.getExternalId() : null,
    fbp: window.getFbp ? window.getFbp() : null,
    fbc: window.getFbc ? window.getFbc() : null,

    // Dados temporais
    event_day: days[now.getDay()],
    event_day_in_month: now.getDate().toString(),
    event_month: months[now.getMonth()],
    event_time: now.getTime(),
    event_time_interval: getTimeInterval(now.getHours()),

    // Dados geográficos
    country: 'BR',
    ct: 'São Paulo',
    st: 'SP',
    zp: '00000-000',

    // Dados de contexto
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
  // Atualiza Advanced Matching quando temos dados do usuário
  const updateAdvancedMatching = useCallback(
    (userData: Record<string, unknown>) => {
      if (window.updateFacebookAdvancedMatching) {
        window.updateFacebookAdvancedMatching(userData);
      }
    },
    []
  );

  const trackEvent = useCallback(
    (eventName: string, parameters?: Record<string, unknown>) => {
      if (typeof window !== 'undefined' && window.fbq) {
        const enrichedParams = {
          ...getEnrichedData(),
          ...parameters,
        };
        window.fbq('track', eventName, enrichedParams);
        console.log(`[Facebook Pixel] Evento "${eventName}" disparado:`, enrichedParams);
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

    const normalizedEmail = normalizeEmail(userData.email);
    const normalizedPhone = normalizePhone(userData.whatsapp);
    const normalizedUser = {
      ...userData,
      email: normalizedEmail,
      whatsapp: normalizedPhone,
    };

    updateAdvancedMatching(normalizedUser);

    const eventId = window.generateEventId ? window.generateEventId() : 'evt_' + Date.now();

    const parameters = {
      eventID: eventId,
      external_id: window.getExternalId ? window.getExternalId() : null,
      fbp: window.getFbp ? window.getFbp() : null,
      fbc: window.getFbc ? window.getFbc() : null,
      content_name: 'Demo SecretáriaPlus - Free Test',
      content_category: 'Lead Generation',
      content_type: 'product',
      content_ids: ['demo_secretariaplus'],
      value: 1.0,
      currency: 'BRL',
      email: normalizedEmail,
      phone: normalizedPhone,
      fn: normalizedUser.nome ? normalizedUser.nome.split(' ')[0] : undefined,
      ln: normalizedUser.nome ? normalizedUser.nome.split(' ').slice(1).join(' ') : undefined,
      instagram: normalizedUser.instagram,
      nome: normalizedUser.nome,
      whatsapp: normalizedUser.whatsapp,
      especialidade: normalizedUser.especialidade,
    };

    // Dispara via Pixel
    trackEvent('Lead', parameters);

    // Dispara via Conversion API com o mesmo eventID
    try {
      await trackLeadConversionApi({
        ...normalizedUser,
        eventID: eventId,
        fbp: parameters.fbp,
        fbc: parameters.fbc,
        external_id: parameters.external_id,
      });
    } catch (error) {
      console.error('[Facebook Pixel] Erro na Conversion API:', error);
    }
  }, [trackEvent, updateAdvancedMatching]);

  return {
    trackEvent,
    trackLead,
    trackPageView: () => trackEvent('PageView'),
    trackCustomEvent: trackEvent,
    updateAdvancedMatching
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
