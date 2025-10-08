import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { MessageCircle, User, Phone, Video, MoreVertical, Send, Zap, AlertTriangle } from "lucide-react";
export const Step9PreChat = () => {
  const {
    nextStep,
    userData
  } = useSupabaseDemo();
  const WhatsAppPreview = () => {
    const timestamp = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return <div className="absolute inset-0 min-h-screen bg-[#e5ddd5] pointer-events-none">
        {/* Header */}
        <div className="bg-[#075e54] text-white flex items-center gap-3 shadow-lg" style={{
          height: '72px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '4px',
          paddingBottom: '4px'
        }}>
          <div className="w-10 h-10 rounded-full bg-black/10 overflow-hidden flex items-center justify-center">
            {userData.realProfilePic ? <img src={userData.realProfilePic} alt="profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-black bg-primary">
                {(userData.instagram || 'SP').charAt(0).toUpperCase()}
              </div>}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{userData.aiInsights?.name || userData.instagram || 'SecretáriaPlus'}</h3>
            <p className="text-xs text-[#ffffff]/[0.61]">online</p>
          </div>
          <div className="flex gap-4">
            <Video className="w-5 h-5" />
            <Phone className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>

        {/* One greeting message bubble (static) */}
        <div className="p-4 space-y-3">
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-2xl shadow-sm bg-white text-black rounded-bl-md">
              <p className="text-sm">Olá, tudo bom? Como posso ajudar você? 🤩</p>
              <div className="flex items-center gap-1 mt-1 justify-start">
                <span className="text-xs text-gray-500">{timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disabled input area - manter abaixo do blur/modal */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#f0f0f0] p-4 border-t">
          <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
            <input type="text" placeholder="Digite uma mensagem" className="flex-1 outline-none" style={{
            fontSize: '16px'
          }} disabled />
            <button disabled className="text-gray-400">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>;
  };
  return <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* WhatsApp preview background */}
      <WhatsAppPreview />
      {/* Dim + blur fixed overlays (no animation) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />

      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.5,
      ease: "easeOut"
    }} className="w-full max-w-lg relative z-10">
        <CustomCard variant="elevated" className="text-center space-y-8 py-10 px-6">
          {/* Ícone de alerta com animação de destaque */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.5
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.1,
          duration: 0.5,
          type: "spring",
          stiffness: 200
        }} className="flex justify-center">
            <div className="relative">
              <motion.div animate={{
              scale: [1, 1.1, 1]
            }} transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }} className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl" />
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center shadow-xl">
                <AlertTriangle className="w-10 h-10 text-gray-900" strokeWidth={2.5} />
              </div>
            </div>
          </motion.div>

          {/* Título principal */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2,
          duration: 0.5
        }} className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              IMPORTANTE
            </h2>
            <p className="text-lg font-medium text-gray-700">
              Seu teste foi liberado, mas...
            </p>
          </motion.div>

          {/* Card de aviso */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3,
          duration: 0.5
        }}>
            <CustomCard variant="bordered" className="bg-yellow-50/50 border-yellow-300 text-left space-y-4 p-5">
              <div className="space-y-4 text-gray-800">
                <p className="leading-relaxed">
                  <b>As respostas não estarão perfeitas</b> - A IA ainda não te conhece 100%.
                </p>
                <p className="leading-relaxed">
                  Ela foi treinada apenas com os seus dados publicos do Instagram <b>de forma superficial</b> enquanto você preenchia as informações.
                </p>
              </div>
            </CustomCard>
          </motion.div>

          {/* Card de benefícios */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4,
          duration: 0.5
        }}>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-4 border border-gray-200">
              <p className="font-semibold text-gray-900 text-base">
                Ao contratar um plano, você poderá customizar absolutamente tudo:
              </p>
              <div className="space-y-2 text-left text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold">-</span>
                  <span>Procedimentos</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold">-</span>
                  <span>Horários</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold">-</span>
                  <span>Tom de voz</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gray-900 font-bold">-</span>
                  <span>Ser mais, ou menos direta</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Call to action final */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5,
          duration: 0.5
        }} className="space-y-4 pt-2">
            <p className="text-gray-900 font-medium text-base flex items-center justify-center gap-2">
              Mas tá na hora de sentir um gostinho! ✨
            </p>
            <CustomButton onClick={nextStep} size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 text-lg shadow-lg">
              Entendi, testar agora →
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>;
};