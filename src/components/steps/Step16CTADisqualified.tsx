import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useClarity } from "@/hooks/useClarity";
import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect } from "react";

export const Step16CTADisqualified = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { userData } = useSupabaseDemo();
  const clarity = useClarity({ 
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID || "t5ehdfteyd" 
  });

  // Track quando usuário chega na página de desqualificação
  useEffect(() => {
    if (userData.especialidade) {
      clarity.trackDisqualification(userData.especialidade, userData);
    }
  }, [userData, clarity]);

  const benefits = [
    "Sua I.A treinada e configurada em 1 dia",
    "Atendimento 24h sem pausas",
    "Agenda Automática",
    "CRM integrado que se alimenta sozinho",
    "Follow-up automático",
    "Notificações de emergência médica"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 py-8">
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl"
        >
          <CustomCard variant="elevated" className="text-center space-y-8 relative">
            {/* Confetti effect */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
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
            {/* Logo */}
            <div className="flex items-center justify-center min-h-[80px]">
              <img 
                src="/imgs/logo-blk.svg" 
                alt="Logo SecretariaPlus" 
                className="w-16 h-16"
              />
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
            {/* Texto informativo ao invés do botão */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <p className="text-lg font-semibold text-blue-800">
                Um consultor entrará em contato em até 24h
              </p>
            </div>

            <div className="text-gray-600 text-sm">
              <p>
                Recebemos seus dados e nossa equipe analisará o melhor plano para seu negócio.
              </p>
            </div>
          </motion.div>
        </CustomCard>
        </motion.div>
      </div>
    </div>
  );
};
