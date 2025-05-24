
import { useCallback } from 'react';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions } from './types';
import { useLoadingState } from './useLoadingState';
import { loadAuthenticatedQuestions } from './useAuthenticatedQuestions';
import { fetchPracticeQuestions } from './services';

export function useQuestionLoader(
  user: any,
  category: QuestionCategory | null, 
  subcategory?: string | null,
  options: SpacedRepetitionOptions = {}
) {
  const {
    loading,
    setLoading,
    dueQuestions,
    setDueQuestions,
    progress,
    setProgress,
    error,
    setError
  } = useLoadingState();
  
  const regulationCategory = options.regulationCategory || "all";
  const batchSize = options.batchSize || 15;
  const includeAllSubcategories = options.includeAllSubcategories || false;

  const loadDueQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        // For non-authenticated users, load questions in practice mode
        console.log(`Loading practice questions for guest user with category=${category}, subcategory=${subcategory}, regulation=${regulationCategory}, batchSize=${batchSize}, includeAllSubcategories=${includeAllSubcategories}`);
        const practiceQuestions = await fetchPracticeQuestions(
          category as QuestionCategory,
          subcategory || undefined,
          regulationCategory,
          batchSize,
          includeAllSubcategories
        );
        setDueQuestions(practiceQuestions);
      } else {
        // Logic for authenticated users
        const result = await loadAuthenticatedQuestions(user, category, subcategory, options);
        setDueQuestions(result.questions);
        setProgress(result.progress);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading questions'));
      setDueQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [user, category, subcategory, options.practiceMode, options.regulationCategory, options.boxNumber, options.batchSize, options.includeAllSubcategories]);

  return {
    loading,
    error,
    dueQuestions,
    progress,
    loadDueQuestions,
    setError
  };
}
