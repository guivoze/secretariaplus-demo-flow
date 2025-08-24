import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AIInsights } from '@/utils/facebookPixel';

interface UserData {
  instagram: string;
  instagramConfirmed?: boolean;
  nome: string;
  email: string;
  whatsapp: string;
  especialidade: string;
  faturamento: string;
  // Mock data
  followers: string;
  posts: string;
  profilePic: string | null;
  clinicName: string;
  procedures: string[];
  // Real Instagram data
  hasInstagramData: boolean;
  realProfilePic: string | null;
  realPosts: string[];
  aiInsights: {
    name: string;
    where: string;
    procedure1: string;
    procedure2: string;
    procedure3: string;
    rapport1: string;
    rapport2: string;
  } | null;
  instagramRequestTime: number | null;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

interface SupabaseDemoContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
  resetDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  // New Supabase features
  sessionId: string | null;
  dbSessionId: string | null;
  isLoading: boolean;
  saveSession: () => Promise<void>;
  chatMessages: ChatMessage[];
  addChatMessage: (content: string, sender: 'user' | 'assistant', metadata?: Record<string, unknown>) => Promise<void>;
  resetChatInMemory: () => void;
  threadId: string | null;
  setThreadId: (id: string | null) => void;
  generateCustomPrompt: () => string;
  getLeadScore: () => number;
  // Session resume features
  showResumeModal: boolean;
  foundPreviousSession: Record<string, unknown> | null;
  resumePreviousSession: () => void;
  startNewTest: () => void;
  // Appointment handed off by LLM tool
  appointment: {
    dateISO: string;
    displayDate: string;
    displayTime: string;
    patientName?: string | null;
    procedure?: string | null;
  } | null;
  setAppointment: (a: SupabaseDemoContextType['appointment']) => void;
  // New: explicit controls
  openResumeModal: () => void;
  closeResumeModal: () => void;
  findPreviousSession: (instagramHandle: string) => Promise<boolean>;
}

// Função para sanitizar dados e remover "null" strings
const sanitizeValue = (value: any): string => {
  if (value === null || value === undefined || value === 'null' || value === 'undefined') {
    return '';
  }
  return String(value).trim();
};

const initialUserData: UserData = {
  instagram: '',
  nome: '',
  email: '',
  whatsapp: '',
  especialidade: '',
  faturamento: '',
  followers: '1.2K',
  posts: '324',
  profilePic: '',
  clinicName: 'Clínica Exemplo',
  procedures: ['Botox', 'Preenchimento', 'Limpeza de Pele'],
  hasInstagramData: false,
  realProfilePic: '',
  realPosts: [],
  aiInsights: null,
  instagramRequestTime: 0,
};

const SupabaseDemoContext = createContext<SupabaseDemoContextType | undefined>(undefined);

// Browser fingerprinting utility
const generateBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('Demo fingerprint', 10, 10);
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvas.toDataURL(),
    timestamp: Date.now()
  };
  
  return btoa(JSON.stringify(fingerprint)).slice(0, 32);
};

// Get UTM parameters from URL
const getUTMParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    referrer: document.referrer
  };
};

