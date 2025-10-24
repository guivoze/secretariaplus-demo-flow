import { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useClarity } from "@/hooks/useClarity";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useKeyboardGlue } from "@/hooks/useKeyboardGlue";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";
import { toast } from "sonner";

// Função para limpar tags HTML
function sanitizeMessage(text: string) {
  return text.replace(/<[^>]*>?/gm, '');
}

const MAX_MESSAGE_LENGTH = 300;
const SUSPICIOUS_CHARS = /[<>]/;
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}
export const Step10WhatsApp = () => {
  const {
    nextStep,
    userData,
    sessionId,
    setAppointment,
    appointment,
    resetChatInMemory,
    threadId,
    setThreadId
  } = useSupabaseDemo();
  const clarity = useClarity({ 
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID || "t5ehdfteyd" 
  });
  const {
    chatMessages,
    sendUserMessage,
    sendAssistantMessage
  } = useChatMessages();
  const [inputValue, setInputValue] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [chatDarkened, setChatDarkened] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialMessage, setHasInitialMessage] = useState(false);
  const {
    height: keyboardHeight,
    open: isKeyboardOpen
  } = useKeyboardGlue();
  // Top dinâmico para o toast respeitando o teclado e o visualViewport
  const [toastTop, setToastTop] = useState<number>(16);
  useEffect(() => {
    function computeTop() {
      // Usa visualViewport quando disponível para pegar o topo visível real
      const vv: any = typeof window !== 'undefined' && (window as any).visualViewport || null;
      if (vv) {
        // Quando o teclado abre no iOS, vv.offsetTop sobe; ancoramos o toast no topo visível + 16px
        const top = Math.max(16, Math.round((vv as any).offsetTop + 16));
        setToastTop(top);
        return;
      }
      // Fallback: se o teclado estiver aberto, desloca 16px; caso contrário 16px padrão
      setToastTop(16);
    }
    computeTop();
    const vv: any = typeof window !== 'undefined' && (window as any).visualViewport || null;
    if (vv) {
      const onVV = () => computeTop();
      vv.addEventListener('resize', onVV);
      vv.addEventListener('scroll', onVV);
      return () => {
        vv.removeEventListener('resize', onVV);
        vv.removeEventListener('scroll', onVV);
      };
    }
    return;
  }, [isKeyboardOpen, keyboardHeight]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [lockInput, setLockInput] = useState(false);
  const [stagedChunks, setStagedChunks] = useState<string[]>([]);
  const [visibleChunkCount, setVisibleChunkCount] = useState(0);
  const [isChunkTyping, setIsChunkTyping] = useState(false);
  
  // Nudge states
  const [showFirstNudge, setShowFirstNudge] = useState(false);
  const [showSecondNudge, setShowSecondNudge] = useState(false);
  const [chatStartTime, setChatStartTime] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lock outer scroll while on chat to avoid double scroll
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  // Quando o teclado abrir/fechar, manter o body no topo (iOS evita "puxões")
  useEffect(() => {
    if (!isKeyboardOpen) {
      // garante que o documento não "escapou" do topo
      window.scrollTo(0, 0);
    }
  }, [isKeyboardOpen]);

  // Memoize message conversion to prevent unnecessary re-renders
  const messages: Message[] = useMemo(() => chatMessages.map(msg => ({
    id: msg.id,
    text: msg.content,
    sender: msg.sender === 'user' ? 'user' : 'bot',
    timestamp: new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  })), [chatMessages]);
  useEffect(() => {
    if (chatMessages.length === 0 && !hasInitialMessage) {
      // Bloqueia input durante envio das mensagens iniciais
      setLockInput(true);
      
      // Envia as mensagens iniciais em sequência com delays naturais baseados no tempo de leitura
      const sendInitialMessages = async () => {
        // Primeira mensagem
        await sendAssistantMessage('✨ Oie! Pra me testar, aja como um paciente típico, ex: "Qual valor do botox?"');
        
        // Segunda mensagem (~3s para ler)
        await new Promise(resolve => setTimeout(resolve, 2500));
        await sendAssistantMessage('Apenas te lembrando: fui treinada só com informações públicas do seu Instagram, ta? 😊');
        
        // Terceira mensagem (~2.5s para ler)
        await new Promise(resolve => setTimeout(resolve, 2800));
        await sendAssistantMessage('Ah... e eu também to digitando mais rápido que o normal pra ficar dinâmico no teste. ⚡️🏃🏻‍♀️');
        
        // Quarta mensagem (~4s para ler - mais longa)
        await new Promise(resolve => setTimeout(resolve, 2300));
        await sendAssistantMessage('Quando você assinar um plano, poderei ser 100% personalizada — meu jeito de falar, tom, formalidade… tudo com a cara da sua clínica.');
        
        // Quinta mensagem (~2s para ler)
        await new Promise(resolve => setTimeout(resolve, 3500));
        await sendAssistantMessage('Mas já dá pra ter um gostinho agora!');
        
        // Sexta mensagem (~1.5s para ler)
        await new Promise(resolve => setTimeout(resolve, 1800));
        await sendAssistantMessage('Estou prontíssima, pode mandar! 🥰');
        
        // Desbloqueia input após última mensagem
        setLockInput(false);
      };
      
      sendInitialMessages();
      setHasInitialMessage(true);
    }
  }, [chatMessages.length, hasInitialMessage, sendAssistantMessage]);
  useEffect(() => {
    if (messages.length >= 8) {
      setShowFinishButton(true);
    }
  }, [messages.length]);

  // === SCROLL SYSTEM OTIMIZADO PARA iOS SAFARI ===
  const scrollToEnd = useCallback((behavior: ScrollBehavior = 'auto') => {
    const container = messagesContainerRef.current;
    const anchor = messagesEndRef.current;
    if (!container || !anchor) return;

    // Força o header a ficar fixo no topo
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Calcula área visível real: viewport - header - teclado - input - margem
    const headerHeight = 72; // altura fixa do header
    const inputHeight = 80; // altura do input com padding (12px * 2 + 56px)
    const keyboardOffset = isInputFocused ? keyboardHeight : 0;
    const marginBuffer = 20; // margem de segurança

    // Área visível disponível para mensagens
    const availableHeight = window.innerHeight - headerHeight - keyboardOffset - inputHeight - marginBuffer;

    // Calcula scroll para mostrar a âncora na área visível
    const targetScroll = anchor.offsetTop - availableHeight;
    if (behavior === 'smooth') {
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    } else {
      container.scrollTop = Math.max(0, targetScroll);
    }
  }, [isInputFocused, keyboardHeight]);
  const isAtBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    const threshold = 40; // px
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance <= threshold;
  }, []);

  // Desce SEMPRE quando entrar nova mensagem / aparecer "digitando" / mostrar chunk
  useLayoutEffect(() => {
    // Pequeno delay para garantir que o DOM foi atualizado
    const timer = setTimeout(() => {
      const behavior: ScrollBehavior = isAtBottom() ? 'auto' : 'smooth';
      scrollToEnd(behavior);
    }, 10);
    return () => clearTimeout(timer);
  }, [messages.length, isLoading, isChunkTyping, visibleChunkCount, scrollToEnd, isAtBottom]);

  // Quando o teclado abrir/fechar, SEMPRE faz snap para o final
  useEffect(() => {
    if (isKeyboardOpen) {
      // Força header no topo e scroll para final
      window.scrollTo(0, 0);
      const t = setTimeout(() => {
        window.scrollTo(0, 0);
        scrollToEnd('auto');
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isKeyboardOpen, scrollToEnd]);

  // Evitar perder foco ao tocar no botão de enviar (iOS dispara blur antes do click)
  const keepFocusPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  }, []);
  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    if (inputValue.length > MAX_MESSAGE_LENGTH) {
      toast.error('Mensagem muito longa.');
      return;
    }
    if (SUSPICIOUS_CHARS.test(inputValue)) {
      toast.error('Caracteres inválidos na mensagem.');
      return;
    }
    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Track interação do chat
    clarity.trackInteraction('chat_message_sent', {
      message_length: userMessage.length.toString(),
      message_count: (chatMessages.length + 1).toString(),
      has_appointment: appointment ? 'true' : 'false'
    });
    
    try {
      await sendUserMessage(userMessage);
      setIsLoading(true);
      const {
        data,
        error
      } = await supabase.functions.invoke('chat-completion', {
        body: {
          sessionId: sessionId,
          threadId: threadId,
          message: userMessage,
          nowEpochMs: Date.now()
        }
      });
      if (error) throw error;
      if (data?.success && data?.message) {
        await sendAssistantMessage(data.message);
        const chunks = data.message.split(/\n\s*\n+/).map((c: string) => c.trim()).filter((c: string) => c.length > 0);
        if (chunks.length > 1) {
          setLockInput(true);
          setStagedChunks(chunks);
          setVisibleChunkCount(1);
          (async () => {
            for (let i = 1; i < chunks.length; i++) {
              setIsChunkTyping(true);
              await new Promise(r => setTimeout(r, 1500));
              setIsChunkTyping(false);
              setVisibleChunkCount(prev => prev + 1);
            }
            setLockInput(false);
          })();
        } else {
          setStagedChunks([]);
          setVisibleChunkCount(0);
          setIsChunkTyping(false);
        }
        if (data.appointment && data.appointment.dateISO) {
          setAppointment(data.appointment);
          setTimeout(() => {
            setShowNotification(true);
          }, 8900);
          setTimeout(() => {
            setShowNotification(false);
            nextStep();
          }, 11900);
        }
      } else {
        throw new Error('No AI response received');
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      setInputValue(userMessage);
    } finally {
      setTimeout(() => setIsLoading(false), 350);
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus(); // manter teclado aberto após enviar
        }
      });
    }
  }, [inputValue, isLoading, sendUserMessage, sendAssistantMessage, sessionId, threadId]);
  const finishConversation = useCallback(() => {
    setChatDarkened(true);
    setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => {
        nextStep();
      }, 3000);
    }, 2500); // +2s delay antes do toast aparecer
  }, [nextStep]);

  // Sempre que esta tela monta (novo teste), limpamos o chat em memória e criamos um novo threadId
  useEffect(() => {
    resetChatInMemory();
    setThreadId(uuidv4()); // Use UUID para threadId
    setChatStartTime(Date.now());
    
    // Debug commands - use no console para testar popups
    (window as any).showNudge1 = () => {
      console.log('🔍 DEBUG: Mostrando primeiro nudge');
      setShowFirstNudge(true);
      setTimeout(() => setShowFirstNudge(false), 9000);
    };
    (window as any).showNudge2 = () => {
      console.log('🔍 DEBUG: Mostrando segundo nudge');
      setShowSecondNudge(true);
      setTimeout(() => setShowSecondNudge(false), 60000);
    };
    (window as any).hideNudges = () => {
      console.log('🔍 DEBUG: Escondendo todos os nudges');
      setShowFirstNudge(false);
      setShowSecondNudge(false);
    };
    
    console.log('💡 DEBUG disponível: showNudge1(), showNudge2(), hideNudges()');
    
    // não limpamos o DB; apenas a lista em memória, e mudamos o threadId para isolar memória do assistant
  }, [resetChatInMemory]);

  // Nudge timers
  useEffect(() => {
    if (!chatStartTime) return;

    // First nudge at 60 seconds
    const firstTimer = setTimeout(() => {
      if (!appointment) { // Only show if no appointment yet
        setShowFirstNudge(true);
        setTimeout(() => setShowFirstNudge(false), 9000); // Hide after 9 seconds
      }
    }, 60000); // 60 seconds

    // Second nudge at 120 seconds (2 minutes) - gives more time between nudges
    const secondTimer = setTimeout(() => {
      if (!appointment) { // Only show if no appointment yet
        setShowSecondNudge(true);
        setTimeout(() => {
          setShowSecondNudge(false);
          nextStep(); // Auto advance after showing the nudge
        }, 60000); // Hide after 60 seconds (1 minute) and advance
      }
    }, 120000); // 120 seconds (2 minutes)

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, [chatStartTime, appointment, nextStep]);
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
      // Keep keyboard open after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [sendMessage]);
  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);

    // Força header no topo imediatamente
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Aguarda o teclado aparecer e então faz o scroll
    setTimeout(() => {
      // Força novamente para garantir
      window.scrollTo(0, 0);
      scrollToEnd('auto');
    }, 300);
  }, [scrollToEnd]);
  const handleInputBlur = useCallback(() => {
    // Só consideramos "fechar teclado" quando perder foco de verdade
    setIsInputFocused(false);
  }, []);
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Altura efetiva só quando o input está focado (evita falsos positivos do Safari)
  const effectiveKB = isInputFocused ? keyboardHeight : 0;
  return <div className="chat-root fixed inset-0 flex flex-col overflow-hidden bg-white" style={{
    margin: 0,
    padding: 0
  }}>
      {/* WhatsApp Header - SEMPRE fixo no topo */}
      <div className="chat-header bg-[#075e54] text-white flex items-center gap-3 shadow-lg" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '72px',
      zIndex: 20,
      transform: 'translateZ(0)',
      willChange: 'transform',
      margin: 0,
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

      {/* Messages Area - área entre header e input */}
      <div ref={messagesContainerRef} className={`chat-messages space-y-3 transition-all duration-200 overflow-y-auto ${chatDarkened ? 'opacity-30' : ''}`} style={{
      position: 'fixed',
      top: '72px',
      // depois do header
      left: 0,
      right: 0,
      bottom: effectiveKB + 80,
      // acima do input + teclado (input = ~80px com padding)
      paddingTop: '16px',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingBottom: '8px',
      // bem mais próximo do input
      zIndex: 1
    }}>
        <AnimatePresence mode="popLayout">
          {messages.map(message => {
          const isAssistant = message.sender !== 'user';
          if (!isAssistant) {
            return <motion.div key={message.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.2
            }} onAnimationComplete={() => scrollToEnd('auto')} className={`flex justify-end`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm bg-[#dcf8c6] text-black rounded-br-md`}>
                    <p className="text-sm whitespace-pre-wrap">{sanitizeMessage(message.text)}</p>
                    <div className={`flex items-center gap-1 mt-1 justify-end`}>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    </div>
                  </div>
                </motion.div>;
          }
          const chunks = message.text.split(/\n\s*\n+/).map(c => sanitizeMessage(c.trim())).filter(Boolean);
          const lastAssistantId = (() => {
            for (let j = messages.length - 1; j >= 0; j--) {
              if (messages[j].sender !== 'user') return messages[j].id;
            }
            return null;
          })();
          const isLastAssistant = lastAssistantId === message.id;
          const count = isLastAssistant && stagedChunks.length > 1 ? Math.max(visibleChunkCount, 1) : chunks.length;
          return <div key={message.id} className="space-y-2">
                {chunks.slice(0, count).map((c, idc) => <motion.div key={`${message.id}-${idc}`} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.2
            }} onAnimationComplete={() => scrollToEnd('auto')} className={`flex justify-start`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm bg-white text-black rounded-bl-md`}>
                    <p className="text-sm whitespace-pre-wrap">{c}</p>
                      <div className={`flex items-center gap-1 mt-1 justify-start`}>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                    </div>
                  </motion.div>)}
                {isLastAssistant && isChunkTyping && <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.2
            }} onAnimationComplete={() => scrollToEnd('auto')} className="flex justify-start">
                    <div className="bg-white text-black rounded-2xl rounded-bl-md p-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
                    animationDelay: '0.1s'
                  }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
                    animationDelay: '0.2s'
                  }}></div>
                      </div>
                    </div>
                  </motion.div>}

              </div>;
        })}
        </AnimatePresence>
        {isLoading && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} onAnimationComplete={() => scrollToEnd('auto')} className="flex justify-start">
            <div className="bg-white text-black rounded-2xl rounded-bl-md p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
              animationDelay: '0.1s'
            }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
              animationDelay: '0.2s'
            }}></div>
              </div>
            </div>
          </motion.div>}

        {/* ANCORAAAAAAAA (deve ficar por último dentro de .chat-messages) */}
        <div ref={messagesEndRef} />
      </div>

      {/* Nudges */}
      <AnimatePresence>
        {showFirstNudge && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed left-4 right-4 z-40"
            style={{
              top: `calc(72px + 16px)` // below header + margin
            }}
          >
            <div className="bg-white border-2 border-yellow-400 text-black px-7 py-5 rounded-2xl shadow-xl mx-auto max-w-fit">
              <p className="text-base text-center font-medium">
                <span className="font-bold">Dica:</span> tente agendar e confirmar uma consulta na conversa para ter uma surpresa 🤯
              </p>
            </div>
          </motion.div>
        )}
        {showSecondNudge && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed left-4 right-4 z-40"
            style={{
              top: `calc(72px + 16px)` // below header + margin
            }}
          >
            <div className="bg-white border-3 border-yellow-400 text-black px-7 py-5 rounded-2xl shadow-xl mx-auto max-w-fit">
              <p className="text-base text-center font-medium">
                👀 <span className="font-bold">Aviso:</span> Caso você <span className="font-bold">não agende</span> um horário em <span className="font-bold text-red-600">1 minuto</span>, iremos avançar para a próxima etapa automaticamente.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finish Button */}
      <AnimatePresence>
        {/* hidden debug button removed */}
      </AnimatePresence>

      {/* Input Area - sempre fixo no fundo, acima do teclado */}
      <div ref={inputBarRef} className={`chat-inputbar bg-[#f0f0f0] border-t transition-all duration-150 ${chatDarkened ? 'opacity-30' : ''}`} style={{
      position: 'fixed',
      bottom: effectiveKB,
      left: 0,
      right: 0,
      zIndex: 15,
      padding: '12px 0'
    }}>
        <div className="mx-4 flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
          <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} onKeyPress={handleKeyPress} onFocus={handleInputFocus} onBlur={handleInputBlur} placeholder="Digite uma mensagem..." className="flex-1 outline-none bg-transparent" style={{
          fontSize: '16px'
        }} readOnly={isLoading || lockInput} // bloqueia digitação sem perder foco
        aria-disabled={chatDarkened || isLoading || lockInput} autoComplete="off" autoCorrect="on" autoCapitalize="sentences" spellCheck="false" />
          <button onMouseDown={keepFocusPointerDown} onTouchStart={keepFocusPointerDown} onClick={() => {
          sendMessage();
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 50);
        }} disabled={!inputValue.trim() || chatDarkened || isLoading || lockInput} className="text-[#075e54] disabled:text-gray-400 transition-colors p-1">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && <>
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="fixed inset-0 bg-black/60 z-40" />
            <motion.div initial={{
          opacity: 0,
          y: -100
        }} animate={{
          opacity: 1,
          y: 0
        }} className="fixed inset-x-0 z-50 px-4" style={{
          top: `${toastTop}px`
        }}>
              <div className="mx-auto max-w-sm bg-white rounded-lg shadow-2xl p-4 text-center">
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-2xl">✅</div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">Novo Agendamento!</h3>
                    <p className="text-sm text-gray-600 mt-1">Paciente acabou de marcar {appointment?.procedure || userData.especialidade || 'procedimento'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>}
      </AnimatePresence>
    </div>;
};