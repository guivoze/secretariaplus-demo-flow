import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Send, Trash2, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

export const ChatDebug = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [showSessionInput, setShowSessionInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSession = async () => {
    if (!sessionId.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('demo_sessions')
        .select('*')
        .eq('session_id', sessionId.trim())
        .single();

      if (error) {
        alert('Sessão não encontrada');
        return;
      }

      console.log('[ChatDebug] Sessão carregada:', data);
      console.log('[ChatDebug] custom_prompt:', data.custom_prompt);

      setShowSessionInput(false);
      setThreadId(`debug-${Date.now()}`);
      
      // Mensagem de boas-vindas
      const welcomeMsg: Message = {
        id: `msg-${Date.now()}`,
        text: `✅ Debug carregado!\n\nSession: ${sessionId}\nUsuário: ${data.nome || 'N/A'}\nEspecialidade: ${data.especialidade || 'N/A'}\nCustom Prompt: ${data.custom_prompt ? 'SIM ✓' : 'NÃO ✗'}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
    } catch (err) {
      console.error('Erro ao carregar sessão:', err);
      alert('Erro ao carregar sessão');
    }
  };

  const resetChat = () => {
    setMessages([]);
    setThreadId(`debug-${Date.now()}`);
  };

  const changeSession = () => {
    setMessages([]);
    setThreadId('');
    setSessionId('');
    setShowSessionInput(true);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !threadId) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Adiciona mensagem do usuário
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      console.log('[ChatDebug] Enviando:', {
        message: userMessage,
        sessionId: sessionId,
        threadId: threadId
      });

      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: {
          message: userMessage,
          sessionId: sessionId,
          threadId: threadId
        }
      });

      console.log('[ChatDebug] Resposta:', { data, error });
      console.log('[ChatDebug] data.message:', data?.message);

      if (error) {
        console.error('[ChatDebug] Error object:', error);
        throw error;
      }

      // A resposta vem em data.message, não data.response
      if (data?.message) {
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          text: data.message,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        console.warn('[ChatDebug] Resposta sem mensagem:', data);
        const warningMsg: Message = {
          id: `warning-${Date.now()}`,
          text: `Resposta sem mensagem: ${JSON.stringify(data)}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, warningMsg]);
      }
    } catch (err: any) {
      console.error('[ChatDebug] Erro completo:', err);
      console.error('[ChatDebug] Erro stack:', err?.stack);
      console.error('[ChatDebug] Erro message:', err?.message);
      
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        text: `Erro: ${err?.message || 'Erro desconhecido'}. Veja o console para detalhes.`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showSessionInput) {
        loadSession();
      } else {
        sendMessage();
      }
    }
  };

  if (showSessionInput) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-gray-800 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center gap-3 text-white mb-6">
            <User className="w-6 h-6" />
            <h1 className="text-xl font-bold">Chat Debug</h1>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Session ID</label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Cole o session_id aqui"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <button
            onClick={loadSession}
            disabled={!sessionId.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Carregar Sessão
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Cole o session_id de uma demo_sessions para testar o assistant
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5" />
          <div>
            <h1 className="font-bold">Chat Debug</h1>
            <p className="text-xs text-gray-400">Session: {sessionId.slice(0, 8)}...</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetChat}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset chat (mantém sessão)"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={changeSession}
            className="px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-sm"
            title="Mudar sessão"
          >
            Trocar Sessão
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
