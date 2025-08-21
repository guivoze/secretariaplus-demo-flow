import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useKeyboardGlue } from "@/hooks/useKeyboardGlue";
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
	const { nextStep, userData, sessionId, setAppointment } = useSupabaseDemo();
	const { chatMessages, sendUserMessage, sendAssistantMessage } = useChatMessages();
	const [inputValue, setInputValue] = useState('');
	const [showNotification, setShowNotification] = useState(false);
	const [chatDarkened, setChatDarkened] = useState(false);
	const [showFinishButton, setShowFinishButton] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hasInitialMessage, setHasInitialMessage] = useState(false);
	const { height: keyboardHeight, open: isKeyboardOpen } = useKeyboardGlue();
	const [isInputFocused, setIsInputFocused] = useState(false);
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
	const messages: Message[] = useMemo(() => 
		chatMessages.map(msg => ({
			id: msg.id,
			text: msg.content,
			sender: msg.sender === 'user' ? 'user' : 'bot',
			timestamp: new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
		})), [chatMessages]
	);

	// Initialize chat with welcome message - only once
	useEffect(() => {
		if (chatMessages.length === 0 && !hasInitialMessage) {
			const initialMessage = "Olá! Seja bem-vinda à Clínica Exemplo! Como posso ajudar você hoje? 😊";
			sendAssistantMessage(initialMessage);
			setHasInitialMessage(true);
		}
	}, [chatMessages.length, hasInitialMessage, sendAssistantMessage]);

	useEffect(() => {
		if (messages.length >= 8) {
			setShowFinishButton(true);
		}
	}, [messages.length]);

	// Removido: detecção própria; agora usamos useKeyboardGlue()

	const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
		// Evitar scrollIntoView no iOS (pode causar body-scroll); use só scrollTop
		const el = messagesContainerRef.current;
		if (el) {
			if (behavior === 'smooth') {
				el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
			} else {
				el.scrollTop = el.scrollHeight;
			}
		}
	}, []);

	// Only scroll when messages actually change, not on every render
	useEffect(() => {
		scrollToBottom('smooth');
	}, [messages.length, scrollToBottom]);

	useEffect(() => {
		if (isKeyboardOpen) {
			setTimeout(() => scrollToBottom('auto'), 50);
		}
	}, [isKeyboardOpen, scrollToBottom]);

	// Evitar perder foco ao tocar no botão de enviar (iOS dispara blur antes do click)
	const keepFocusPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
	}, []);

	const sendMessage = useCallback(async () => {
		if (!inputValue.trim() || isLoading) return;
		const userMessage = inputValue.trim();
		setInputValue('');
		try {
			console.log('[chat-ui] sending user message:', userMessage);
			await sendUserMessage(userMessage);
			setTimeout(() => setIsLoading(true), 300);
			const { data, error } = await supabase.functions.invoke('chat-completion', {
				body: { sessionId: sessionId, message: userMessage }
			});
			if (error) throw error;
			console.log('[chat-ui] function response:', data);
			if (data?.success && data?.message) {
				await sendAssistantMessage(data.message);
				if (data.appointment && data.appointment.dateISO) {
					console.log('[chat-ui] appointment received:', data.appointment);
					setAppointment(data.appointment);
					// Exibir toast e dar tempo para leitura da mensagem antes de navegar
					setTimeout(() => { setShowNotification(true); }, 400);
					setTimeout(() => { setShowNotification(false); nextStep(); }, 2500);
				}
			} else {
				throw new Error('No AI response received');
			}
		} catch (error) {
			console.error('[chat-ui] Error in chat:', error);
			toast.error('Erro ao enviar mensagem. Tente novamente.');
			setInputValue(userMessage);
		} finally {
			setIsLoading(false);
			requestAnimationFrame(() => {
				if (inputRef.current) {
					inputRef.current.focus();   // manter teclado aberto após enviar
				}
				scrollToBottom('smooth');
			});
		}
	}, [inputValue, isLoading, sendUserMessage, sendAssistantMessage, sessionId, scrollToBottom]);

	const finishConversation = useCallback(() => {
		setChatDarkened(true);
		setTimeout(() => {
			setShowNotification(true);
			setTimeout(() => { nextStep(); }, 3000);
		}, 500);
	}, [nextStep]);

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
		scrollToBottom('auto');
		setTimeout(() => scrollToBottom('auto'), 200);
	}, [scrollToBottom]);

	const handleInputBlur = useCallback(() => {
		// Só consideramos "fechar teclado" quando perder foco de verdade
		setIsInputFocused(false);
	}, []);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}, []);

	// Altura efetiva só quando o input está focado (evita falsos positivos do Safari)
	const effectiveKB = isInputFocused ? keyboardHeight : 0;

	return (
		<div className="chat-root relative overflow-hidden">
			{/* WhatsApp Header - fixed and stabilized */}
			<div className="chat-header bg-[#075e54] text-white p-4 flex items-center gap-3 shadow-lg shrink-0"
				style={{ transform: 'translateZ(0)', willChange: 'transform' }}
			>
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

			{/* Messages Area - dynamically padded for keyboard */}
			<div
				ref={messagesContainerRef}
				className={`chat-messages flex-1 p-4 space-y-3 transition-all duration-200 ${chatDarkened ? 'opacity-30' : ''}`}
				style={{ 
					paddingBottom: (effectiveKB > 0 ? effectiveKB : 0) + 80
				}}
			>
				<AnimatePresence mode="popLayout">
					{messages.map((message) => (
						<motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
							<div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${message.sender === 'user' ? 'bg-[#dcf8c6] text-black rounded-br-md' : 'bg-white text-black rounded-bl-md'}`}>
								<p className="text-sm whitespace-pre-wrap">{message.text}</p>
								<div className={`flex items-center gap-1 mt-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
									<span className="text-xs text-gray-500">{message.timestamp}</span>
									{message.sender === 'user' && (<CheckCheck className="w-3 h-3 text-blue-500" />)}
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
				{isLoading && (
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex justify-start">
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
				{/* hidden debug button removed */}
			</AnimatePresence>

			{/* Input Area - perfectly glued to keyboard */}
			<div
				ref={inputBarRef}
				className={`chat-inputbar bg-[#f0f0f0] border-t transition-all duration-150 ${chatDarkened ? 'opacity-30' : ''}`}
				style={{ 
					bottom: effectiveKB > 0 ? effectiveKB : 0
				}}
			>
				<div className="mx-4 flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
					<input 
						ref={inputRef} 
						type="text" 
						value={inputValue} 
						onChange={handleInputChange} 
						onKeyPress={handleKeyPress} 
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						placeholder="Digite uma mensagem"
						className="flex-1 outline-none bg-transparent" 
						style={{ fontSize: '16px' }} 
						readOnly={isLoading}                    // bloqueia digitação sem perder foco
						aria-disabled={chatDarkened || isLoading}
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						spellCheck="false"
					/>
					<button 
						onMouseDown={keepFocusPointerDown}
						onTouchStart={keepFocusPointerDown}
						onClick={() => {
							sendMessage();
							setTimeout(() => {
								if (inputRef.current) {
									inputRef.current.focus();
								}
							}, 50);
						}} 
						disabled={!inputValue.trim() || chatDarkened || isLoading} 
						className="text-[#075e54] disabled:text-gray-400 transition-colors p-1"
					>
						<Send className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Notification Toast */}
			<AnimatePresence>
				{showNotification && (
					<>
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 z-40" />
						<motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-2xl p-4 max-w-sm w-full mx-4">
							<div className="flex items-start gap-3">
								<div className="text-green-500 text-2xl">✅</div>
								<div className="flex-1">
									<h3 className="font-semibold text-gray-900">Novo Agendamento!</h3>
									<p className="text-sm text-gray-600 mt-1">Paciente Ana Cláudia • (11) 92912-1731</p>
									<p className="text-xs text-gray-500 mt-1">acabou de marcar {userData.especialidade || 'botox'} para 20/08/25, às 15:35</p>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};