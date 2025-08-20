import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

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

    // Save user message
    const { error: saveUserError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionData.id,
        content: message,
        sender_type: 'user',
        message_order: (chatHistory?.length || 0) + 1
      });

    if (saveUserError) {
      console.error('Error saving user message:', saveUserError);
      throw new Error('Error saving user message');
    }

    // Build conversation history for OpenAI
    const conversationHistory = chatHistory?.map(msg => ({
      role: msg.sender_type === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) || [];

    // Add current user message
    conversationHistory.push({ role: 'user', content: message });

    // Build custom prompt
    const basePrompt = `Você é uma assistente virtual especializada em marketing digital e Instagram para profissionais da saúde. Você trabalha para uma agência que ajuda médicos e dentistas a crescerem no Instagram.

Informações sobre o lead:
- Nome: ${sessionData.nome || 'Não informado'}
- Instagram: @${sessionData.instagram_handle}
- Especialidade: ${sessionData.especialidade || 'Não informado'}
- Faturamento: ${sessionData.faturamento || 'Não informado'}
- Seguidores: ${sessionData.followers_count || 'Não informado'}
- Posts: ${sessionData.posts_count || 'Não informado'}

${sessionData.custom_prompt ? `Análise personalizada: ${sessionData.custom_prompt}` : ''}

Você deve:
- Ser amigável e profissional
- Fazer perguntas relevantes sobre os desafios do lead no Instagram
- Oferecer insights valiosos sobre marketing digital para área da saúde
- Sugerir estratégias específicas baseadas no perfil
- Eventualmente propor um agendamento para uma consultoria gratuita
- Usar um tom conversacional, como se fosse WhatsApp
- Manter as respostas concisas (máximo 3-4 linhas)`;

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
          { role: 'system', content: basePrompt },
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

    // Save AI message
    const { error: saveAIError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionData.id,
        content: aiMessage,
        sender_type: 'assistant',
        message_order: (chatHistory?.length || 0) + 2
      });

    if (saveAIError) {
      console.error('Error saving AI message:', saveAIError);
      // Don't throw here - still return the message even if save fails
    }

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