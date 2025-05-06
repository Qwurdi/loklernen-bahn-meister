
import { useEffect } from 'react';
import { Question, QuestionCategory } from '@/types/questions';
import { UserProgress, SpacedRepetitionOptions } from '../types';
import { toast } from 'sonner';

/**
 * Hook to manage the lifecycle of the spaced repetition system
 */
export function useSpacedRepetitionLifecycle(
  userId: string | undefined,
  loadQuestions: () => Promise<{ questions: Question[], progressData: UserProgress[] }>,
  questionsError: Error | null,
  isMounted: React.MutableRefObject<boolean>,
  isFetching: React.MutableRefObject<boolean>,
  cleanupQuestions: () => void,
  safeSetDueQuestions: (questions: Question[]) => void,
  safeSetProgress: (progress: UserProgress[]) => void,
  safeSetLoading: (loading: boolean) => void,
  safeSetError: (error: Error | null) => void
) {
  // Load questions when component mounts or dependencies change
  useEffect(() => {
    const fetchQuestions = async () => {
      // Prevent concurrent fetches
      if (isFetching.current) {
        console.log("Fetch already in progress, skipping");
        return;
      }
      
      isFetching.current = true;
      
      try {
        safeSetLoading(true);
        safeSetError(null);
        
        if (!userId) {
          console.log("No user, clearing questions and progress");
          safeSetDueQuestions([]);
          safeSetProgress([]);
          return;
        }
        
        console.log('Fetching questions for spaced repetition system');
        const { questions, progressData } = await loadQuestions();
        
        if (!isMounted.current) {
          console.log("Component unmounted during fetch, cancelling updates");
          return;
        }
        
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
          
          console.log(`Setting ${validQuestions.length} valid questions`);
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
      console.log("Cleaning up spaced repetition lifecycle hook");
      isMounted.current = false;
      cleanupQuestions();
    };
  }, [userId, loadQuestions, safeSetLoading, safeSetError, safeSetDueQuestions, safeSetProgress, cleanupQuestions, isMounted, isFetching]);

  // Update error state from child hooks
  useEffect(() => {
    if (questionsError) {
      safeSetError(questionsError);
    }
  }, [questionsError, safeSetError]);
}
