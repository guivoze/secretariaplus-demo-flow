-- Remove políticas inseguras atuais
DROP POLICY IF EXISTS "Demo sessions are publicly accessible" ON public.demo_sessions;
DROP POLICY IF EXISTS "Chat messages are publicly accessible" ON public.chat_messages;

-- Política segura para demo_sessions baseada em browser fingerprint
-- Permite acesso apenas a sessões do mesmo browser (fingerprint)
CREATE POLICY "Users can only access their own browser sessions" 
ON public.demo_sessions 
FOR ALL 
USING (
  -- Extrai o fingerprint do session_id (parte antes do primeiro _)
  split_part(session_id, '_', 1) = split_part(
    COALESCE(
      current_setting('request.headers', true)::json->>'x-session-fingerprint',
      'anonymous'
    ), '_', 1
  )
  OR 
  -- Fallback para permitir operações quando fingerprint não está disponível
  (current_setting('request.headers', true) IS NULL)
)
WITH CHECK (
  -- Mesma lógica para inserções/atualizações
  split_part(session_id, '_', 1) = split_part(
    COALESCE(
      current_setting('request.headers', true)::json->>'x-session-fingerprint',
      session_id
    ), '_', 1
  )
);

-- Política segura para chat_messages baseada na relação com demo_sessions
CREATE POLICY "Users can only access messages from their own sessions" 
ON public.chat_messages 
FOR ALL 
USING (
  session_id IN (
    SELECT id FROM public.demo_sessions 
    WHERE split_part(session_id, '_', 1) = split_part(
      COALESCE(
        current_setting('request.headers', true)::json->>'x-session-fingerprint',
        'anonymous'
      ), '_', 1
    )
  )
)
WITH CHECK (
  session_id IN (
    SELECT id FROM public.demo_sessions 
    WHERE split_part(session_id, '_', 1) = split_part(
      COALESCE(
        current_setting('request.headers', true)::json->>'x-session-fingerprint',
        session_id
      ), '_', 1
    )
  )
);

-- Função helper para bypassar RLS em operações administrativas (analytics)
CREATE OR REPLACE FUNCTION public.get_admin_sessions()
RETURNS SETOF public.demo_sessions
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM public.demo_sessions;
$$;

-- Função helper para analytics de chat
CREATE OR REPLACE FUNCTION public.get_admin_chat_messages()
RETURNS SETOF public.chat_messages  
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM public.chat_messages;
$$;