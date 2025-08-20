import { useState, useEffect, useRef } from "react";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export const Step10WhatsApp = () => {
  const { nextStep, userData } = useSupabaseDemo();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [chatDarkened, setChatDarkened] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses: { [key: string]: string } = {
    'preço': 'Nossos valores começam a partir de R$ 800. Gostaria de agendar uma avaliação gratuita?',
    'valor': 'Nossos valores começam a partir de R$ 800. Gostaria de agendar uma avaliação gratuita?',
    'horário': 'Temos horários disponíveis essa semana! Que tal quinta às 15h?',
    'botox': 'O botox é um dos nossos procedimentos mais procurados! Resultados naturais e duradouros.',
    'toxina': 'A toxina botulínica é excelente para suavizar rugas de expressão. Quer saber mais?',
    'agendar': 'Perfeito! Vou agendar para você. Me confirma seu nome completo e telefone?',
    'sim': 'Ótimo! Agendamento confirmado para quinta-feira às 15h ✅',
    'ok': 'Maravilha! Qualquer dúvida estou aqui para ajudar 😊',
    'oi': 'Olá! Seja bem-vinda à nossa clínica! Como posso ajudar você hoje?',
    'olá': 'Oi! Que bom ter você aqui! Em que posso ajudar?',
    'bom dia': 'Bom dia! Como posso ajudar você hoje?',
    'boa tarde': 'Boa tarde! Em que posso ser útil?',
    default: 'Como posso ajudar você hoje? Temos diversos procedimentos disponíveis!'
  };

  const getResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    for (const keyword in botResponses) {
      if (lowerMessage.includes(keyword)) {
        return botResponses[keyword];
      }
    }
    return botResponses.default;
  };

  useEffect(() => {
    // Initial bot message
    const initialMessage: Message = {
      id: 1,
      text: `Olá! Seja bem-vinda à ${userData.clinicName || 'nossa clínica'}! Como posso ajudar você hoje? 😊`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setTimeout(() => {
      setMessages([initialMessage]);
    }, 500);
  }, [userData.clinicName]);

  useEffect(() => {
    if (messages.length >= 8) {
      setShowFinishButton(true);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Bot response after delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getResponse(inputValue),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
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
            disabled={chatDarkened}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || chatDarkened}
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