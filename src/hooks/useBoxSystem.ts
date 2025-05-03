
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/types/questions';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getBoxesStats } from '@/hooks/spaced-repetition/services/user-progress';
import { transformQuestion } from '@/hooks/spaced-repetition/utils';
import { BoxStats } from '@/hooks/spaced-repetition/types';

export function useBoxSystem() {
  const { user } = useAuth();
  const [boxStats, setBoxStats] = useState<BoxStats[]>([]);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [boxQuestions, setBoxQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBoxStats();
    } else {
      setBoxStats([]);
      setLoading(false);
    }
  }, [user]);

  // Load stats for all boxes
  const loadBoxStats = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const stats = await getBoxesStats(user.id);
      setBoxStats(stats);
      
      // Automatically select the first box with due cards
      const firstBoxWithDueCards = stats.find(box => box.due > 0);
      if (firstBoxWithDueCards) {
        setActiveBox(firstBoxWithDueCards.boxNumber);
        await loadBoxQuestions(firstBoxWithDueCards.boxNumber);
      } else if (stats.some(box => box.total > 0)) {
        setActiveBox(1);
        await loadBoxQuestions(1);
      }
    } catch (error) {
      console.error("Error loading box stats:", error);
      toast.error("Fehler beim Laden der Box-Statistiken");
    } finally {
      setLoading(false);
    }
  };

  // Load questions for a specific box
  const loadBoxQuestions = async (boxNumber: number) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_progress')
        .select('*, questions(*)')
        .eq('user_id', user.id)
        .eq('box_number', boxNumber)
        .limit(10);

      if (error) throw error;

      const questions = (data || [])
        .filter(item => item.questions) // Filter out null questions
        .map(item => transformQuestion(item.questions));
      
      setBoxQuestions(questions);
    } catch (error) {
      console.error(`Error loading questions for box ${boxNumber}:`, error);
      toast.error(`Fehler beim Laden der Karten für Box ${boxNumber}`);
      setBoxQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle box selection
  const handleSelectBox = async (boxNumber: number) => {
    setActiveBox(boxNumber);
    await loadBoxQuestions(boxNumber);
  };

  return {
    boxStats,
    activeBox,
    boxQuestions,
    loading,
    handleSelectBox,
    refreshBoxData: loadBoxStats
  };
}
