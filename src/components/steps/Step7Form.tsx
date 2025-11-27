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
import { isDisqualifiedLead } from "@/utils/leadQualification";
import { ChevronDown } from "lucide-react";

export const Step7Form = () => {
  const { userData, setUserData, nextStep, sessionId, setCurrentStep } = useSupabaseDemo();
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
  const painPointOptions = [
    { value: "no-secretary", label: "😭 Não tenho secretária/auxiliar e não consigo dar atenção para tudo ao mesmo tempo." },
    { value: "bad-secretary", label: "🐌 Tenho secretária mas ela é \"lentinha\" - Não converte e não aprende." },
    { value: "high-demand", label: "🎯 Rodo anúncios e não aguento a alta demanda de leads" },
    { value: "scale-revenue", label: "💸 Está tudo certo, só quero ganhar mais dinheiro!" }
  ];
  const [showPainOptions, setShowPainOptions] = useState(Boolean(formData.painPoint));
  const selectedPainPoint = painPointOptions.find(option => option.value === formData.painPoint);

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

      // SEMPRE envia webhook demo-session-lead (salva no DB para todos)
      // Mas bloqueia pixel Facebook apenas para leads desqualificados
      if (!isDisqualifiedLead(mergedData.especialidade)) {
        // Lead qualificado: envia pixel + webhook
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
      } else {
        // Lead desqualificado: envia APENAS webhook (não envia pixel)
        console.log('Lead desqualificado - pixel bloqueado, mas webhook demo-session-lead enviado para DB');
        await sendLeadWebhook({
          instagram: mergedData.instagram,
          nome: mergedData.nome,
          email: mergedData.email,
          whatsapp: mergedData.whatsapp,
          especialidade: mergedData.especialidade,
        }, flowType);
      }

      // Mapeamento de códigos para textos completos dos pain points
      const painPointTexts: Record<string, string> = {
        'no-secretary': 'Não tenho secretária/auxiliar e não consigo dar atenção para tudo ao mesmo tempo',
        'bad-secretary': 'Tenho secretária mas ela é "lentinha" - Não converte e não aprende',
        'high-demand': 'Rodo anúncios e não aguento a alta demanda de leads',
        'scale-revenue': 'Está tudo certo, só quero ganhar mais dinheiro'
      };
      
      // Mapeamento de especialidades para área de atuação
      const areaTexts: Record<string, string> = {
        '💉 HOF': 'Harmonização facial',
        '🦷 Odonto': 'Odontologia',
        '🍑 Harmonização Corporal': 'Harmonização Corporal',
        '🫧 Dermato': 'Dermatologia',
        '🪡 Cir. Plástica': 'Cirurgia Plástica',
        'Estética Geral (salão, micro, make)': 'Estética Geral'
      };
      
      const painPointText = painPointTexts[mergedData.painPoint] || mergedData.painPoint;
      const areaText = areaTexts[mergedData.especialidade] || mergedData.especialidade;
      
      // Webhook para micro-offer (background - não bloqueia nextStep)
      console.log('[Micro-offer] Sending webhook with:', { session_id: sessionId, pain_point: painPointText, area: areaText });
      fetch('https://n8nsplus.up.railway.app/webhook/micro-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          pain_point: painPointText,
          area: areaText
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
          // Save with session_id to validate later
          const cacheData = {
            ...offerData,
            session_id: sessionId
          };
          localStorage.setItem('offer-copy', JSON.stringify(cacheData));
          console.log('[Micro-offer] ✅ Cached successfully:', cacheData);
        } else {
          console.warn('[Micro-offer] ⚠️ No valid offer data in response. Full response:', JSON.stringify(data, null, 2));
        }
      })
      .catch(err => {
        console.error('[Micro-offer] ❌ Error:', err);
        console.error('[Micro-offer] ❌ Error details:', err.message, err.stack);
      });

      // DECISÃO FINAL: Se for lead desqualificado, pula direto para step 13
      if (isDisqualifiedLead(mergedData.especialidade)) {
        console.log('Lead desqualificado detectado - pulando para tela de desqualificação');
        setCurrentStep(13);
      } else {
        // Lead qualificado: segue fluxo normal
        nextStep();
      }
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
  return <div className="h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-zinc-900">
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
    }} className="w-full max-w-lg relative z-10 max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden">
        <CustomCard variant="elevated" className="space-y-6 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="text-left space-y-4">
            <h1 className="text-foreground dark:text-white leading-tight font-bold" style={{ fontSize: '1.7rem', lineHeight: '1.2' }}>
              MUITO legal, {firstName}!
            </h1>
            <p className="text-foreground dark:text-white leading-relaxed text-base">
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
            <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
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

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-zinc-400">
                  Para personalizar sua experiência
                </p>
                <p className="text-sm font-semibold text-foreground dark:text-white">
                  Qual seu MAIOR problema hoje?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {painPointOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, painPoint: option.value }));
                    }}
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-left group
                      ${formData.painPoint === option.value 
                        ? 'border-black bg-black/5 dark:border-white dark:bg-white/10 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-400 dark:border-zinc-700 dark:hover:border-zinc-600 bg-background dark:bg-zinc-900 hover:shadow-sm'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                        ${formData.painPoint === option.value 
                          ? 'border-black dark:border-white bg-white dark:bg-black' 
                          : 'border-gray-300 dark:border-zinc-600 group-hover:border-gray-400 dark:group-hover:border-zinc-500'}
                      `}>
                        {formData.painPoint === option.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white" />
                        )}
                      </div>
                      <span className={`text-sm leading-relaxed transition-colors ${formData.painPoint === option.value ? 'font-medium text-foreground dark:text-white' : 'text-muted-foreground dark:text-zinc-300 group-hover:text-foreground dark:group-hover:text-white'}`}>
                        {option.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
            <CustomButton onClick={handleSubmit} disabled={!isFormValid || isSubmitting} className="w-full text-white bg-black hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200" size="lg">
              {isSubmitting ? 'Enviando...' : 'Conversar com minha nova secretária →'}
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>;
};