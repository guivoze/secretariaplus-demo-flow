import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Phone, MessageCircle } from "lucide-react";

export const Step16CTA = () => {
  const { userData } = useSupabaseDemo();

  const benefits = [
    "Sua I.A treinada e configurada em 1 dia",
    "Atendimento 24h sem pausas",
    "Agenda Automática",
    "CRM integrado que se alimenta sozinho",
    "Follow-up automático",
    "Notificações de emergência médica"
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
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto"
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
            {/* Placeholder para logo SVG */}
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200 flex items-center justify-center min-h-[80px]">
              <div className="text-center space-y-2">
                <div className="text-xs text-gray-500 font-mono">SECRETARIAPLUS_LOGO_SVG_PLACEHOLDER</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
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

            <div className="flex items-center justify-center gap-2 text-gray-600 font-semibold">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">
                Atenção: Só conseguimos atender 4 novas clínicas por semana.
              </span>
            </div>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};