import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';
import { BASE_PROMPT_TEMPLATE } from './prompt.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://yuorlidtcnhcpuxpqwec.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, message } = await req.json();
    console.log('Chat completion request:', { sessionId, message });

    if (!sessionId || !message) {
      throw new Error('Missing sessionId or message');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get session data
    const { data: sessionData, error: sessionError } = await supabase
      .from('demo_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !sessionData) {
      console.error('Session not found:', sessionError);
      throw new Error('Session not found');
    }

    console.log('Session data found:', sessionData);

    // Get conversation history
    const { data: chatHistory, error: chatError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionData.id)
      .order('created_at', { ascending: true });

    if (chatError) {
      console.error('Error fetching chat history:', chatError);
      throw new Error('Error fetching chat history');
    }

    console.log('Chat history:', chatHistory?.length || 0, 'messages');

    // User message already saved by frontend

    // Build conversation history for OpenAI
    const conversationHistory = chatHistory?.map(msg => ({
      role: msg.sender_type === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) || [];

    // Add current user message
    conversationHistory.push({ role: 'user', content: message });

    // Build prompt from fixed template and slot {{CUSTOM_PROMPT}}
    const filledPrompt = BASE_PROMPT_TEMPLATE
      .replace('{{CUSTOM_PROMPT}}', sessionData.custom_prompt || '');

    console.log('Sending request to OpenAI...');

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini-2025-04-14',
        messages: [
          { role: 'system', content: filledPrompt },
          ...conversationHistory
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('No response from OpenAI');
    }

    console.log('AI response:', aiMessage);

    // AI message will be saved by frontend

    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});