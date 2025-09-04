import { useCallback } from 'react';
import { trackLeadConversionApi } from '@/utils/facebookPixel';

declare global {
  interface Window {
    fbq: any;
    generateEventId: () => string;
    getExternalId: () => string;
    getFbp: () => string | null;
    getFbc: () => string | null;
    updateFacebookAdvancedMatching: (userData: any) => void;
  }
}

// Função para obter dados enriquecidos completos (sem PII e sem eventID)
const getEnrichedData = () => {
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return {
    // IDs de tracking (somente identificadores de sessão/contexto)
    external_id: window.getExternalId ? window.getExternalId() : null,
    fbp: window.getFbp ? window.getFbp() : null,
    fbc: getAllowedFbc(),

    // Dados temporais
    event_day: days[now.getDay()],
    event_day_in_month: now.getDate().toString(),
    event_month: months[now.getMonth()],
    event_time: now.getTime(),
    event_time_interval: getTimeInterval(now.getHours()),

    // Dados geográficos (genéricos)
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
  const updateAdvancedMatching = useCallback((userData: any) => {
    if (window.updateFacebookAdvancedMatching) {
      window.updateFacebookAdvancedMatching(userData);
    }
  }, []);

  // Aceita options no 4º argumento (ex.: { eventID })
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>, options?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      const enrichedParams = {
        ...getEnrichedData(),
        ...parameters,
      };
      try {
        if (options && Object.keys(options).length > 0) {
          window.fbq('track', eventName, enrichedParams, options);
        } else {
          window.fbq('track', eventName, enrichedParams);
        }
        console.log(`[Facebook Pixel] Evento "${eventName}" disparado:`, enrichedParams, options ? { options } : '');
      } catch (e) {
        console.error('[Facebook Pixel] Erro ao disparar evento:', e);
      }
    }
  }, []);

  const trackLead = useCallback(async (userData: {
    instagram: string;
    nome: string;
    email: string;
    whatsapp: string;
    especialidade: string;
  }) => {
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

    // Atualiza AM (em, ph, fn, ln, external_id) corretamente
    updateAdvancedMatching(normalizedUser);

    // Gera eventId único a ser compartilhado com o Pixel (options) e CAPI
    const eventId = window.generateEventId ? window.generateEventId() : 'evt_' + Date.now();

    // Parâmetros do Pixel (sem PII no 3º argumento)
    const parameters = {
      content_name: 'Demo SecretáriaPlus - Free Test',
      content_category: 'Lead Generation',
      content_type: 'product',
      content_ids: ['demo_secretariaplus'],
      value: 1.0,
      currency: 'BRL',
      instagram: normalizedUser.instagram,
      nome_length: normalizedUser.nome ? normalizedUser.nome.length : undefined,
      especialidade: normalizedUser.especialidade,
    };

    // Dispara via Pixel com eventID no 4º argumento (options) — deduplicação
    trackEvent('Lead', parameters, { eventID: eventId });

    // Dispara via Conversion API com o mesmo eventID
    try {
      const fbp = window.getFbp ? window.getFbp() : null;
      const fbc = getAllowedFbc();
      const external_id = window.getExternalId ? window.getExternalId() : null;

      await trackLeadConversionApi({
        ...normalizedUser,
        eventID: eventId,
        fbp,
        fbc,            // só quando sessão atual é FB/IG
        external_id,    // será hash no backend
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

// Intervalo de horas em blocos
function getTimeInterval(hour: number): string {
  if (hour >= 0 && hour < 6) return '0-6';
  if (hour >= 6 && hour < 12) return '6-12';
  if (hour >= 12 && hour < 18) return '12-18';
  return '18-24';
}

// Fonte de tráfego simples — prioriza UTM
function getTrafficSource(): string {
  try {
    const url = new URL(window.location.href);
    const utm = url.searchParams.get('utm_source')?.toLowerCase();
    if (utm) return utm;
  } catch {}
  const referrer = (document.referrer || '').toLowerCase();
  if (!referrer) return 'direct';
  if (referrer.includes('google')) return 'google';
  if (referrer.includes('facebook')) return 'facebook';
  if (referrer.includes('instagram')) return 'instagram';
  if (referrer.includes('t.co') || referrer.includes('twitter') || referrer.includes('x.com')) return 'twitter';
  return 'referral';
}

// ——— Helpers para bloquear fbc fora de sessão FB/IG ———
function detectFacebookSession(): boolean {
  try {
    const url = new URL(window.location.href);
    const utm = url.searchParams.get('utm_source')?.toLowerCase();
    const fbclid = url.searchParams.get('fbclid');
    const ref = (document.referrer || '').toLowerCase();
    return Boolean(
      fbclid ||
      utm === 'facebook' ||
      utm === 'instagram' ||
      ref.includes('facebook') ||
      ref.includes('instagram')
    );
  } catch {
    return false;
  }
}

function isFacebookSession(): boolean {
  if (typeof window === 'undefined') return false;
  const current = detectFacebookSession();
  const saved = sessionStorage.getItem('fb_session');
  // Promove para '1' se detectar FB na navegação atual
  if (current) {
    if (saved !== '1') sessionStorage.setItem('fb_session', '1');
    return true;
  }
  // Se nunca vimos nada, inicializa
  if (saved === null) {
    sessionStorage.setItem('fb_session', '0');
    return false;
  }
  // Mantém o estado anterior na mesma sessão
  return saved === '1';
}

function getAllowedFbc(): string | null {
  return isFacebookSession() && window.getFbc ? window.getFbc() : null;
}
