
import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress } from '../types';
import { useLoadQuestions } from './useLoadQuestions';
import { useSafeState } from './useSafeState';
import { toast } from 'sonner';

/**
 * Hook to handle question data fetching and management
 */
export function useSpacedRepetitionData(
  category: string,
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
) {
  const { user } = useAuth();
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  
  const { safeSetState: setLoading, state: loading } = useSafeState(true);
  const { safeSetState: setError, state: error } = useSafeState<Error | null>(null);
  const { safeSetState: setDueQuestions, state: dueQuestions } = useSafeState<Question[]>([]);
  const { safeSetState: setProgress, state: progress } = useSafeState<UserProgress[]>([]);
  
  const { 
    loadQuestions, 
    loadingQuestions, 
    questionsError, 
    cleanup: cleanupQuestions 
  } = useLoadQuestions(
    user?.id, 
    category as QuestionCategory,
    subcategory, 
    options
  );
  
  const fetchData = useCallback(async () => {
    if (!user || !isMounted.current) return { questions: [], progressData: [] };
    
    // Prevent concurrent fetches
    if (isFetching.current) {
      console.log("Fetch already in progress, skipping");
      return { questions: [], progressData: [] };
    }
    
    isFetching.current = true;
    setLoading(true);
    
    try {
      const result = await loadQuestions();
      
      if (isMounted.current) {
        // Validate questions
        if (Array.isArray(result.questions)) {
          const validQuestions = result.questions.filter(q => 
            q && typeof q === 'object' && q.id && q.text
          );
          
          setDueQuestions(validQuestions);
        } else {
          setDueQuestions([]);
        }
        
        // Validate progress data
        if (Array.isArray(result.progressData)) {
          setProgress(result.progressData);
        } else {
          setProgress([]);
        }
      }
      
      return result;
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading questions'));
      
      return { questions: [], progressData: [] };
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, [user, loadQuestions, setLoading, setError, setDueQuestions, setProgress]);
  
  // Handle initial data loading
  useEffect(() => {
    fetchData();
    
    return () => {
      isMounted.current = false;
      cleanupQuestions();
    };
  }, [user?.id, category, subcategory, fetchData, cleanupQuestions]);
  
  // Update error state from child hooks
  useEffect(() => {
    if (questionsError) {
      setError(questionsError);
    }
  }, [questionsError, setError]);
  
  return {
    loading: loading || loadingQuestions,
    error,
    dueQuestions,
    progress,
    fetchData,
    isMounted,
    isFetching,
    cleanupQuestions,
    safeSetDueQuestions: setDueQuestions,
    safeSetProgress: setProgress,
    safeSetLoading: setLoading,
    safeSetError: setError
  };
}
