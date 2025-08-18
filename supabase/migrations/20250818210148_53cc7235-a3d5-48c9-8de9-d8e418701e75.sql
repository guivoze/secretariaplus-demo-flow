-- Drop the table and recreate without nested generated columns
DROP TABLE IF EXISTS public.chat_messages;
DROP TABLE IF EXISTS public.demo_sessions;

-- Create demo_sessions table for tracking user sessions (fixed)
CREATE TABLE public.demo_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE, -- Browser fingerprint + timestamp
  instagram_handle TEXT NOT NULL,
  nome TEXT,
  email TEXT,
  whatsapp TEXT,
  especialidade TEXT,
  faturamento TEXT,
  current_step INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL DEFAULT 16,
  completion_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  
  -- Instagram data
  has_instagram_data BOOLEAN NOT NULL DEFAULT false,
  followers_count TEXT,
  posts_count TEXT,
  profile_pic_url TEXT,
  real_profile_pic_url TEXT,
  real_posts JSONB DEFAULT '[]'::jsonb,
  
  -- AI insights for personalization
  ai_insights JSONB,
  custom_prompt TEXT, -- Personalized prompt for chat
  
  -- Tracking fields
  first_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_visits INTEGER NOT NULL DEFAULT 1,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  lead_score INTEGER NOT NULL DEFAULT 10,
  
  -- UTM and source tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for storing chat history
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.demo_sessions(id) ON DELETE CASCADE,
  message_order INTEGER NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'assistant')),
  content TEXT NOT NULL,
  timestamp_sent TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Message metadata
  message_metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.demo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public access for demo purposes)
CREATE POLICY "Demo sessions are publicly accessible" 
ON public.demo_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Chat messages are publicly accessible" 
ON public.chat_messages 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_demo_sessions_session_id ON public.demo_sessions(session_id);
CREATE INDEX idx_demo_sessions_instagram ON public.demo_sessions(instagram_handle);
CREATE INDEX idx_demo_sessions_completion ON public.demo_sessions(completion_percentage);
CREATE INDEX idx_demo_sessions_lead_score ON public.demo_sessions(lead_score);
CREATE INDEX idx_demo_sessions_created_at ON public.demo_sessions(created_at);
CREATE INDEX idx_demo_sessions_last_visit ON public.demo_sessions(last_visit_at);

CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_order ON public.chat_messages(session_id, message_order);
CREATE INDEX idx_chat_messages_timestamp ON public.chat_messages(timestamp_sent);

-- Create function to update timestamps and calculated fields
CREATE OR REPLACE FUNCTION public.update_demo_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_visit_at = now();
  
  -- Calculate completion percentage
  IF NEW.total_steps > 0 THEN
    NEW.completion_percentage = (NEW.current_step::decimal / NEW.total_steps::decimal) * 100;
  END IF;
  
  -- Calculate lead score based on completion
  IF NEW.completion_percentage >= 100 THEN
    NEW.lead_score = 100;
  ELSIF NEW.completion_percentage >= 80 THEN
    NEW.lead_score = 80;
  ELSIF NEW.completion_percentage >= 60 THEN
    NEW.lead_score = 60;
  ELSIF NEW.completion_percentage >= 40 THEN
    NEW.lead_score = 40;
  ELSIF NEW.completion_percentage >= 20 THEN
    NEW.lead_score = 20;
  ELSE
    NEW.lead_score = 10;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp and calculation updates
CREATE TRIGGER update_demo_sessions_updated_at
  BEFORE UPDATE ON public.demo_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_demo_sessions_updated_at();

-- Create function to generate browser fingerprint-based session ID
CREATE OR REPLACE FUNCTION public.generate_session_id(
  p_user_agent TEXT DEFAULT '',
  p_screen_info TEXT DEFAULT '',
  p_timezone TEXT DEFAULT ''
)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    digest(
      p_user_agent || '_' || 
      p_screen_info || '_' || 
      p_timezone || '_' || 
      extract(epoch from now())::text,
      'sha256'
    ),
    'hex'
  );
END;
$$ LANGUAGE plpgsql;