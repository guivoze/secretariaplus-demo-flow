interface LeadWebhookData {
  name_1: string;
  email_1: string;
  phone_1: string;
  text_1: string; // instagram
  select_3: string; // especialidade
  text_2?: string; // utm_source
  text_3?: string; // utm_medium
  text_4?: string; // utm_campaign
  text_5?: string; // utm_content
  text_6?: string; // utm_term
  referer_url: string;
  current_url: string;
  form_title: string;
  entry_time: string;
}

interface LeadData {
  instagram: string;
  nome: string;
  email: string;
  whatsapp: string;
  especialidade: string;
}

const getUTMParams = () => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
  };
};

export const sendLeadWebhook = async (leadData: LeadData): Promise<void> => {
  try {
    const utmParams = getUTMParams();
    const currentTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    const webhookData: LeadWebhookData = {
      name_1: leadData.nome,
      email_1: leadData.email,
      phone_1: leadData.whatsapp,
      text_1: leadData.instagram,
      select_3: leadData.especialidade,
      text_2: utmParams.utm_source,
      text_3: utmParams.utm_medium,
      text_4: utmParams.utm_campaign,
      text_5: utmParams.utm_content,
      text_6: utmParams.utm_term,
      referer_url: typeof window !== 'undefined' ? document.referrer : '',
      current_url: typeof window !== 'undefined' ? window.location.href : '',
      form_title: 'Secretaria Plus Demo',
      entry_time: currentTime,
    };

    const response = await fetch('https://n8nsplus.up.railway.app/webhook/demo-session-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    console.log('Lead webhook sent successfully');
  } catch (error) {
    console.error('Error sending lead webhook:', error);
    // Não interromper o fluxo se o webhook falhar
  }
};
