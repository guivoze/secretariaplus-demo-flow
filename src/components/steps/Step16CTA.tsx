import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { Rocket, AlertTriangle, CheckCircle, Phone, MessageCircle } from "lucide-react";

export const Step16CTA = () => {
  const { userData } = useSupabaseDemo();

  const benefits = [
    "✅ I.A treinada especificamente para estética",
    "✅ Atendimento 24/7 sem pausas",
    "✅ CRM integrado que se alimenta sozinho",
    "✅ Follow-up automático de leads perdidos",
    "✅ Notificações de emergência médica",
    "✅ Configuração em menos de 24h"
  ];

  const handleContact = () => {
    const message = `Olá! Acabei de testar a demonstração da SecretáriaPlus e quero saber mais!

Meus dados:
- Nome: ${userData.nome}
- Instagram: @${userData.instagram}
- Especialidade: ${userData.especialidade}
- Email: ${userData.email}
- WhatsApp: ${userData.whatsapp}

Quero implementar na minha clínica!`;

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <CustomCard variant="elevated" className="text-center space-y-8">
          {/* Confetti effect */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="absolute inset-0 pointer-events-none"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full"
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: Math.random() * 100 + "%",
                  opacity: 0 
                }}
                animate={{ 
                  y: [0, -20, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-2xl font-bold text-gray-800">
              SecretáriaPlus
            </h1>
            <div className="w-24 h-1 bg-gray-800 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Rocket className="w-8 h-8 text-gray-800" />
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Agora é hora de colocar a I.A pra funcionar na sua clínica a todo vapor!
              </h2>
            </div>

            <p className="text-lg text-muted-foreground">
              Vamos juntos nessa? 🚀
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {benefit.replace('✅ ', '')}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="space-y-4"
          >
            <CustomButton
              onClick={handleContact}
              size="lg"
              className="w-full text-lg py-4 flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              Falar com consultor
            </CustomButton>

            <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">
                Atenção: Só conseguimos atender 3 novas clínicas por semana.
              </span>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-xs text-muted-foreground"
          >
            Ao clicar você será direcionado para nosso WhatsApp comercial com seus dados já preenchidos.
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};