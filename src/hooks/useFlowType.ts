import { useEffect, useState } from 'react';

export type FlowType = 'default' | 'lead';

export const useFlowType = (): FlowType => {
  const [flowType, setFlowType] = useState<FlowType>('default');

  useEffect(() => {
    const path = window.location.pathname;
    
    if (path.includes('/lead')) {
      setFlowType('lead');
    } else {
      setFlowType('default');
    }
  }, []);

  return flowType;
};

// Helper function para obter webhook URL baseado no flow type
export const getWebhookUrl = (flowType: FlowType): string => {
  if (flowType === 'lead') {
    return 'https://n8nsplus.up.railway.app/webhook/demo-session-lead-giana';
  }
  return 'https://n8nsplus.up.railway.app/webhook/demo-session-lead';
};
