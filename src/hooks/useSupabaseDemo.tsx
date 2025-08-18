import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  instagram: string;
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
  metadata?: any;
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
  isLoading: boolean;
  saveSession: () => Promise<void>;
  chatMessages: ChatMessage[];
  addChatMessage: (content: string, sender: 'user' | 'assistant', metadata?: any) => Promise<void>;
  generateCustomPrompt: () => string;
  getLeadScore: () => number;
}

const initialUserData: UserData = {
  instagram: '',
  nome: '',
  email: '',
  whatsapp: '',
  especialidade: '',
  faturamento: '',
  followers: '1.2K',
  posts: '324',
  profilePic: null,
  clinicName: 'Clínica Exemplo',
  procedures: ['Botox', 'Preenchimento', 'Limpeza de Pele'],
  hasInstagramData: false,
  realProfilePic: null,
  realPosts: [],
  aiInsights: null,
  instagramRequestTime: null
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

  // Generate or retrieve session ID
  const initializeSession = useCallback(async () => {
    try {
      const fingerprint = generateBrowserFingerprint();
      const sessionKey = `demo-session-${fingerprint}`;
      
      // Check localStorage first
      let storedSessionId = localStorage.getItem(sessionKey);
      
      if (storedSessionId) {
        // Try to find existing session in Supabase
        const { data: existingSession } = await supabase
          .from('demo_sessions')
          .select('*')
          .eq('session_id', storedSessionId)
          .single();

        if (existingSession) {
          // Resume existing session
          setSessionId(storedSessionId);
          setDbSessionId(existingSession.id);
          setCurrentStep(existingSession.current_step);
          
          // Restore user data
          const restoredData: UserData = {
            instagram: existingSession.instagram_handle,
            nome: existingSession.nome || '',
            email: existingSession.email || '',
            whatsapp: existingSession.whatsapp || '',
            especialidade: existingSession.especialidade || '',
            faturamento: existingSession.faturamento || '',
            followers: existingSession.followers_count || '1.2K',
            posts: existingSession.posts_count || '324',
            profilePic: existingSession.profile_pic_url,
            clinicName: 'Clínica Exemplo',
            procedures: ['Botox', 'Preenchimento', 'Limpeza de Pele'],
            hasInstagramData: existingSession.has_instagram_data,
            realProfilePic: existingSession.real_profile_pic_url,
            realPosts: existingSession.real_posts ? existingSession.real_posts as string[] : [],
            aiInsights: existingSession.ai_insights as any,
            instagramRequestTime: existingSession.created_at ? new Date(existingSession.created_at).getTime() : null
          };
          
          setUserDataState(restoredData);
          
          // Update visit count
          await supabase
            .from('demo_sessions')
            .update({ 
              total_visits: existingSession.total_visits + 1,
              last_visit_at: new Date().toISOString()
            })
            .eq('id', existingSession.id);
            
          return;
        }
      }
      
      // Create new session ID
      const newSessionId = `${fingerprint}_${Date.now()}`;
      setSessionId(newSessionId);
      localStorage.setItem(sessionKey, newSessionId);
      
    } catch (error) {
      console.error('Error initializing session:', error);
      // Fallback to basic session
      const fallbackId = `fallback_${Date.now()}`;
      setSessionId(fallbackId);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save session to Supabase
  const saveSession = useCallback(async () => {
    if (!sessionId) return;
    
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
        custom_prompt: generateCustomPrompt(),
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
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, [sessionId, userData, currentStep, dbSessionId]);

  // Auto-save when important data changes
  useEffect(() => {
    if (sessionId && !isLoading) {
      const timer = setTimeout(() => {
        saveSession();
      }, 1000); // Debounce saves
      
      return () => clearTimeout(timer);
    }
  }, [userData, currentStep, sessionId, isLoading, saveSession]);

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
          metadata: msg.message_metadata
        }));
        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  }, [dbSessionId]);

  // Add chat message
  const addChatMessage = useCallback(async (content: string, sender: 'user' | 'assistant', metadata?: any) => {
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
          message_metadata: metadata || {}
        })
        .select()
        .single();
        
      if (data) {
        const newMessage: ChatMessage = {
          id: data.id,
          content: data.content,
          sender: data.sender_type as 'user' | 'assistant',
          timestamp: new Date(data.timestamp_sent),
          metadata: data.message_metadata
        };
        setChatMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error adding chat message:', error);
    }
  }, [dbSessionId, chatMessages.length]);

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

  const setUserData = (data: Partial<UserData>) => {
    setUserDataState(prev => ({ ...prev, ...data }));
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setUserDataState(initialUserData);
    setChatMessages([]);
    // Clear localStorage
    localStorage.clear();
    // Force new session
    initializeSession();
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 15));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

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
      isLoading,
      saveSession,
      chatMessages,
      addChatMessage,
      generateCustomPrompt,
      getLeadScore
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