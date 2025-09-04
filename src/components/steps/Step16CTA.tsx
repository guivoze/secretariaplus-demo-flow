import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useClarity } from "@/hooks/useClarity";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Calendar, MessageSquare, Settings, Users, Zap, Shield, Star } from "lucide-react";
import { useEffect } from "react";

export const Step16CTA = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { userData } = useSupabaseDemo();
  const clarity = useClarity({ 
    projectId: process.env.REACT_APP_CLARITY_PROJECT_ID || "t5ehdfteyd" 
  });

  const handlePlanClick = (planUrl: string, planName: string) => {
    // Tracking avançado no Clarity para conversões
    clarity.trackConversion(planName, userData);
    
    // Tracking adicional da interação
    clarity.trackInteraction('plan_click', {
      plan_name: planName,
      user_specialty: userData.especialidade || 'unknown',
      has_instagram_data: userData.hasInstagramData ? 'true' : 'false'
    });
    
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
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight px-2">
              {userData?.nome?.split(' ')[0] ? `${userData.nome.split(' ')[0]}, ` : ''}Agora é hora de colocar a I.A pra funcionar no WhatsApp da sua clínica a todo vapor!
            </h1>
            <p className="text-gray-700 text-base px-2 leading-relaxed">
              Para escanear o QR code e ativar sua nova <span className="font-semibold text-gray-900">secretária em menos de 5 minutos</span>, basta escolher um plano.
            </p>
          </motion.div>

          {/* Plano Basic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CustomCard variant="elevated" className="p-6 space-y-4 border-2 border-gray-200 bg-white">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">Plano Basic</h2>
                
                <div className="space-y-3 text-left text-gray-700 mb-6 text-sm">
                  <div className="flex items-start gap-3">
                    <Settings className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span>Configure procedimentos, seus horários, jeito de falar da IA e muito mais</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span>Notificações (emergência, agendamentos)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span>Atenda seus pacientes 24/7</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span>Follow up automático</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span>Agenda automática</span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-6">
                  R$ 497<span className="text-lg text-gray-600">/mês</span>
                </div>
                
                <button
                  onClick={() => handlePlanClick('https://pay.kiwify.com.br/uo9AbpE', 'Basic')}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
            <CustomCard variant="elevated" className="p-6 space-y-4 border-2 border-gray-600 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
              {/* Badge Popular */}
              <div className="absolute -top-1 -right-1">
                <div className="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <img 
                    src="/imgs/7641727.png" 
                    alt="Meta Verified" 
                    className="w-6 h-6"
                  />
                  <h2 className="text-xl font-bold text-gray-900 capitalize">Plano Pro</h2>
                </div>
                
                <div className="space-y-3 text-left text-gray-700 mb-6 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-600 font-medium text-sm mt-0.5 flex-shrink-0">+</span>
                    <span className="font-medium">Tudo do Basic</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span>CRM automático</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span>Suporte dedicado</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <img 
                      src="/imgs/7641727.png" 
                      alt="Meta Verified" 
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <div><strong>WhatsApp Verificado</strong></div>
                      <div className="text-xs text-gray-500">(API Meta Cloud)</div>
                    </div>
                  </div>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-2">
                  R$ 997<span className="text-lg text-gray-600">/mês</span>
                </div>
                <p className="text-xs text-gray-500 font-medium mb-6">Mais escolhido pelos profissionais</p>
                
                <button
                  onClick={() => handlePlanClick('https://pay.kiwify.com.br/Meup5i9', 'Pro')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-gray-600" />
                <span className="font-bold text-gray-800 text-base">Setup em menos de 5 minutos</span>
              </div>
              <p className="text-gray-700 font-medium">Sua nova secretária estará funcionando hoje mesmo, sem parafernálha tecnológica. Cuidamos de tudo pra você.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};