import { useState, useEffect, useCallback } from "react";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useChatMessages } from "@/hooks/useChatMessages";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import '@/styles/whatsapp-chat.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';

export const Step10WhatsApp = () => {
  const { nextStep, userData, sessionId } = useSupabaseDemo();
  const { chatMessages, sendUserMessage, sendAssistantMessage } = useChatMessages();
  const [inputValue, setInputValue] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [chatDarkened, setChatDarkened] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialMessage, setHasInitialMessage] = useState(false);

  // Initialize chat with welcome message - only once
  useEffect(() => {
    if (chatMessages.length === 0 && !hasInitialMessage) {
      const initialMessage = "Olá! Seja bem-vinda à Clínica Exemplo! Como posso ajudar você hoje? 😊";
      sendAssistantMessage(initialMessage);
      setHasInitialMessage(true);
    }
  }, [chatMessages.length, hasInitialMessage, sendAssistantMessage]);

  // Show finish button after enough messages
  useEffect(() => {
    if (chatMessages.length >= 8) {
      setShowFinishButton(true);
    }
  }, [chatMessages.length]);

  const sendMessage = useCallback(async (innerHtml: string, textContent: string) => {
    const userMessage = textContent.trim();
    if (!userMessage || isLoading) return;

    setInputValue('');

    try {
      console.log('Enviando mensagem do usuário:', userMessage);
      
      // Send user message first
      await sendUserMessage(userMessage);

      // Show typing indicator
      setIsLoading(true);

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
  }, [isLoading, sendUserMessage, sendAssistantMessage, sessionId]);

  const finishConversation = useCallback(() => {
    setChatDarkened(true);
    setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => {
        nextStep();
      }, 3000);
    }, 500);
  }, [nextStep]);

  // Custom WhatsApp-like styles
  const containerStyle = {
    height: '100vh',
    width: '100%',
    position: 'relative' as const,
    backgroundColor: '#e5ddd5',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d0d0d0' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  const chatContainerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const messageListStyle = {
    paddingBottom: '1rem',
    paddingTop: '1rem',
  };

  return (
    <div style={containerStyle}>
      <MainContainer className={chatDarkened ? 'opacity-30 transition-all duration-500' : 'transition-all duration-500'}>
        <ChatContainer style={chatContainerStyle}>
          <ConversationHeader>
            <Avatar 
              src={userData.realProfilePic || undefined}
              name={userData.aiInsights?.name || userData.instagram || 'SecretáriaPlus'}
            />
            <ConversationHeader.Content 
              userName={userData.aiInsights?.name || userData.instagram || 'SecretáriaPlus'}
              info="online"
            />
            <ConversationHeader.Actions>
              <Video className="w-5 h-5 cursor-pointer" />
              <Phone className="w-5 h-5 cursor-pointer mx-2" />
              <MoreVertical className="w-5 h-5 cursor-pointer" />
            </ConversationHeader.Actions>
          </ConversationHeader>
          
          <MessageList 
            style={messageListStyle}
            typingIndicator={isLoading ? <TypingIndicator content="Digitando..." /> : null}
          >
            {chatMessages.map((msg) => (
              <Message
                key={msg.id}
                model={{
                  message: msg.content,
                  sentTime: new Date(msg.timestamp).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }),
                  sender: msg.sender === 'user' ? 'user' : 'assistant',
                  direction: msg.sender === 'user' ? 'outgoing' : 'incoming',
                  position: 'single'
                }}
              />
            ))}
          </MessageList>
          
          <MessageInput 
            placeholder="Digite uma mensagem" 
            value={inputValue}
            onChange={setInputValue}
            onSend={sendMessage}
            disabled={chatDarkened || isLoading}
            attachButton={false}
            style={{
              backgroundColor: '#f0f0f0',
              borderTop: '1px solid #e0e0e0',
            }}
          />
        </ChatContainer>
      </MainContainer>

      {/* Finish Button */}
      <AnimatePresence>
        {showFinishButton && !chatDarkened && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={finishConversation}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-primary text-black px-6 py-3 rounded-full font-semibold shadow-lg z-50 flex items-center gap-2"
          >
            ✅ Finalizar conversa e ver agendamento
          </motion.button>
        )}
      </AnimatePresence>

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