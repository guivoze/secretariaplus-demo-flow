import { useState, useEffect, useRef } from "react";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useChatMessages } from "@/hooks/useChatMessages";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export const Step10WhatsApp = () => {
  const { nextStep, userData, sessionId } = useSupabaseDemo();
  const { chatMessages, sendUserMessage, sendAssistantMessage } = useChatMessages();
  const [inputValue, setInputValue] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [chatDarkened, setChatDarkened] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convert chatMessages to local Message format
  const messages: Message[] = chatMessages.map(msg => ({
    id: msg.id,
    text: msg.content,
    sender: msg.sender === 'user' ? 'user' : 'bot',
    timestamp: new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }));

  useEffect(() => {
    // Mensagem inicial fixa - sempre aparece quando não há mensagens
    if (chatMessages.length === 0) {
      const initialMessage = "Olá! Seja bem-vinda à Clínica Exemplo! Como posso ajudar você hoje? 😊";
      sendAssistantMessage(initialMessage);
    }
  }, [chatMessages.length, sendAssistantMessage]);

  useEffect(() => {
    if (messages.length >= 8) {
      setShowFinishButton(true);
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    try {
      console.log('Enviando mensagem do usuário:', userMessage);
      
      // Send user message first
      await sendUserMessage(userMessage);

      // Show typing indicator with delay
      setTimeout(() => {
        setIsLoading(true);
      }, 500);

      // Call AI completion
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: {
          sessionId: sessionId,
          message: userMessage
        }
      });

      if (error) {
        console.error('Error calling chat completion:', error);
        throw error;
      }

      if (data?.success && data?.message) {
        console.log('AI response received:', data.message);
        // Manually add the AI response to ensure it appears immediately
        await sendAssistantMessage(data.message);
      } else {
        throw new Error('No AI response received');
      }

    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const finishConversation = () => {
    setChatDarkened(true);
    setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => {
        nextStep();
      }, 3000);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#e5ddd5] relative">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-full bg-black/10 overflow-hidden flex items-center justify-center">
          {userData.realProfilePic ? (
            <img src={userData.realProfilePic} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-black bg-primary">
              {(userData.instagram || 'SP').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{userData.aiInsights?.name || userData.instagram || 'SecretáriaPlus'}</h3>
          <p className="text-sm text-green-200">online</p>
        </div>
        <div className="flex gap-4">
          <Video className="w-5 h-5" />
          <Phone className="w-5 h-5" />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 p-4 pb-20 space-y-3 transition-all duration-500 ${
        chatDarkened ? 'opacity-30' : ''
      }`}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-[#dcf8c6] text-black rounded-br-md'
                    : 'bg-white text-black rounded-bl-md'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                  {message.sender === 'user' && (
                    <CheckCheck className="w-3 h-3 text-blue-500" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white text-black rounded-2xl rounded-bl-md p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Finish Button */}
      <AnimatePresence>
        {showFinishButton && !chatDarkened && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={finishConversation}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-primary text-black px-6 py-3 rounded-full font-semibold shadow-lg z-40 flex items-center gap-2"
          >
            ✅ Finalizar conversa e ver agendamento
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#f0f0f0] p-4 border-t transition-all duration-500 ${
        chatDarkened ? 'opacity-30' : ''
      }`}>
        <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite uma mensagem"
            className="flex-1 outline-none"
            style={{ fontSize: '16px' }}
            disabled={chatDarkened || isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || chatDarkened || isLoading}
            className="text-[#075e54] disabled:text-gray-400"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/60 z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-2xl p-4 max-w-sm w-full mx-4"
            >
              <div className="flex items-start gap-3">
                <div className="text-green-500 text-2xl">✅</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Novo Agendamento!</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Paciente Ana Cláudia • (11) 92912-1731
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    acabou de marcar {userData.especialidade || 'botox'} para 20/08/25, às 15:35
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};