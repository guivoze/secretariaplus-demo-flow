import { useState, useEffect } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, MoreVertical, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export const Step2Modal = () => {
  const { nextStep, userData } = useSupabaseDemo();
  const [showMessage, setShowMessage] = useState(false);
  const [messageAnimated, setMessageAnimated] = useState(false);
  const [overlayDarkened, setOverlayDarkened] = useState(false);
  const [overlayBlurred, setOverlayBlurred] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get clinic name from Instagram username (without @)
  const clinicName = userData.instagram || 'nossa clínica';

  // Initial WhatsApp message using Instagram handle
  const initialMessage: Message = {
    id: 1,
    text: 'Olá, tudo bom? Como posso ajudar você? 🤩',
    sender: 'bot',
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };

  useEffect(() => {
    // Show initial message with delay
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 700);

    // Sequence: 0.7s message appears -> 0.7s-3s fixed (2.3s) -> 3s dim+blur together -> 4s modal
    const timer1 = setTimeout(() => {
      // Start darkening and blur together at 3s
      setOverlayDarkened(true);
      setOverlayBlurred(true);
    }, 3000);

    const timer2 = setTimeout(() => {
      // Show modal at 4s
      setShowModal(true);
    }, 4000);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // WhatsApp Background Component (non-interactive) - identical to Step10
  const WhatsAppBackground = () => (
    <div className="chat-preview-container">
      <div className="chat-root pointer-events-none">
      {/* Header com mesmo comportamento do Step10 */}
      <div className="chat-header bg-[#075e54] text-white p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-black">
          {userData.instagram ? userData.instagram.charAt(0).toUpperCase() : 'SP'}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{userData.instagram || 'SecretáriaPlus'}</h3>
          <p className="text-sm text-green-200">online</p>
        </div>
        <div className="flex gap-4">
          <Video className="w-5 h-5" />
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Área de mensagens com padding inferior fixo como Step10 */}
      <div className="chat-messages flex-1 p-4 space-y-3" style={{ paddingBottom: 80 }}>
        {showMessage && (
          <div className="flex justify-start">
            {messageAnimated ? (
              <div className="max-w-[80%] p-3 rounded-2xl shadow-sm bg-white text-black rounded-bl-md">
                <p className="text-sm">{initialMessage.text}</p>
                <div className="flex items-center gap-1 mt-1 justify-start">
                  <span className="text-xs text-gray-500">{initialMessage.timestamp}</span>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => setMessageAnimated(true)}
                className="max-w-[80%] p-3 rounded-2xl shadow-sm bg-white text-black rounded-bl-md"
              >
                <p className="text-sm">{initialMessage.text}</p>
                <div className="flex items-center gap-1 mt-1 justify-start">
                  <span className="text-xs text-gray-500">{initialMessage.timestamp}</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Barra de input idêntica em layout ao Step10 */}
      <div className="chat-inputbar bg-[#f0f0f0] border-t" style={{ bottom: 0 }}>
        <div className="mx-4 flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
          <input type="text" placeholder="Digite uma mensagem" className="flex-1 outline-none bg-transparent" style={{ fontSize: '16px' }} disabled />
          <button disabled className="text-gray-400"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* WhatsApp Background - always clean */}
      <WhatsAppBackground />

      {/* Combined Dimming + Blur Overlay Layer */}
      <motion.div
        initial={{ 
          backgroundColor: 'rgba(0,0,0,0)',
          ['--overlay-blur' as any]: '0px'
        }}
        animate={{ 
          backgroundColor: overlayDarkened ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
          ['--overlay-blur' as any]: overlayBlurred ? '4px' : '0px'
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="fixed inset-0 pointer-events-none z-20"
        style={{ 
          backdropFilter: 'blur(var(--overlay-blur))',
          WebkitBackdropFilter: 'blur(var(--overlay-blur))',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'background-color, backdrop-filter'
        }}
      />

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center p-4 z-30"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-full max-w-lg"
            >
              <CustomCard variant="elevated" className="text-center space-y-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="title-section text-foreground"
                >
                  Bora ver na prática?
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 text-foreground"
                >
                  <p className="text-content-medium leading-relaxed">
                    Em instantes, você poderá simular uma conversa no WhatsApp: você faz o papel do paciente e a I.A responde como se fosse sua clínica.
                  </p>

                  <p className="text-small text-muted-foreground">
                    Veja a qualidade das respostas, condução de vendas e o agendamento automático.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CustomButton onClick={nextStep} className="w-full" size="lg">
                    BORA!
                  </CustomButton>
                </motion.div>
              </CustomCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};