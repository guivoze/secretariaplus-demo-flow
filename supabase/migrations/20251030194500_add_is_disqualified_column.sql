-- Add is_disqualified column to demo_sessions
-- This helps identify leads that were disqualified (e.g., "Estética Geral")
-- Both qualified and disqualified leads reach step 13, so we need this flag

ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS is_disqualified BOOLEAN DEFAULT FALSE;

-- Add index for analytics queries
CREATE INDEX IF NOT EXISTS idx_demo_sessions_is_disqualified 
ON demo_sessions(is_disqualified);

-- Add helpful comment
COMMENT ON COLUMN demo_sessions.is_disqualified IS 'TRUE if lead was disqualified (e.g., "Estética Geral"), FALSE for qualified leads. Helps differentiate since both reach step 13.';
