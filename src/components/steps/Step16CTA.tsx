import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useClarity } from "@/hooks/useClarity";
import { FlowType } from "@/hooks/useFlowType";
import { Step16CTALegacy } from "./Step16CTALegacy";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Calendar, MessageSquare, Settings, Users, Zap, Shield, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Step16CTAProps {
  flowType: FlowType;
}

export const Step16CTA = ({ flowType }: Step16CTAProps) => {
  // Se for flow legacy (/lead), renderiza o componente de consultor
  if (flowType === 'lead') {
    return <Step16CTALegacy />;
  }

  // Flow padrão - renderiza os planos
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { userData } = useSupabaseDemo();
  const clarity = useClarity({ 
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID || "t5ehdfteyd" 
  });

  // Estado do switcher de planos
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Estado para o botão do WhatsApp
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Mostrar botão do WhatsApp após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsApp(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Configuração dos planos
  const planConfig = {
    monthly: {
      basic: {
        price: "R$ 497/mês",
        url: "https://pay.kiwify.com.br/Ap8sMvI"
      },
      pro: {
        price: "R$ 997/mês", 
        url: "https://pay.kiwify.com.br/JTGpvzG"
      }
    },
    annual: {
      basic: {
        price: "12x de R$ 397",
        url: "https://pay.kiwify.com.br/CuBpHY7"
      },
      pro: {
        price: "12x de R$ 797",
        url: "https://pay.kiwify.com.br/ld4p1H2"
      }
    }
  };

  const currentPlans = isAnnual ? planConfig.annual : planConfig.monthly;

  const handlePlanClick = (planUrl: string, planName: string) => {
    // Tracking avançado no Clarity para conversões
    clarity.trackConversion(planName, userData);
    
    // Tracking adicional da interação
    clarity.trackInteraction('plan_click', {
      plan_name: planName,
      plan_type: isAnnual ? 'annual' : 'monthly',
      user_specialty: userData.especialidade || 'unknown',
      has_instagram_data: userData.hasInstagramData ? 'true' : 'false'
    });
    
    console.log(`Plan selected: ${planName} (${isAnnual ? 'annual' : 'monthly'})`);
    window.open(planUrl, '_blank');
  };

  const handleWhatsAppClick = () => {
    // Tracking do clique no WhatsApp
    clarity.trackInteraction('whatsapp_click', {
      user_specialty: userData.especialidade || 'unknown',
      plan_type: isAnnual ? 'annual' : 'monthly',
      has_instagram_data: userData.hasInstagramData ? 'true' : 'false'
    });
    
    window.open('https://api.whatsapp.com/send?phone=5511936191391&text=Oi%20Thamara.%20Acabei%20de%20fazer%20meu%20teste%20gratuito%20e%20tenho%20uma%20d%C3%BAvida%20sobre%20o%20Secret%C3%A1riaPlus.', '_blank');
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
                className="w-20 h-20"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight px-2">
              {userData?.nome?.split(' ')[0] ? `${userData.nome.split(' ')[0]}, ` : ''}Agora é hora de colocar a I.A pra funcionar no WhatsApp da sua clínica a todo vapor!
            </h1>
            <p className="text-gray-700 text-base px-2 leading-relaxed">
              Para escanear o QR code e ativar sua nova <span className="font-semibold text-gray-900">secretária em menos de 5 minutos</span>, basta escolher um plano.
            </p>
          </motion.div>

          {/* Plan Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white border-2 border-gray-200 p-2 rounded-xl flex items-center space-x-2 shadow-sm">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 ${
                  !isAnnual 
                    ? 'bg-gray-900 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Plano Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-8 py-3 rounded-lg text-base font-semibold transition-all duration-300 flex flex-col items-center ${
                  isAnnual 
                    ? 'bg-gray-900 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>Plano Anual</span>
                <span className="text-xs font-normal text-gray-400 mt-0.5">2 meses grátis 🔥</span>
              </button>
            </div>
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
                  {isAnnual ? (
                    <><span className="text-lg font-medium text-gray-600">12x de </span>R$ 397</>
                  ) : (
                    <>R$ 497<span className="text-lg text-gray-600">/mês</span></>
                  )}
                </div>
                
                <button
                  onClick={() => handlePlanClick(currentPlans.basic.url, 'Basic')}
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
                <div className="bg-gray-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
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
                  {isAnnual ? (
                    <><span className="text-lg font-medium text-gray-600">12x de </span>R$ 797</>
                  ) : (
                    <>R$ 997<span className="text-lg text-gray-600">/mês</span></>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-regular mb-6">🤍 Mais escolhido pelos profissionais</p>
                
                <button
                  onClick={() => handlePlanClick(currentPlans.pro.url, 'Pro')}
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
              <p className="text-gray-700 font-regular">Sua nova secretária estará funcionando hoje mesmo, sem parafernálha tecnológica. Cuidamos de tudo pra você.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Botão flutuante do WhatsApp */}
      {showWhatsApp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute -top-12 -left-20 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap"
          >
            Alguma dúvida?
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-800"></div>
          </motion.div>
          
          {/* Botão do WhatsApp */}
          <button
            onClick={handleWhatsAppClick}
            className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <img 
              src="/imgs/wpp.webp" 
              alt="WhatsApp" 
              style={{ width: '32px', height: '32px' }}
              className="object-contain"
            />
          </button>
        </motion.div>
      )}
    </div>
  );
};