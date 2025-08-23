import { useState } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { CustomInput } from "@/components/ui/custom-input";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { motion } from "framer-motion";

export const Step7Form = () => {
  const { userData, setUserData, nextStep } = useSupabaseDemo();
  const { trackLead } = useFacebookPixel();
  
  const [formData, setFormData] = useState({
    email: userData.email || '',
    whatsapp: userData.whatsapp || ''
  });

  // Pegar primeiro nome e dados da análise do Instagram
  const firstName = userData.nome ? userData.nome.split(' ')[0] : '';
  const procedure1 = userData.aiInsights?.procedure1 || '';
  const location = userData.aiInsights?.where || '';
  const hasProcedure = !!(procedure1 && procedure1.trim());
  const hasLocation = !!(location && location.trim());
  const backgroundImage = userData.realProfilePic || null;
  
  const isValidEmail = (email: string) => {
    // Simples validação RFC 5322-like (suficiente para UX)
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  };
  
  const isFormValid = isValidEmail(formData.email) && formData.whatsapp;
  
  const handleSubmit = async () => {
    if (isFormValid) {
      const mergedData = {
        ...userData,
        email: formData.email,
        whatsapp: formData.whatsapp,
      };

      setUserData({
        email: mergedData.email,
        whatsapp: mergedData.whatsapp,
      });

      await trackLead({
        instagram: mergedData.instagram,
        nome: mergedData.nome,
        email: mergedData.email,
        whatsapp: mergedData.whatsapp,
        especialidade: mergedData.especialidade,
      });

      nextStep();
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
            <CustomInput label="Qual Seu WhatsApp + DDD?" placeholder="11999999999" value={formData.whatsapp} onChange={e => setFormData(prev => ({
            ...prev,
            whatsapp: formatWhatsApp(e.target.value)
          }))} />

            <CustomInput label="Qual seu melhor e-mail?" type="email" placeholder="draana@gmail.com" value={formData.email} onChange={e => setFormData(prev => ({
            ...prev,
            email: e.target.value
          }))} inputMode="email" autoComplete="email" autoCorrect="off" autoCapitalize="none" />
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
            <CustomButton onClick={handleSubmit} disabled={!isFormValid} className="w-full" size="lg">Conversar com minha nova secretária →</CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>;
};