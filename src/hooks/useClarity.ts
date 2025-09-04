import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

interface ClarityConfig {
  projectId: string;
}

interface UserData {
  nome?: string;
  email?: string;
  whatsapp?: string;
  especialidade?: string;
  instagram?: string;
  hasInstagramData?: boolean;
  completion_percentage?: number;
  lead_score?: number;
  faturamento?: string;
}

export const useClarity = (config: ClarityConfig) => {
  useEffect(() => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      // Inicializa o Clarity com o Project ID
      Clarity.init(config.projectId);
      
      console.log('Microsoft Clarity initialized with project ID:', config.projectId);
    }
  }, [config.projectId]);

  // Tracking de events críticos do funil
  const trackFunnelEvent = (eventName: string, stepNumber: number, userData?: Partial<UserData>) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      Clarity.event(`funnel_${eventName}_step_${stepNumber}`);
      
      // Tags para segmentação
      Clarity.setTag('current_step', stepNumber.toString());
      Clarity.setTag('funnel_stage', getFunnelStage(stepNumber));
      
      if (userData) {
        // User properties para análise
        if (userData.especialidade) {
          Clarity.setTag('specialty', userData.especialidade);
          Clarity.setTag('specialty_category', getSpecialtyCategory(userData.especialidade));
        }
        if (userData.faturamento) {
          Clarity.setTag('revenue_tier', userData.faturamento);
        }
        if (userData.hasInstagramData !== undefined) {
          Clarity.setTag('has_instagram_data', userData.hasInstagramData.toString());
        }
      }
    }
  };

  // Tracking de abandono de step específico
  const trackStepAbandonment = (stepNumber: number, timeSpent: number, userData?: Partial<UserData>) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      Clarity.event(`abandonment_step_${stepNumber}`);
      Clarity.setTag('abandonment_point', stepNumber.toString());
      Clarity.setTag('time_spent_seconds', Math.round(timeSpent / 1000).toString());
      Clarity.setTag('abandonment_stage', getFunnelStage(stepNumber));
      
      if (userData?.especialidade) {
        Clarity.setTag('abandoned_specialty', userData.especialidade);
      }
      
      // Upgrade session para análise de abandono
      Clarity.upgrade(`abandonment_step_${stepNumber}`);
    }
  };

  // Tracking de conversão (planos)
  const trackConversion = (planName: string, userData?: Partial<UserData>) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      Clarity.event(`conversion_${planName.toLowerCase()}`);
      Clarity.setTag('conversion_plan', planName);
      Clarity.setTag('conversion_type', 'direct_sale');
      
      if (userData) {
        Clarity.identify(
          userData.email || userData.instagram || 'anonymous',
          undefined,
          'step_16_conversion',
          userData.nome || userData.instagram
        );
        
        if (userData.especialidade) {
          Clarity.setTag('converted_specialty', userData.especialidade);
        }
        if (userData.lead_score) {
          Clarity.setTag('lead_score', userData.lead_score.toString());
        }
      }
      
      // Priorizar sessões de conversão
      Clarity.upgrade(`conversion_${planName}`);
    }
  };

  // Tracking de lead desqualificado
  const trackDisqualification = (especialidade: string, userData?: Partial<UserData>) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      Clarity.event('lead_disqualified');
      Clarity.setTag('disqualification_reason', 'specialty_filter');
      Clarity.setTag('disqualified_specialty', especialidade);
      
      if (userData?.lead_score) {
        Clarity.setTag('disqualified_lead_score', userData.lead_score.toString());
      }
      
      // Upgrade para analisar padrões de desqualificação
      Clarity.upgrade('disqualification_analysis');
    }
  };

  // Tracking de interações específicas
  const trackInteraction = (interactionType: string, details?: Record<string, string>) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      Clarity.event(`interaction_${interactionType}`);
      
      if (details) {
        Object.entries(details).forEach(([key, value]) => {
          Clarity.setTag(`interaction_${key}`, value);
        });
      }
    }
  };

  // Tracking de tempo por step
  const trackStepTime = (stepNumber: number, timeSpent: number, completed: boolean) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      const roundedTime = Math.round(timeSpent / 1000);
      
      Clarity.setTag(`step_${stepNumber}_time`, roundedTime.toString());
      Clarity.setTag(`step_${stepNumber}_completed`, completed.toString());
      
      // Marcar steps que demoram muito (potenciais pontos de fricção)
      if (roundedTime > 60 && !completed) {
        Clarity.event(`friction_step_${stepNumber}`);
        Clarity.setTag('friction_type', 'extended_time');
      }
    }
  };

  // Funções auxiliares para tracking avançado
  const trackEvent = (eventName: string) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      Clarity.event(eventName);
    }
  };

  const setTag = (key: string, value: string | string[]) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      Clarity.setTag(key, value);
    }
  };

  const identify = (customId: string, customSessionId?: string, customPageId?: string, friendlyName?: string) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      Clarity.identify(customId, customSessionId, customPageId, friendlyName);
    }
  };

  const upgradeSession = (reason: string) => {
    if (config.projectId && config.projectId !== "YOUR_CLARITY_PROJECT_ID") {
      Clarity.upgrade(reason);
    }
  };

  return {
    trackEvent,
    setTag,
    identify,
    upgradeSession,
    trackFunnelEvent,
    trackStepAbandonment,
    trackConversion,
    trackDisqualification,
    trackInteraction,
    trackStepTime
  };
};

// Funções auxiliares
function getFunnelStage(stepNumber: number): string {
  if (stepNumber <= 2) return 'awareness';
  if (stepNumber <= 6) return 'personalization';
  if (stepNumber <= 11) return 'demo_experience';
  if (stepNumber <= 15) return 'social_proof';
  return 'conversion';
}

function getSpecialtyCategory(especialidade: string): string {
  const categories = {
    'HOF': 'high_value',
    'Cir. Plástica': 'high_value',
    'Dermato': 'high_value',
    'Odonto': 'medium_value',
    'Harmonização Corporal': 'medium_value',
    'Estética Geral (salão, micro, make)': 'low_value'
  };
  return categories[especialidade as keyof typeof categories] || 'unknown';
}
