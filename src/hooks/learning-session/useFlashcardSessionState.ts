
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFlashcardSessionState(userId?: string) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);

  const { data: dueTodayStats } = useQuery({
    queryKey: ['dueTodayCount', userId],
    queryFn: async () => {
      if (!userId) return { count: 0 };
      
      const { count, error } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .lte('next_review_at', new Date().toISOString());
        
      if (error) throw error;
      
      return { count: count || 0 };
    },
    enabled: !!userId
  });

  const remainingToday = (dueTodayStats?.count || 0);

  const handleAnswer = async (questionId: string, score: number, submitAnswer?: Function) => {
    if (submitAnswer) {
      await submitAnswer(questionId, score);
    }

    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    setSessionFinished(true);
  };

  return {
    currentIndex,
    setCurrentIndex, 
    correctCount,
    sessionFinished,
    remainingToday,
    handleAnswer,
    handleComplete
  };
}
