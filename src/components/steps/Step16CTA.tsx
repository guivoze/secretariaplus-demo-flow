import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
import { Rocket, AlertTriangle, CheckCircle, Phone, MessageCircle } from "lucide-react";

export const Step16CTA = () => {
  const { userData } = useDemo();

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
            <h1 className="text-4xl font-bold text-primary">
              SecretáriaPlus
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Rocket className="w-12 h-12 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Agora é hora de colocar a I.A pra funcionar na sua clínica a todo vapor!
              </h2>
            </div>

            <p className="text-xl text-muted-foreground">
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
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

            <div className="flex items-center justify-center gap-2 text-red-500 font-semibold">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">
                Atenção: Só conseguimos atender 3 novas clínicas por semana.
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-primary/10 border border-primary rounded-xl p-6"
          >
            <h3 className="font-bold text-foreground mb-3">
              🎁 Seus dados já foram pré-preenchidos!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>👤 {userData.nome}</div>
              <div>📱 @{userData.instagram}</div>
              <div>🏥 {userData.especialidade}</div>
              <div>📧 {userData.email}</div>
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