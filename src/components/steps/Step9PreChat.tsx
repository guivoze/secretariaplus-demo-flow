import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { MessageCircle, User, Phone, Video, MoreVertical, Send, Zap } from "lucide-react";
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
      scale: 0.98
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.4,
      ease: "easeOut"
    }} className="w-full max-w-lg relative z-10">
        <CustomCard variant="elevated" className="text-center space-y-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1,
          duration: 0.5
        }}>
            <MessageCircle className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground">
              Tá na hora de testar!
            </h2>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="space-y-6">
            <p className="text-foreground leading-relaxed text-base">Finja que você é um lead/paciente e tente agendar uma consulta. Coloque objeções, aja como um paciente típico seu faria.</p>

            <CustomCard variant="bordered" className="bg-gray-50 border-gray-300">
              <p className="font-medium text-foreground text-xs">⚠️ Lembre-se: isto é apenas uma prévia. Na versão completa, tudo será personalizado com suas necessidades.</p>
            </CustomCard>

            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <User className="w-6 h-6 text-gray-800 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Você como<br />Paciente</p>
              </div>
              <div className="text-lg text-muted-foreground">VS</div>
              <div className="text-center">
                <Zap className="w-6 h-6 text-gray-800 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">I.A como<br />Secretária</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }}>
            <CustomButton onClick={nextStep} size="lg" className="px-12">Ir para o chat</CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>;
};