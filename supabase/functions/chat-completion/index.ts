import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';
import { BASE_PROMPT_TEMPLATE } from './prompt.ts';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
const supabaseUrl = 'https://yuorlidtcnhcpuxpqwec.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const { sessionId, threadId, message, nowEpochMs } = await req.json();
    console.log('Chat completion request:', {
      sessionId,
      message
    });
    if (!sessionId || !message) {
      throw new Error('Missing sessionId or message');
    }
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    // Get session data
    const { data: sessionData, error: sessionError } = await supabase.from('demo_sessions').select('*').eq('session_id', sessionId).single();
    if (sessionError || !sessionData) {
      console.error('Session not found:', sessionError);
      throw new Error('Session not found');
    }
    console.log('[chat-fn] Session data found for session_id:', sessionId, 'db id:', sessionData.id);
    // Get conversation history
    // Se threadId vier, limita o histórico a esta thread (metadata JSON tem threadId)
    const chatQuery = supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionData.id)
      .order('created_at', { ascending: true });
    const { data: chatHistory, error: chatError } = threadId
      ? await chatQuery.contains('message_metadata', { threadId })
      : await chatQuery
    ;
    
    // Ordem já garantida acima
    /* .order('created_at', {
      ascending: true
    }); */
    if (chatError) {
      console.error('Error fetching chat history:', chatError);
      throw new Error('Error fetching chat history');
    }
    console.log('[chat-fn] Chat history count:', chatHistory?.length || 0);
    // User message already saved by frontend
    // Build conversation history for OpenAI
    const conversationHistory = chatHistory?.map((msg)=>({
        role: msg.sender_type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })) || [];
    // Add current user message
    conversationHistory.push({
      role: 'user',
      content: message
    });
    // Build prompt from fixed template and slot {{CUSTOM_PROMPT}}
    const filledPrompt = BASE_PROMPT_TEMPLATE.replace('{{CUSTOM_PROMPT}}', sessionData.custom_prompt || '');
    console.log('[chat-fn] Using system prompt (first 400 chars):', String(filledPrompt).slice(0, 400));
    console.log('[chat-fn] Sending request to OpenAI...');
    // Define tools for function calling
    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_date',
          description: 'Retorna a data e hora atuais ajustadas ao fuso America/Sao_Paulo',
          parameters: {
            type: 'object',
            properties: {},
            additionalProperties: false
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'appointment',
          description: 'Registra um agendamento confirmado na conversa',
          parameters: {
            type: 'object',
            properties: {
              dateISO: {
                type: 'string',
                description: 'Data/hora em ISO 8601 (ex: 2025-08-20T15:35:00-03:00)'
              },
              displayDate: {
                type: 'string',
                description: 'Data por extenso para UI (ex: 20 de Agosto, 2025)'
              },
              displayTime: {
                type: 'string',
                description: 'Hora no formato HH:mm (ex: 15:35)'
              },
              patientName: {
                type: 'string'
              },
              procedure: {
                type: 'string'
              }
            },
            required: [
              'dateISO',
              'displayDate',
              'displayTime'
            ],
            additionalProperties: false
          }
        }
      }
    ];
    let messages = [
      {
        role: 'system',
        content: filledPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];
    let appointmentPayload = null;
    let aiMessage = null;
    // Up to 3 tool-call iterations
    for(let i = 0; i < 3; i++){
      console.log('[chat-fn] Iteration', i + 1, 'messages length:', messages.length);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini-2025-04-14',
          messages,
          tools,
          tool_choice: 'auto',
          max_tokens: 300,
          temperature: 0.7
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }
      const data = await response.json();
      const choice = data.choices?.[0];
      const msg = choice?.message;
      if (!msg) throw new Error('No message from OpenAI');
      // If there are tool calls, execute them and append results
      const toolCalls = msg.tool_calls || [];
      if (toolCalls.length > 0) {
        console.log('[chat-fn] Tool calls received:', toolCalls.map((t)=>t.function?.name));
        messages.push({
          role: msg.role,
          content: msg.content || '',
          tool_calls: toolCalls
        });
        for (const tc of toolCalls){
          const fn = tc.function;
          let result = {};
          try {
            const args = fn.arguments ? JSON.parse(fn.arguments) : {};
            if (fn.name === 'get_date') {
              const tz = 'America/Sao_Paulo';
              // Use timestamp do cliente se vier (melhora consistência em dev/proxy)
              const nowUTC = nowEpochMs ? new Date(nowEpochMs) : new Date();
              const dateFmt = new Intl.DateTimeFormat('en-CA', {
                timeZone: tz,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hourCycle: 'h23'
              });
              const parts = dateFmt.formatToParts(nowUTC);
              const y = parts.find((p)=>p.type === 'year')?.value;
              const m = parts.find((p)=>p.type === 'month')?.value;
              const d = parts.find((p)=>p.type === 'day')?.value;
              const hh = parts.find((p)=>p.type === 'hour')?.value;
              const mm = parts.find((p)=>p.type === 'minute')?.value;
              const ss = parts.find((p)=>p.type === 'second')?.value;
              // America/Sao_Paulo atualmente UTC-03 o ano todo
              const localISO = `${y}-${m}-${d}T${hh}:${mm}:${ss}-03:00`;
              const fmtDate = new Intl.DateTimeFormat('pt-BR', {
                timeZone: tz,
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }).format(nowUTC);
              const fmtTime = new Intl.DateTimeFormat('pt-BR', {
                timeZone: tz,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).format(nowUTC);
              result = {
                iso: localISO,
                timeZone: tz,
                dateBR: fmtDate,
                timeBR: fmtTime
              };
              console.log('[chat-fn] get_date ->', result);
            } else if (fn.name === 'appointment') {
              const { dateISO, displayDate, displayTime, patientName, procedure } = args;
              const tz = 'America/Sao_Paulo';
              const nowBase = nowEpochMs ? new Date(nowEpochMs) : new Date();

              // Helper para formatar um Date (em tz) para ISO local -03:00
              const toLocalISO = (d: Date) => {
                const fmt = new Intl.DateTimeFormat('en-CA', {
                  timeZone: tz,
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
                });
                const p = fmt.formatToParts(d);
                const y = p.find(x=>x.type==='year')?.value;
                const m = p.find(x=>x.type==='month')?.value;
                const dd = p.find(x=>x.type==='day')?.value;
                const hh = p.find(x=>x.type==='hour')?.value;
                const mm = p.find(x=>x.type==='minute')?.value;
                const ss = p.find(x=>x.type==='second')?.value;
                return `${y}-${m}-${dd}T${hh}:${mm}:${ss}-03:00`;
              };

              let base = dateISO ? new Date(dateISO) : new Date();

              // Normalização de datas antigas: se estiver no passado, ajuste para ano atual, e se ainda ficar no passado, empurre 7 dias
              const now = nowBase;
              const nowYear = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric' }).format(now);
              let bYear = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric' }).format(base);
              if (parseInt(bYear) < parseInt(nowYear)) {
                // Reescreve o ano do agendamento para o ano corrente, mantendo mês/dia/hora
                const parts = new Intl.DateTimeFormat('en-CA', {
                  timeZone: tz,
                  year: 'numeric', month: '2-digit', day: '2-digit',
                  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
                }).formatToParts(base);
                const m = parts.find(x=>x.type==='month')?.value;
                const d = parts.find(x=>x.type==='day')?.value;
                const hh = parts.find(x=>x.type==='hour')?.value;
                const mm = parts.find(x=>x.type==='minute')?.value;
                const ss = parts.find(x=>x.type==='second')?.value;
                const rebuilt = `${nowYear}-${m}-${d}T${hh}:${mm}:${ss}-03:00`;
                base = new Date(rebuilt);
              }
              // Se ainda estiver no passado, empurra em blocos de 7 dias até ficar no futuro próximo
              let safety = 0;
              while (base.getTime() < now.getTime() && safety < 8) {
                base = new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000);
                safety++;
              }

              const localISO = toLocalISO(base);
              const dateLabel = new Intl.DateTimeFormat('pt-BR', {
                timeZone: tz,
                day: '2-digit', month: 'long', year: 'numeric'
              }).format(base);
              const timeLabel = new Intl.DateTimeFormat('pt-BR', {
                timeZone: tz,
                hour: '2-digit', minute: '2-digit', hour12: false
              }).format(base);

              appointmentPayload = {
                dateISO: localISO,
                displayDate: displayDate || dateLabel,
                displayTime: displayTime || timeLabel,
                patientName: patientName || null,
                procedure: procedure || null
              };
              result = {
                ok: true
              };
              console.log('[chat-fn] appointment payload stored:', appointmentPayload);
            } else {
              result = {
                error: 'Unknown tool'
              };
            }
          } catch (e) {
            result = {
              error: String(e)
            };
            console.error('[chat-fn] Tool error:', e);
          }
          messages.push({
            role: 'tool',
            tool_call_id: tc.id,
            name: fn.name,
            content: JSON.stringify(result)
          });
        }
        continue;
      }
      // No tool calls: capture final content
      aiMessage = msg.content || '';
      console.log('[chat-fn] Final AI message length:', aiMessage.length);
      break;
    }
    if (!aiMessage) aiMessage = '…';
    console.log('[chat-fn] Returning success. Has appointment?', Boolean(appointmentPayload));
    return new Response(JSON.stringify({
      message: aiMessage,
      success: true,
      appointment: appointmentPayload
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in chat-completion function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
