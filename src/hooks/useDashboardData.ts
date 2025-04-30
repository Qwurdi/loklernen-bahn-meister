
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { QuestionCategory } from '@/types/questions';

export const useDashboardData = (regulationFilter: string) => {
  const { user } = useAuth();

  // Fetch due cards count
  const { data: dueCardsData, isLoading: isLoadingDueCards } = useQuery({
    queryKey: ['dueCards', user?.id, regulationFilter],
    queryFn: async () => {
      if (!user) return { totalDueCards: 0, categoryDueCards: {} };

      // Query due cards count
      const { count, error } = await supabase
        .from('user_progress')
        .select('*, questions!inner(*)', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString());
        
      if (error) throw error;
      
      // Get counts per category (both signals and operations)
      const { data: categoryData, error: categoryError } = await supabase
        .from('user_progress')
        .select('questions!inner(category)')
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString());
      
      if (categoryError) throw categoryError;
      
      // Count due cards by category
      const categoryDueCards: Record<string, number> = {};
      categoryData?.forEach(item => {
        const category = item.questions?.category as QuestionCategory;
        if (category) {
          categoryDueCards[category] = (categoryDueCards[category] || 0) + 1;
        }
      });
      
      return { 
        totalDueCards: count || 0,
        categoryDueCards
      };
    },
    enabled: !!user
  });

  // Fetch user stats
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user) return { xp: 0, level: 1, streak_days: 0 };

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) return { xp: 0, level: 1, streak_days: 0 };
      
      // Calculate level - basic exponential curve
      const level = Math.max(1, Math.floor(Math.sqrt(data.xp / 100)) + 1);
      
      return {
        xp: data.xp || 0,
        level,
        streak_days: data.streak_days || 0,
        total_correct: data.total_correct || 0,
        total_incorrect: data.total_incorrect || 0,
        last_activity_date: data.last_activity_date
      };
    },
    enabled: !!user
  });

  // Calculate values needed by dashboard components
  const dueTodaySignals = dueCardsData?.categoryDueCards?.["Signale"] || 0;
  const dueTodayBetriebsdienst = dueCardsData?.categoryDueCards?.["Betriebsdienst"] || 0;
  const totalXP = statsData?.xp || 0;
  const streak = statsData?.streak_days || 0;

  return {
    dueCardsData,
    statsData,
    dueTodaySignals,
    dueTodayBetriebsdienst,
    totalXP,
    streak,
    isLoading: isLoadingDueCards || isLoadingStats
  };
};
