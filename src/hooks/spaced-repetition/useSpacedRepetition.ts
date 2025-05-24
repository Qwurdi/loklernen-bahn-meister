
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, SpacedRepetitionResult } from './types';
import { useQuestionLoader } from './useQuestionLoader';
import { useAnswerSubmission } from './useAnswerSubmission';

export function useSpacedRepetition(
  category: QuestionCategory | null, 
  subcategory?: string | null,
  options: SpacedRepetitionOptions = {}
): SpacedRepetitionResult {
  const { user } = useAuth();
  
  // Use the question loader hook
  const {
    loading,
    error,
    dueQuestions,
    progress,
    loadDueQuestions,
    setError
  } = useQuestionLoader(user, category, subcategory, options);
  
  // Use the answer submission hook
  const {
    submitAnswer,
    applyPendingUpdates: baseApplyPendingUpdates,
    pendingUpdatesCount
  } = useAnswerSubmission(user, progress);

  useEffect(() => {
    loadDueQuestions();
  }, [loadDueQuestions]);

  // Wrapper for applyPendingUpdates that includes loading state
  const applyPendingUpdates = async () => {
    try {
      await baseApplyPendingUpdates(loadDueQuestions);
    } catch (error) {
      console.error('Error applying updates:', error);
      setError(error instanceof Error ? error : new Error('Unknown error applying updates'));
    }
  };

  return {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount,
    applyPendingUpdates,
    reloadQuestions: loadDueQuestions
  };
}
