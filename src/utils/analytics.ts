import { supabase } from "@/integrations/supabase/client";

// Analytics queries ready for dashboard and commercial team

export const analytics = {
  // Get all sessions with lead scoring
  getAllSessions: async () => {
    const { data, error } = await supabase
      .from('demo_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Get high-value leads (lead_score >= 60)
  getHighValueLeads: async () => {
    const { data, error } = await supabase
      .from('demo_sessions')
      .select('*')
      .gte('lead_score', 60)
      .order('lead_score', { ascending: false });
    
    return { data, error };
  },

  // Get completion funnel data
  getCompletionFunnel: async () => {
    const { data, error } = await supabase
      .from('demo_sessions')
      .select('current_step, completion_percentage')
      .order('current_step', { ascending: true });
    
    return { data, error };
  },

  // Get sessions by date range
  getSessionsByDateRange: async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('demo_sessions')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Get abandoned sessions (users who started but didn't complete)
  getAbandonedSessions: async () => {
    const { data, error } = await supabase
      .from('demo_sessions')
      .select('*')
      .lt('completion_percentage', 100)
      .gt('current_step', 0)
      .order('last_visit_at', { ascending: false });
    
    return { data, error };
  },

  // Get conversion metrics
  getConversionMetrics: async () => {
    const { data: total } = await supabase
      .from('demo_sessions')
      .select('id', { count: 'exact', head: true });
    
    const { data: completed } = await supabase
      .from('demo_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('completion_percentage', 100);
    
    const { data: qualified } = await supabase
      .from('demo_sessions')
      .select('id', { count: 'exact', head: true })
      .gte('lead_score', 60);
    
    return {
      totalSessions: total?.length || 0,
      completedSessions: completed?.length || 0,
      qualifiedLeads: qualified?.length || 0,
      conversionRate: total?.length ? (completed?.length || 0) / total.length * 100 : 0,
      qualificationRate: total?.length ? (qualified?.length || 0) / total.length * 100 : 0
    };
  },

  // Get chat activity for sessions
  getChatActivity: async (sessionId?: string) => {
    let query = supabase
      .from('chat_messages')
      .select(`
        *,
        demo_sessions (
          instagram_handle,
          nome,
          lead_score
        )
      `)
      .order('timestamp_sent', { ascending: false });
    
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  // Get UTM performance
  getUTMPerformance: async () => {
    const { data, error } = await supabase
      .from('demo_sessions')
      .select('utm_source, utm_medium, utm_campaign, lead_score, completion_percentage')
      .not('utm_source', 'is', null);
    
    return { data, error };
  },

  // Get real-time metrics (last 24h)
  getRealTimeMetrics: async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data, error } = await supabase
      .from('demo_sessions')
      .select('*')
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false });
    
    return { data, error };
  }
};