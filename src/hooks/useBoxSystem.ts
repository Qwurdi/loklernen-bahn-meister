
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BoxStats } from '@/components/flashcards/boxes/LearningBoxesDisplay';
import { Question, RegulationCategory } from '@/types/questions';
import { transformAnswers } from '@/api/questions';

export function useBoxSystem() {
  const { user } = useAuth();
  const [activeBox, setActiveBox] = useState<number | null>(null);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['boxSystem', user?.id],
    queryFn: async () => {
      if (!user) return { boxStats: [], boxQuestions: [] };
      
      // Fetch box statistics
      const { data: progressData, error: statsError } = await supabase
        .from('user_progress')
        .select('box_number')
        .eq('user_id', user.id);
        
      if (statsError) throw statsError;
      
      // Fetch due cards counts
      const { data: dueData, error: dueError } = await supabase
        .from('user_progress')
        .select('box_number')
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString());
        
      if (dueError) throw dueError;
      
      // Create box statistics with total and due counts
      const boxStats: BoxStats[] = Array.from({ length: 5 }, (_, i) => {
        const boxNumber = i + 1;
        // Count total cards in this box
        const totalCount = progressData?.filter(item => item.box_number === boxNumber).length || 0;
        // Count due cards in this box
        const dueCount = dueData?.filter(item => item.box_number === boxNumber).length || 0;
        
        return {
          boxNumber,
          count: totalCount,
          due: dueCount,
          name: `Box ${boxNumber}`,
          color: getBoxColor(boxNumber),
          border: getBoxBorder(boxNumber)
        };
      });
      
      // Initial fetch without box questions (they'll be loaded when a box is selected)
      return { boxStats, boxQuestions: [] };
    },
    enabled: !!user
  });
  
  // Query for questions in the selected box
  const { data: boxQuestionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['boxQuestions', user?.id, activeBox],
    queryFn: async () => {
      if (!user || !activeBox) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          questions(*)
        `)
        .eq('user_id', user.id)
        .eq('box_number', activeBox)
        .order('next_review_at', { ascending: true });
        
      if (error) throw error;
      
      // Transform the questions data to match our Question type
      return (data || []).map(item => {
        // Handle the regulation_category field properly
        let regulationCategory: RegulationCategory | undefined;
        
        if (item.questions.regulation_category === 'DS 301' || 
            item.questions.regulation_category === 'DV 301' || 
            item.questions.regulation_category === 'both') {
          regulationCategory = item.questions.regulation_category as RegulationCategory;
        }
        
        return {
          ...item.questions,
          regulation_category: regulationCategory,
          answers: transformAnswers(item.questions.answers)
        } as Question;
      });
    },
    enabled: !!user && activeBox !== null
  });
  
  const handleSelectBox = (boxNumber: number) => {
    setActiveBox(prev => prev === boxNumber ? null : boxNumber);
  };
  
  const refreshBoxData = () => {
    refetch();
  };
  
  const loading = isLoading || questionsLoading;
  const boxStats = data?.boxStats || [];
  const boxQuestions = boxQuestionsData || [];
  
  return {
    boxStats,
    activeBox,
    boxQuestions,
    loading,
    handleSelectBox,
    refreshBoxData
  };
}

// Helper functions to get box colors and borders
function getBoxColor(boxNumber: number): string {
  switch (boxNumber) {
    case 1: return "bg-red-500";
    case 2: return "bg-amber-500";
    case 3: return "bg-yellow-400";
    case 4: return "bg-lime-500";
    case 5: return "bg-green-600";
    default: return "bg-gray-500";
  }
}

function getBoxBorder(boxNumber: number): string {
  switch (boxNumber) {
    case 1: return "border-red-400";
    case 2: return "border-amber-400";
    case 3: return "border-yellow-300";
    case 4: return "border-lime-400";
    case 5: return "border-green-500";
    default: return "border-gray-400";
  }
}
