import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { CreditCard, Headphones, UserCheck, CheckCircle, Sparkles } from "lucide-react";

export const Step13Features = () => {
  const { nextStep } = useSupabaseDemo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        <CustomCard variant="elevated" className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-3"
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
            <div className="bg-gray-100 rounded-lg p-8 border border-gray-200 flex items-center justify-center min-h-[140px]">
              <div className="text-center space-y-2">
                <CreditCard className="w-8 h-8 text-amber-600 mx-auto" />
                <div className="text-xs text-gray-500 font-mono">CRM_INTERFACE_PLACEHOLDER</div>
              </div>
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
            <div className="bg-gray-100 rounded-lg p-8 border border-gray-200 flex items-center justify-center min-h-[160px]">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-20 h-2 bg-green-200 rounded-full">
                    <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-xs text-gray-500 font-mono">AUDIO_PROCESSING_PLACEHOLDER</div>
              </div>
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
            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200 min-h-[200px]">
              <div className="space-y-3">
                {/* Simulação de conversa WhatsApp */}
                <div className="bg-green-100 p-3 rounded-lg max-w-[80%] ml-auto">
                  <div className="text-xs text-gray-500 mb-1">Pati, vi que nossa conversa ficou em aberto...</div>
                  <div className="text-xs text-gray-400">18:29 ✓✓</div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg max-w-[80%] ml-auto">
                  <div className="text-xs text-gray-500 mb-1">Está por aí? 👀</div>
                  <div className="text-xs text-gray-400">18:32 ✓✓</div>
                </div>
                <div className="flex items-center justify-center mt-4">
                  <div className="w-12 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-xs text-gray-500 font-mono">CHAT_PLACEHOLDER</div>
                  </div>
                </div>
              </div>
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
              Testar Agora →
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};