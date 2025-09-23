import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { CreditCard, Headphones, UserCheck, CheckCircle, Sparkles } from "lucide-react";
import { useEffect } from "react";

export const Step13Features = () => {
  const { nextStep } = useSupabaseDemo();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center p-4 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md pb-8"
      >
        <CustomCard variant="elevated" className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-2"
          >
            <Sparkles className="w-6 h-6 text-gray-900" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Além de tudo isso...
            </h1>
          </motion.div>

          {/* CRM Automático */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Placeholder para imagem do CRM */}
            <div className="bg-gray-100 rounded-lg p-8 border border-gray-200 flex items-center justify-center min-h-[140px] overflow-hidden">
              <img 
                src="/imgs/crm.webp" 
                alt="Interface do CRM automático" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                CRM Automático
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Você terá um CRM que se alimenta e
                arrasta os cards sozinho pra você 😍
              </p>
              <p className="text-sm text-gray-600 italic">
                - pra quem não tem paciência de
                gerenciar ferramentas
              </p>
            </div>
          </motion.div>

          {/* Escuta Áudio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Placeholder para imagem do áudio */}
            <div className="bg-gray-100 rounded-lg p-8 border border-gray-200 flex items-center justify-center min-h-[160px] overflow-hidden">
              <img 
                src="/imgs/audio.webp" 
                alt="Processamento de áudio" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Escuta Áudio
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Ela ouve áudios, responde quantos
                pacientes precisar, tem um leve delay
                para favorecer a ideia de humanização...
              </p>
              <p className="text-sm text-gray-600 italic">
                - Muitos dos nossos clientes usam, e as
                pessoas nem percebem que é uma IA 🤫
              </p>
            </div>
          </motion.div>

          {/* Follow Up */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Placeholder para imagem do follow-up */}
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200 min-h-[200px] overflow-hidden">
              <img 
                src="/imgs/follow up.webp" 
                alt="Interface de follow-up" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                FollowUp
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Se o paciente te der um vácuo, a própria
                IA dá aquela cutucadinha pra ele voltar o
                papo e prosseguir
              </p>
            </div>
          </motion.div>

          {/* Notificações (novo item, após Follow Up) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="space-y-6"
          >
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200 min-h-[160px] overflow-hidden">
              <img
                src="/imgs/step14.webp"
                alt="Notificações de emergência e agendamentos"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Notificações</h2>
              <p className="text-gray-700 leading-relaxed">
                Caso ocorram emergências, agendamentos e situações que exijam sua atenção,
                você recebe um aviso e cai direto na conversa para lidar na íntegra.
              </p>
            </div>
          </motion.div>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8"
          >
            <CustomButton
              onClick={nextStep}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-lg font-medium text-lg"
            >
              Continuar →
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};