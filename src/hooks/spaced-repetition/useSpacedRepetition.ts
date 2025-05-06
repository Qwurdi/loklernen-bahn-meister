
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress, SpacedRepetitionResult } from './types';
import { useLoadQuestions } from './hooks/useLoadQuestions';
import { useQuestionUpdates } from './hooks/useQuestionUpdates';
import { usePendingUpdates } from './hooks/usePendingUpdates';
import { toast } from 'sonner';

/**
 * Enhanced spaced repetition hook with error handling, memory leak prevention, 
 * and performance optimizations
 */
export function useSpacedRepetition(
  category: string, 
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
): SpacedRepetitionResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  // Track if component is mounted to prevent memory leaks
  const isMounted = useRef(true);
  // Track if we're currently fetching to prevent race conditions
  const isFetching = useRef(false);
  
  // Use specialized hooks for different concerns
  const { loadQuestions, loadingQuestions, questionsError } = useLoadQuestions(
    user?.id, 
    category as QuestionCategory, // Cast to QuestionCategory type
    subcategory, 
    options
  );
  
  const { pendingUpdates, addPendingUpdate, clearPendingUpdates } = usePendingUpdates();
  
  const { submitAnswer: submitQuestionUpdate } = useQuestionUpdates(user?.id);
  
  // Safe setState functions to prevent memory leaks
  const safeSetLoading = useCallback((value: boolean) => {
    if (isMounted.current) {
      setLoading(value);
    }
  }, []);
  
  const safeSetError = useCallback((value: Error | null) => {
    if (isMounted.current) {
      setError(value);
    }
  }, []);
  
  const safeSetDueQuestions = useCallback((value: Question[]) => {
    if (isMounted.current) {
      setDueQuestions(value);
    }
  }, []);
  
  const safeSetProgress = useCallback((value: UserProgress[]) => {
    if (isMounted.current) {
      setProgress(value);
    }
  }, []);
  
  // Load questions when component mounts or dependencies change
  useEffect(() => {
    const fetchQuestions = async () => {
      // Prevent concurrent fetches
      if (isFetching.current) return;
      
      isFetching.current = true;
      
      try {
        safeSetLoading(true);
        safeSetError(null);
        
        if (!user) {
          safeSetDueQuestions([]);
          safeSetProgress([]);
          return;
        }
        
        console.log('Fetching questions for spaced repetition system');
        const { questions, progressData } = await loadQuestions();
        
        // Validate questions before setting
        if (Array.isArray(questions)) {
          // Filter out any invalid questions
          const validQuestions = questions.filter(q => 
            q && typeof q === 'object' && q.id && q.text
          );
          
          if (validQuestions.length === 0 && questions.length > 0) {
            console.warn('All questions were filtered out as invalid', questions);
            toast.warning("Die geladenen Karten scheinen fehlerhaft zu sein. Bitte versuche es mit einer anderen Kategorie.");
          }
          
          safeSetDueQuestions(validQuestions);
        } else {
          console.error('Invalid questions data:', questions);
          safeSetDueQuestions([]);
        }
        
        // Validate progress data before setting
        if (Array.isArray(progressData)) {
          safeSetProgress(progressData);
        } else {
          console.error('Invalid progress data:', progressData);
          safeSetProgress([]);
        }
      } catch (err) {
        console.error('Error in fetchQuestions:', err);
        safeSetError(err instanceof Error ? err : new Error('Unknown error loading questions'));
      } finally {
        isFetching.current = false;
        safeSetLoading(false);
      }
    };
    
    fetchQuestions();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted.current = false;
    };
  }, [user, loadQuestions, safeSetLoading, safeSetError, safeSetDueQuestions, safeSetProgress]);
  
  // Update error state from child hooks
  useEffect(() => {
    if (questionsError) {
      safeSetError(questionsError);
    }
  }, [questionsError, safeSetError]);

  // Submit answer without immediate reload
  const submitAnswer = useCallback(async (questionId: string, score: number) => {
    if (!user || !isMounted.current) return;

    try {
      // Validate questionId
      if (!questionId) {
        console.error('Invalid question ID in submitAnswer');
        return;
      }
      
      // Add to pending updates
      addPendingUpdate(questionId, score);
      
      const currentProgress = progress.find(p => p.question_id === questionId);
      
      // Update progress in the background, don't await the result
      submitQuestionUpdate(questionId, score, currentProgress)
        .catch(err => {
          console.error('Background update error:', err);
          
          // Show error toast only for critical errors
          if (isMounted.current) {
            toast.error("Es gab ein Problem beim Speichern deines Fortschritts. Deine Antworten werden lokal zwischengespeichert.");
          }
        });
    } catch (error) {
      console.error('Error submitting answer:', error);
      if (isMounted.current) {
        safeSetError(error instanceof Error ? error : new Error('Unknown error submitting answer'));
      }
    }
  }, [user, progress, addPendingUpdate, submitQuestionUpdate, safeSetError]);

  // Function to apply all pending updates and reload questions
  const applyPendingUpdates = useCallback(async () => {
    if (!user || pendingUpdates.length === 0 || !isMounted.current) return;
    
    safeSetLoading(true);
    try {
      console.log(`Applying ${pendingUpdates.length} pending updates`);
      
      // Ensure all updates are complete
      for (const {questionId, score} of pendingUpdates) {
        const currentProgress = progress.find(p => p.question_id === questionId);
        await submitQuestionUpdate(questionId, score, currentProgress);
      }
      
      // Clear pending updates
      clearPendingUpdates();
      
      // Reload questions
      const { questions, progressData } = await loadQuestions();
      
      if (isMounted.current) {
        safeSetDueQuestions(questions);
        safeSetProgress(progressData);
      }
    } catch (error) {
      console.error('Error applying updates:', error);
      if (isMounted.current) {
        safeSetError(error instanceof Error ? error : new Error('Unknown error applying updates'));
        toast.error("Fehler beim Aktualisieren der Karten. Bitte versuche es später erneut.");
      }
    } finally {
      if (isMounted.current) {
        safeSetLoading(false);
      }
    }
  }, [user, pendingUpdates, progress, submitQuestionUpdate, clearPendingUpdates, loadQuestions, 
      safeSetLoading, safeSetDueQuestions, safeSetProgress, safeSetError]);

  // Reload questions function
  const reloadQuestions = useCallback(async () => {
    if (!user || !isMounted.current) return;
    
    safeSetLoading(true);
    try {
      const { questions, progressData } = await loadQuestions();
      
      if (isMounted.current) {
        safeSetDueQuestions(questions);
        safeSetProgress(progressData);
      }
    } catch (error) {
      console.error('Error reloading questions:', error);
      if (isMounted.current) {
        safeSetError(error instanceof Error ? error : new Error('Unknown error reloading questions'));
        toast.error("Fehler beim Neuladen der Karten. Bitte versuche es später erneut.");
      }
    } finally {
      if (isMounted.current) {
        safeSetLoading(false);
      }
    }
  }, [user, loadQuestions, safeSetLoading, safeSetDueQuestions, safeSetProgress, safeSetError]);

  return {
    loading: loading || loadingQuestions,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount: pendingUpdates.length,
    applyPendingUpdates,
    reloadQuestions
  };
}
