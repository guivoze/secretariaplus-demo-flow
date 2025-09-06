import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useClarity } from "@/hooks/useClarity";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Zap } from "lucide-react";
import { useEffect } from "react";

export const Step16CTALegacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { userData } = useSupabaseDemo();
  const clarity = useClarity({ 
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID || "t5ehdfteyd" 
  });

  const handleConsultorClick = () => {
    // Tracking para flow legacy
    clarity.trackConversion('consultor_legacy', userData);
    
    clarity.trackInteraction('consultor_click', {
      flow_type: 'legacy',
      user_specialty: userData.especialidade || 'unknown',
      has_instagram_data: userData.hasInstagramData ? 'true' : 'false'
    });
    
    const message = `Oi! Acabei de fazer meu teste gratuito do SecretáriaPlus e tenho interesse em conversar com um consultor sobre a implementação na minha clínica de ${userData.especialidade || 'saúde'}.

Meu nome é ${userData.nome || 'não informado'}.`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5511936191391&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
              {userData?.nome?.split(' ')[0] ? `${userData.nome.split(' ')[0]}, ` : ''}Parabéns! Você completou seu teste gratuito do SecretáriaPlus
            </h1>
            <p className="text-gray-700 text-base px-2 leading-relaxed">
              Nossa equipe está pronta para <span className="font-semibold text-gray-900">implementar sua secretária virtual em menos de 24 horas</span> na sua clínica.
            </p>
          </motion.div>

          {/* CTA Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CustomCard variant="elevated" className="p-8 space-y-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Fale com Nossa Consultora</h2>
                </div>
                
                <div className="space-y-4 text-left text-gray-700 mb-8 text-base">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span><strong>Implementação em 24h:</strong> Sua secretária funcionando amanhã mesmo</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span><strong>Configuração personalizada:</strong> Adaptada para sua especialidade</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span><strong>Suporte completo:</strong> Treinamento da equipe incluído</span>
                  </div>
                </div>
                
                <button
                  onClick={handleConsultorClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Falar com Consultora Agora
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  💬 Resposta em menos de 2 minutos
                </p>
              </div>
            </CustomCard>
          </motion.div>

          {/* Footer motivacional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-600 text-sm px-4 pb-8"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-gray-600" />
                <span className="font-bold text-gray-800 text-base">Atendimento Humanizado</span>
              </div>
              <p className="text-gray-700 font-regular">Nossa consultora vai tirar todas suas dúvidas e te guiar na implementação perfeita para sua clínica.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
