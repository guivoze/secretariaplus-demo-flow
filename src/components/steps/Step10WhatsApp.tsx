import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
	const [hasInitialMessage, setHasInitialMessage] = useState(false);
	const [inputBarHeight, setInputBarHeight] = useState(72);
	const [keyboardOffset, setKeyboardOffset] = useState(0); // NEW
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const inputBarRef = useRef<HTMLDivElement>(null);

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

	const measureInputBar = useCallback(() => {
		if (inputBarRef.current) {
			setInputBarHeight(inputBarRef.current.offsetHeight || 72);
		}
	}, []);

	// Track iOS keyboard via VisualViewport and glue the input bar to it
	useEffect(() => {
		const vv = (window as any).visualViewport as VisualViewport | undefined;
		if (!vv) return;
		const handler = () => {
			const offset = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
			setKeyboardOffset(offset);
			measureInputBar();
		};
		vv.addEventListener('resize', handler);
		vv.addEventListener('scroll', handler);
		handler();
		return () => {
			vv.removeEventListener('resize', handler);
			vv.removeEventListener('scroll', handler);
		};
	}, [measureInputBar]);

	const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
		messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}
	}, []);

	// Only scroll when messages actually change, not on every render
	useEffect(() => {
		scrollToBottom('smooth');
	}, [messages.length, scrollToBottom]);

	useEffect(() => {
		const vv = (window as any).visualViewport as VisualViewport | undefined;
		if (!vv) return;
		const onResize = () => setTimeout(() => {
			measureInputBar();
			scrollToBottom('auto');
		}, 50);
		vv.addEventListener('resize', onResize);
		return () => vv.removeEventListener('resize', onResize);
	}, [scrollToBottom, measureInputBar]);

	const sendMessage = useCallback(async () => {
		if (!inputValue.trim() || isLoading) return;
		const userMessage = inputValue.trim();
		setInputValue('');
		try {
			await sendUserMessage(userMessage);
			setTimeout(() => setIsLoading(true), 300);
			const { data, error } = await supabase.functions.invoke('chat-completion', {
				body: { sessionId: sessionId, message: userMessage }
			});
			if (error) throw error;
			if (data?.success && data?.message) {
				await sendAssistantMessage(data.message);
			} else {
				throw new Error('No AI response received');
			}
		} catch (error) {
			console.error('Error in chat:', error);
			toast.error('Erro ao enviar mensagem. Tente novamente.');
			setInputValue(userMessage);
		} finally {
			setIsLoading(false);
			requestAnimationFrame(() => scrollToBottom('smooth'));
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
		if (e.key === 'Enter') sendMessage();
	}, [sendMessage]);

	const handleInputFocus = useCallback(() => {
		scrollToBottom('auto');
		setTimeout(() => scrollToBottom('auto'), 250);
	}, [scrollToBottom]);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}, []);

	return (
		<div className="h-[100dvh] flex flex-col bg-[#e5ddd5] relative overflow-hidden">
			{/* WhatsApp Header - fixed and stabilized */}
			<div className="bg-[#075e54] text-white p-4 flex items-center gap-3 shadow-lg shrink-0 sticky top-0 z-30"
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

			{/* Messages Area - padded to avoid overlap with input bar */}
			<div
				ref={messagesContainerRef}
				className={`flex-1 overflow-y-auto p-4 space-y-3 transition-all duration-500 ${chatDarkened ? 'opacity-30' : ''}`}
				style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' as any, paddingBottom: inputBarHeight + 24 }}
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
				{showFinishButton && !chatDarkened && (
					<motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={finishConversation} className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-primary text-black px-6 py-3 rounded-full font-semibold shadow-lg z-40 flex items-center gap-2">
						✅ Finalizar conversa e ver agendamento
					</motion.button>
				)}
			</AnimatePresence>

			{/* Input Area - fixed to keyboard */}
			<div
				ref={inputBarRef}
				className={`fixed inset-x-0 bg-[#f0f0f0] border-t z-40 transition-transform duration-150 ${chatDarkened ? 'opacity-30' : ''}`}
				style={{ padding: '16px', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)', bottom: keyboardOffset }}
			>
				<div className="mx-4 flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
					<input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} onKeyPress={handleKeyPress} onFocus={handleInputFocus} placeholder="Digite uma mensagem" className="flex-1 outline-none bg-transparent" style={{ fontSize: '16px' }} disabled={chatDarkened || isLoading} />
					<button onClick={sendMessage} disabled={!inputValue.trim() || chatDarkened || isLoading} className="text-[#075e54] disabled:text-gray-400 transition-colors">
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