export const SupabaseDemoProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserDataState] = useState<UserData>(initialUserData);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [dbSessionId, setDbSessionId] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
const [foundPreviousSession, setFoundPreviousSession] = useState<Record<string, unknown> | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [appointment, setAppointment] = useState<SupabaseDemoContextType['appointment']>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  // Generate session ID - always start at Step 0
  const initializeSession = useCallback(async () => {
    try {
      const fingerprint = generateBrowserFingerprint();
      
      // Always create new session ID for fresh start
      const newSessionId = `${fingerprint}_${Date.now()}`;
      setSessionId(newSessionId);
      
    } catch (error) {
      console.error('Error initializing session:', error);
      // Fallback to basic session
      const fallbackId = `fallback_${Date.now()}`;
      setSessionId(fallbackId);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore step on refresh
  useEffect(() => {
    const savedStep = localStorage.getItem('current-step');
    if (savedStep) {
      const stepNum = parseInt(savedStep, 10);
      if (!Number.isNaN(stepNum)) {
        setCurrentStep(stepNum);
      }
    }
  }, []);

  // Persist step on change
  useEffect(() => {
    localStorage.setItem('current-step', String(currentStep));
  }, [currentStep]);

  // Search for previous sessions by Instagram handle
  const searchPreviousSession = useCallback(async (instagramHandle: string) => {
    if (!instagramHandle.trim()) return;
    
    try {
      // Always close any previous modal state before a new search
      setShowResumeModal(false);
      setFoundPreviousSession(null);

      let query = supabase
        .from('demo_sessions')
        .select('*')
        .eq('instagram_handle', instagramHandle.trim())
        .gt('current_step', 0) // Only sessions that progressed beyond step 0
        .order('created_at', { ascending: false })
        .limit(1);

      // Exclude the current in-memory session row (in case it was just created/updated)
      if (sessionId) {
        query = query.neq('session_id', sessionId);
      }

      const { data: existingSession, error } = await query.single();

      // Only update state; caller decides whether to open the modal
      if (
        existingSession &&
        !error &&
        existingSession.current_step > 0 &&
        existingSession.session_id !== sessionId &&
        existingSession.id !== dbSessionId
      ) {
        setFoundPreviousSession(existingSession);
      }
    } catch (error) {
      // No previous session found or error - continue normally
      console.log('No previous session found for Instagram:', instagramHandle);
    }
  }, [sessionId, dbSessionId]);

  // Save session to Supabase
  const saveSession = useCallback(async () => {
    if (!sessionId) return;
    // Evita criar/atualizar linha enquanto o modal está aberto (compat)
    if (showResumeModal) return;
    // Só persiste após Instagram CONFIRMADO no Step 3+
    if (!userData.instagramConfirmed) return;
    if (!userData.instagram || !userData.instagram.trim()) return;
    if (currentStep < 3) return;
    
    try {
      const utmParams = getUTMParams();
      
      const sessionData = {
        session_id: sessionId,
        instagram_handle: userData.instagram,
        nome: userData.nome,
        email: userData.email,
        whatsapp: userData.whatsapp,
        especialidade: userData.especialidade,
        faturamento: userData.faturamento,
        current_step: currentStep,
        total_steps: 16,
        has_instagram_data: userData.hasInstagramData,
        followers_count: userData.followers,
        posts_count: userData.posts,
        profile_pic_url: userData.profilePic,
        real_profile_pic_url: userData.realProfilePic,
        real_posts: userData.realPosts,
        ai_insights: userData.aiInsights,
        user_agent: navigator.userAgent,
        ...utmParams
      };

      if (dbSessionId) {
        // Update existing session
        await supabase
          .from('demo_sessions')
          .update(sessionData)
          .eq('id', dbSessionId);
      } else {
        // Reaproveitar linha existente do MESMO navegador (fingerprint) + mesmo instagram
        try {
          const fingerprintPrefix = String(sessionId).split('_')[0];
          const { data: existing, error: findErr } = await supabase
            .from('demo_sessions')
            .select('id, session_id, instagram_handle')
            .eq('instagram_handle', userData.instagram)
            .ilike('session_id', `${fingerprintPrefix}_%`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          if (!findErr && existing && existing.id) {
            setDbSessionId(existing.id);
            await supabase
              .from('demo_sessions')
              .update(sessionData)
              .eq('id', existing.id);
          } else {
            // Create new session
            const { data, error } = await supabase
              .from('demo_sessions')
              .insert(sessionData)
              .select()
              .single();
            if (data && !error) {
              setDbSessionId(data.id);
            }
          }
        } catch (e) {
          // Fallback para insert se algo falhar
          const { data } = await supabase
            .from('demo_sessions')
            .insert(sessionData)
            .select()
            .single();
          if (data) setDbSessionId(data.id);
        }
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, [sessionId, userData, currentStep, dbSessionId, showResumeModal]);

  // Auto-save when important data changes (apenas após confirmação)
  useEffect(() => {
    if (sessionId && !isLoading && !showResumeModal && userData.instagramConfirmed && userData.instagram && currentStep >= 3) {
      const timer = setTimeout(() => {
        saveSession();
      }, 1000); // Debounce saves
      
      return () => clearTimeout(timer);
    }
  }, [userData, currentStep, sessionId, isLoading, showResumeModal, saveSession]);

  // Load chat messages
  const loadChatMessages = useCallback(async () => {
    if (!dbSessionId) return;
    
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', dbSessionId)
        .order('message_order', { ascending: true });
        
      if (data) {
        const messages: ChatMessage[] = data.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender_type as 'user' | 'assistant',
          timestamp: new Date(msg.timestamp_sent),
          metadata: typeof msg.message_metadata === 'object' && msg.message_metadata !== null 
            ? msg.message_metadata as Record<string, unknown>
            : {}
        }));
        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  }, [dbSessionId]);

  // Add chat message
  const addChatMessage = useCallback(
    async (
      content: string,
      sender: 'user' | 'assistant',
      metadata?: Record<string, unknown>
    ) => {
      if (!dbSessionId) return;
    
    try {
      const messageOrder = chatMessages.length;
      
      const { data } = await supabase
        .from('chat_messages')
        .insert({
          session_id: dbSessionId,
          message_order: messageOrder,
          sender_type: sender,
          content,
          message_metadata: { ...(metadata || {}), threadId: threadId || null }
        })
        .select()
        .single();
        
      if (data) {
        const newMessage: ChatMessage = {
          id: data.id,
          content: data.content,
          sender: data.sender_type as 'user' | 'assistant',
          timestamp: new Date(data.timestamp_sent),
          metadata: typeof data.message_metadata === 'object' && data.message_metadata !== null 
            ? data.message_metadata as Record<string, unknown>
            : {}
        };
        setChatMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error adding chat message:', error);
    }
  }, [dbSessionId, chatMessages.length]);

  // Reset chat only in memory (não apaga histórico do DB)
  const resetChatInMemory = useCallback(() => {
    setChatMessages([]);
  }, []);

  // Generate custom prompt based on user data
  const generateCustomPrompt = useCallback(() => {
    const { nome, especialidade, aiInsights } = userData;
    
    let prompt = `Você é um assistente de atendimento da clínica especializada em estética`;
    
    if (nome) {
      prompt += ` atendendo ${nome}`;
    }
    
    if (especialidade) {
      prompt += `, especializada em ${especialidade}`;
    }
    
    if (aiInsights) {
      prompt += `. Informações do cliente: ${aiInsights.name} de ${aiInsights.where}. Principais procedimentos de interesse: ${aiInsights.procedure1}, ${aiInsights.procedure2}, ${aiInsights.procedure3}.`;
      prompt += ` Use estas informações para estabelecer rapport: ${aiInsights.rapport1}, ${aiInsights.rapport2}.`;
    }
    
    prompt += ` Seja natural, acolhedor e focado em converter o cliente agendando uma consulta.`;
    
    return prompt;
  }, [userData]);

  // Calculate lead score
  const getLeadScore = useCallback(() => {
    let score = 10; // Base score
    
    if (userData.nome) score += 15;
    if (userData.email) score += 20;
    if (userData.whatsapp) score += 25;
    if (userData.especialidade) score += 10;
    if (userData.faturamento) score += 10;
    if (userData.hasInstagramData) score += 10;
    if (currentStep >= 8) score += 10; // Reached form step
    
    // Step completion bonus
    score += Math.min(currentStep * 2, 20);
    
    return Math.min(score, 100);
  }, [userData, currentStep]);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Load chat messages when session is ready
  useEffect(() => {
    if (dbSessionId) {
      loadChatMessages();
    }
  }, [dbSessionId, loadChatMessages]);

  // Resume previous session
  const resumePreviousSession = useCallback(() => {
    if (!foundPreviousSession) return;
    
    // Update current session to use existing DB session (reutilizar a mesma row)
    setSessionId(String(foundPreviousSession.session_id || ''));
    setDbSessionId(String(foundPreviousSession.id || ''));
    setCurrentStep(Number(foundPreviousSession.current_step || 0));
    
    // Restore user data
    const restoredData: UserData = {
      instagram: sanitizeValue(foundPreviousSession.instagram_handle),
      nome: sanitizeValue(foundPreviousSession.nome),
      email: sanitizeValue(foundPreviousSession.email),
      whatsapp: sanitizeValue(foundPreviousSession.whatsapp),
      especialidade: sanitizeValue(foundPreviousSession.especialidade),
      faturamento: sanitizeValue(foundPreviousSession.faturamento),
      followers: sanitizeValue(foundPreviousSession.followers_count) || '1.2K',
      posts: sanitizeValue(foundPreviousSession.posts_count) || '324',
      profilePic: sanitizeValue(foundPreviousSession.profile_pic_url),
      clinicName: 'Clínica Exemplo',
      procedures: ['Botox', 'Preenchimento', 'Limpeza de Pele'],
      hasInstagramData: Boolean(foundPreviousSession.has_instagram_data),
      realProfilePic: sanitizeValue(foundPreviousSession.real_profile_pic_url),
      realPosts: Array.isArray(foundPreviousSession.real_posts) 
        ? foundPreviousSession.real_posts as string[] 
        : [],
      aiInsights: foundPreviousSession.ai_insights && typeof foundPreviousSession.ai_insights === 'object'
        ? {
            name: String((foundPreviousSession.ai_insights as any)?.name || ''),
            where: String((foundPreviousSession.ai_insights as any)?.where || ''),
            procedure1: String((foundPreviousSession.ai_insights as any)?.procedure1 || ''),
            procedure2: String((foundPreviousSession.ai_insights as any)?.procedure2 || ''),
            procedure3: String((foundPreviousSession.ai_insights as any)?.procedure3 || ''),
            rapport1: String((foundPreviousSession.ai_insights as any)?.rapport1 || ''),
            rapport2: String((foundPreviousSession.ai_insights as any)?.rapport2 || ''),
          }
        : null,
      instagramRequestTime: foundPreviousSession.created_at 
        ? new Date(String(foundPreviousSession.created_at)).getTime() 
        : null,
      instagramConfirmed: true
    };
    
    setUserDataState(restoredData);
    setShowResumeModal(false);
    setFoundPreviousSession(null);
  }, [foundPreviousSession]);

  // Start new test (keep current session, close modal)
  const startNewTest = useCallback(() => {
    // Close modal and clear any previous-session linkage
    setShowResumeModal(false);
    setFoundPreviousSession(null);
    setDbSessionId(null);
    // Volta para o passo 0 (novo fluxo) mas NÃO altera/limpa a row antiga no DB
    setCurrentStep(0);
    // Mantemos os dados atuais em memória para experiência fluida;
    // a próxima gravação criará uma NOVA row com novo session_id
    initializeSession();
  }, [initializeSession]);

  const setUserData = (data: Partial<UserData>) => {
    setUserDataState(prev => {
      // Sanitiza campos específicos que podem vir como "null" string
      const sanitizedData = { ...data };
      if (sanitizedData.email !== undefined) {
        sanitizedData.email = sanitizeValue(sanitizedData.email);
      }
      if (sanitizedData.whatsapp !== undefined) {
        sanitizedData.whatsapp = sanitizeValue(sanitizedData.whatsapp);
      }
      if (sanitizedData.nome !== undefined) {
        sanitizedData.nome = sanitizeValue(sanitizedData.nome);
      }
      if (sanitizedData.instagram !== undefined) {
        sanitizedData.instagram = sanitizeValue(sanitizedData.instagram);
      }
      if (sanitizedData.especialidade !== undefined) {
        sanitizedData.especialidade = sanitizeValue(sanitizedData.especialidade);
      }

      const newData = { ...prev, ...sanitizedData };
      
      // Só busca sessão anterior quando Instagram estiver CONFIRMADO
      if (
        newData.instagramConfirmed &&
        data.instagram && data.instagram !== prev.instagram && data.instagram.trim()
      ) {
        // Clear existing timeout
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        
        // Set new timeout for search (debounce)
        const timeout = setTimeout(() => {
          searchPreviousSession(data.instagram);
        }, 1500);
        
        setSearchTimeout(timeout);
      }
      
      return newData;
    });
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setUserDataState(initialUserData);
    setChatMessages([]);
    setDbSessionId(null);
    setShowResumeModal(false);
    setFoundPreviousSession(null);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
    // Force new session
    initializeSession();
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 16)); // Max 16 steps now (0-16, but step 16 is CTA)
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const findPreviousSession = useCallback(async (instagramHandle: string) => {
    setFoundPreviousSession(null);
    await searchPreviousSession(instagramHandle);
    // wait a tick for state
    await new Promise(r => setTimeout(r, 0));
    return !!foundPreviousSession;
  }, [searchPreviousSession, foundPreviousSession]);

  const openResumeModal = useCallback(() => setShowResumeModal(true), []);
  const closeResumeModal = useCallback(() => setShowResumeModal(false), []);

  return (
    <SupabaseDemoContext.Provider value={{
      currentStep,
      setCurrentStep,
      userData,
      setUserData,
      resetDemo,
      nextStep,
      prevStep,
      sessionId,
      dbSessionId,
      isLoading,
      saveSession,
      chatMessages,
      addChatMessage,
      resetChatInMemory,
      threadId,
      setThreadId,
      generateCustomPrompt,
      getLeadScore,
      showResumeModal,
      foundPreviousSession,
      resumePreviousSession,
      startNewTest,
      appointment,
      setAppointment,
      openResumeModal,
      closeResumeModal,
      findPreviousSession
    }}>
      {children}
    </SupabaseDemoContext.Provider>
  );
};

export const useSupabaseDemo = () => {
  const context = useContext(SupabaseDemoContext);
  if (context === undefined) {
    throw new Error('useSupabaseDemo must be used within a SupabaseDemoProvider');
  }
  return context;
};