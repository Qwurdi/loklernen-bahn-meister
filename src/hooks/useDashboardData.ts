
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { RegulationFilterType } from "@/types/questions";

export function useDashboardData(regulationPreference: RegulationFilterType) {
  const { user } = useAuth();
  const [dueTodaySignals, setDueTodaySignals] = useState(0);
  const [dueTodayBetriebsdienst, setDueTodayBetriebsdienst] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDueCards = useCallback(async (category: string, regulationFilter: string) => {
    try {
      if (!user) return 0;
      
      // Get current date in ISO format for comparison
      const now = new Date().toISOString();
      
      // Query user_progress joined with questions to filter by category and regulation
      let query = supabase
        .from('user_progress')
        .select('question_id, questions!inner(category, regulation_category)', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('questions.category', category)
        .lte('next_review_at', now);

      // Add regulation filter
      if (regulationFilter) {
        // Use proper format for OR conditions with parentheses
        query = query.or(`questions.regulation_category.eq.${regulationFilter},questions.regulation_category.eq.both,questions.regulation_category.is.null`);
      }
        
      const { count, error } = await query;
        
      if (error) {
        console.error(`Error fetching ${category} due cards:`, error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error(`Error fetching ${category} due cards:`, error);
      return 0;
    }
  }, [user]);

  const fetchUserStats = useCallback(async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_stats')
        .select('streak_days, xp')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching user stats:", error);
        return;
      }
      
      if (data) {
        setStreak(data.streak_days);
        setTotalXP(data.xp);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch due cards for both categories
        const signalsDue = await fetchDueCards('Signale', regulationPreference);
        const betriebsdienstDue = await fetchDueCards('Betriebsdienst', regulationPreference);
        
        setDueTodaySignals(signalsDue);
        setDueTodayBetriebsdienst(betriebsdienstDue);
        
        await fetchUserStats();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Fehler beim Laden der Dashboard-Daten");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchDueCards, fetchUserStats, regulationPreference, user]);

  return {
    dueTodaySignals,
    dueTodayBetriebsdienst,
    streak,
    totalXP,
    loading
  };
}
