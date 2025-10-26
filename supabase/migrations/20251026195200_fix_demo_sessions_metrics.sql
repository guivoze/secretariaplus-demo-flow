-- Fix demo_sessions table metrics
-- 1. Remove redundant fields that are already in ai_insights JSONB or not used
-- 2. Add session timing columns (different from first_visit_at/last_visit_at)
-- 3. Update trigger to calculate time_spent_seconds

-- Drop redundant columns (data is duplicated in ai_insights JSONB or never filled)
ALTER TABLE demo_sessions 
DROP COLUMN IF EXISTS faturamento,
DROP COLUMN IF EXISTS followers_count,
DROP COLUMN IF EXISTS posts_count,
DROP COLUMN IF EXISTS profile_pic_url;

-- Add session timing columns
-- Note: first_visit_at/last_visit_at = across multiple visits (can be days apart)
--       session_started_at/session_ended_at = single session duration (minutes)
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS session_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS session_ended_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS session_duration_seconds INTEGER GENERATED ALWAYS AS (
  CASE 
    WHEN session_ended_at IS NOT NULL AND session_started_at IS NOT NULL 
    THEN EXTRACT(EPOCH FROM (session_ended_at - session_started_at))::INTEGER
    ELSE NULL
  END
) STORED;

-- Update trigger to calculate time_spent_seconds automatically
-- time_spent_seconds = total time across all visits (last_visit - first_visit)
CREATE OR REPLACE FUNCTION public.update_demo_sessions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.last_visit_at = now();
  
  -- Calculate total time spent across all visits (can be days)
  NEW.time_spent_seconds = EXTRACT(EPOCH FROM (NEW.last_visit_at - NEW.first_visit_at))::INTEGER;
  
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
$function$;

-- Add index for session timing queries
CREATE INDEX IF NOT EXISTS idx_demo_sessions_session_timing 
ON demo_sessions(session_started_at, session_ended_at);

-- Add helpful comments
COMMENT ON COLUMN demo_sessions.first_visit_at IS 'First time user accessed the demo (can be days ago)';
COMMENT ON COLUMN demo_sessions.last_visit_at IS 'Last time user accessed the demo (auto-updated)';
COMMENT ON COLUMN demo_sessions.time_spent_seconds IS 'Total time between first and last visit (can span multiple days)';
COMMENT ON COLUMN demo_sessions.session_started_at IS 'When current session started (step 3 confirmation)';
COMMENT ON COLUMN demo_sessions.session_ended_at IS 'When current session ended (step 12 or exit)';
COMMENT ON COLUMN demo_sessions.session_duration_seconds IS 'Duration of single session in seconds (auto-calculated)';
