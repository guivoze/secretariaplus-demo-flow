import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect } from "react";

export const Step16CTA = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { userData } = useSupabaseDemo();

  const handlePlanClick = (planUrl: string, planName: string) => {
    // Tracking opcional se necessário
    console.log(`Plan selected: ${planName}`);
    window.open(planUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 py-8">
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg space-y-6"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-4 mb-8"
          >
            <div className="flex items-center justify-center min-h-[60px]">
              <img 
                src="/imgs/logo-blk.svg" 
                alt="Logo SecretariaPlus" 
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight px-2">
              Agora é hora de colocar a I.A pra funcionar no WhatsApp da sua clínica a todo vapor!
            </h1>
            <p className="text-gray-700 text-lg px-2">
              Para escanear o QR code e ativar sua nova secretária em menos de 5 minutos, basta escolher um plano.
            </p>
          </motion.div>

          {/* Plano Basic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CustomCard variant="elevated" className="p-6 space-y-4 border-2 border-gray-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">plano basic</h2>
                
                <div className="space-y-2 text-left text-gray-700 mb-6">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">-</span>
                    <span>Configure procedimentos, seus horários, jeito de falar da IA e muito mais</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">-</span>
                    <span>Atendimento 24h</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">-</span>
                    <span>Agenda automática</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">-</span>
                    <span>Follow up automático</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">-</span>
                    <span>Notificações (emergência, agendamentos)</span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-4">497/mês</div>
                
                <button
                  onClick={() => handlePlanClick('https://pay.kiwify.com.br/uo9AbpE', 'Basic')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Iniciar Agora
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </CustomCard>
          </motion.div>

          {/* Plano Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CustomCard variant="elevated" className="p-6 space-y-4 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">plano pro</h2>
                
                <div className="space-y-2 text-left text-gray-700 mb-6">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">-</span>
                    <span>tudo do basic</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">-</span>
                    <span>CRM automático</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">-</span>
                    <span>Suporte dedicado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600">-</span>
                    <div className="flex items-center gap-2">
                      <span>WhatsApp verificado (API meta cloud)</span>
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-4">997/mês</div>
                
                <button
                  onClick={() => handlePlanClick('https://pay.kiwify.com.br/Meup5i9', 'Pro')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Iniciar Agora
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </CustomCard>
          </motion.div>

          {/* Footer motivacional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-600 text-sm px-4 pb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">Setup em menos de 5 minutos</span>
            </div>
            <p>Sua secretária IA estará funcionando hoje mesmo!</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
