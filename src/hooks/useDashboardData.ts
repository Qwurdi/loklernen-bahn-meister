
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { QuestionCategory } from '@/types/questions';
import { useMemo } from 'react';

export const useDashboardData = (regulationFilter: string) => {
  const { user } = useAuth();

  // Fetch due cards count with better caching
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
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
  });

  // Fetch user stats with better caching
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
      
      return {
        xp: data.xp || 0,
        level: Math.max(1, Math.floor(Math.sqrt(data.xp / 100)) + 1),
        streak_days: data.streak_days || 0,
        total_correct: data.total_correct || 0,
        total_incorrect: data.total_incorrect || 0,
        last_activity_date: data.last_activity_date
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes (renamed from cacheTime)
  });

  // Memoize the calculated values to prevent unnecessary rerenders
  const memoizedValues = useMemo(() => ({
    dueTodaySignals: dueCardsData?.categoryDueCards?.["Signale"] || 0,
    dueTodayBetriebsdienst: dueCardsData?.categoryDueCards?.["Betriebsdienst"] || 0,
    totalXP: statsData?.xp || 0,
    streak: statsData?.streak_days || 0,
  }), [dueCardsData, statsData]);

  return {
    ...memoizedValues,
    dueCardsData,
    statsData,
    isLoading: isLoadingDueCards || isLoadingStats
  };
};
