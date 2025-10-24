import { useState, useEffect } from 'react';
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useClarity } from "@/hooks/useClarity";
import { useFlowType } from "@/hooks/useFlowType";
import { motion } from "framer-motion";
import { CustomInput } from "@/components/ui/custom-input";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { sendLeadWebhook } from "@/utils/webhook";
import { sanitizeValue } from "@/utils/sanitize";

export const Step7Form = () => {
  const { userData, setUserData, nextStep, sessionId } = useSupabaseDemo();
  const { trackLead } = useFacebookPixel();
  const flowType = useFlowType();
  const clarity = useClarity({ 
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID || "t5ehdfteyd" 
  });
  
  const [formData, setFormData] = useState({
    email: sanitizeValue(userData.email),
    whatsapp: sanitizeValue(userData.whatsapp),
    painPoint: sanitizeValue(userData.painPoint)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pegar primeiro nome e dados da análise do Instagram
  const firstName = sanitizeValue(userData.nome) ? sanitizeValue(userData.nome).split(' ')[0] : '';
  const procedure1 = sanitizeValue(userData.aiInsights?.procedure1);
  const location = sanitizeValue(userData.aiInsights?.where);
  const hasProcedure = !!(procedure1 && procedure1.trim());
  const hasLocation = !!(location && location.trim());
  const backgroundImage = userData.realProfilePic || null;
  
  const isValidEmail = (email: string) => {
    // Simples validação RFC 5322-like (suficiente para UX)
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  };
  
  const isFormValid = isValidEmail(formData.email) && formData.whatsapp && formData.painPoint && !isSubmitting;
  
  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const mergedData = {
        ...userData,
        email: formData.email,
        whatsapp: formData.whatsapp,
        painPoint: formData.painPoint,
      };

      setUserData({
        email: mergedData.email,
        whatsapp: mergedData.whatsapp,
        painPoint: mergedData.painPoint,
      });

      // Track lead capture no Clarity
      clarity.trackFunnelEvent('lead_captured', 7, mergedData);
      clarity.trackInteraction('form_submission', {
        has_email: mergedData.email ? 'true' : 'false',
        has_whatsapp: mergedData.whatsapp ? 'true' : 'false',
        specialty: mergedData.especialidade || 'unknown',
        pain_point: mergedData.painPoint || 'unknown'
      });

      // Dispara pixel do Facebook e webhook de lead simultaneamente
      await Promise.all([
        trackLead({
          instagram: mergedData.instagram,
          nome: mergedData.nome,
          email: mergedData.email,
          whatsapp: mergedData.whatsapp,
          especialidade: mergedData.especialidade,
        }),
        sendLeadWebhook({
          instagram: mergedData.instagram,
          nome: mergedData.nome,
          email: mergedData.email,
          whatsapp: mergedData.whatsapp,
          especialidade: mergedData.especialidade,
        }, flowType)
      ]);

      // Webhook para micro-offer (background - não bloqueia nextStep)
      console.log('[Micro-offer] Sending webhook with:', { session_id: sessionId, pain_point: mergedData.painPoint });
      fetch('https://n8nsplus.up.railway.app/webhook/micro-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          pain_point: mergedData.painPoint
        })
      })
      .then(response => {
        console.log('[Micro-offer] Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('[Micro-offer] Response data:', data);
        console.log('[Micro-offer] Has offer_copy?', !!data.offer_copy);
        
        // Verifica se offer_copy existe como objeto, senão usa os dados direto do root
        const offerData = data.offer_copy || data;
        
        if (offerData.head_father) {
          localStorage.setItem('offer-copy', JSON.stringify(offerData));
          console.log('[Micro-offer] ✅ Cached successfully:', offerData);
        } else {
          console.warn('[Micro-offer] ⚠️ No valid offer data in response. Full response:', JSON.stringify(data, null, 2));
        }
      })
      .catch(err => {
        console.error('[Micro-offer] ❌ Error:', err);
        console.error('[Micro-offer] ❌ Error details:', err.message, err.stack);
      });

      nextStep();
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      // Reset para permitir nova tentativa
      setIsSubmitting(false);
    }
  };
  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{0,5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    return value;
  };
  return <div className="h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background image com overlay escuro - AJUSTE O BRIGHTNESS AQUI */}
      {backgroundImage && <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${backgroundImage})`,
      filter: 'brightness(0.5)' // 0.1=muito escuro, 0.5=médio, 0.8=claro, 1.0=original
    }} />}
      
      <motion.div initial={{
      opacity: 0,
      y: 30
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="w-full max-w-lg relative z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <CustomCard variant="elevated" className="space-y-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="text-left space-y-4">
            <h1 className="text-foreground leading-tight text-2xl md:text-3xl font-bold">
              MUITO legal, {firstName}!
            </h1>
            <p className="text-foreground leading-relaxed text-lg">
              {hasProcedure && <>
                  Já vimos que você se destaca com{' '}
                  <span className="font-semibold">{procedure1}</span>
                  {hasLocation && <>
                      {' '}e atende em <span className="font-semibold">{location}</span>
                    </>}
                  .
                </>}
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.15
        }} className="space-y-2">
            <p className="text-muted-foreground leading-relaxed">
              Pra gente enriquecer ainda mais o treinamento da IA, falta só um detalhe:
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="space-y-4">
            <CustomInput label="Qual seu melhor e-mail?" type="email" placeholder="draana@gmail.com" value={formData.email} onChange={e => setFormData(prev => ({
            ...prev,
            email: e.target.value
          }))} inputMode="email" autoComplete="email" autoCorrect="off" autoCapitalize="none" />

            <CustomInput label="Qual Seu WhatsApp + DDD?" placeholder="11999999999" value={formData.whatsapp} onChange={e => setFormData(prev => ({
            ...prev,
            whatsapp: formatWhatsApp(e.target.value)
          }))} />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Qual seu MAIOR problema hoje?
              </label>
              <select
                value={formData.painPoint}
                onChange={e => setFormData(prev => ({ ...prev, painPoint: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione...</option>
                <option value="no-secretary">😭 Não tenho secretária/auxiliar e não consigo dar atenção para tudo ao mesmo tempo.</option>
                <option value="bad-secretary">🐌 Tenho secretária mas ela é "lentinha" - Não converte e não aprende.</option>
                <option value="high-demand">🎯 Rodo anúncios e não aguento a alta demanda de leads</option>
                <option value="scale-revenue">💸 Está tudo certo, só quero ganhar mais dinheiro!</option>
              </select>
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="space-y-3">
            <CustomButton onClick={handleSubmit} disabled={!isFormValid || isSubmitting} className="w-full" size="lg">
              {isSubmitting ? 'Enviando...' : 'Conversar com minha nova secretária →'}
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>;
};