
import { useState, useCallback, useRef } from 'react';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress } from '../types';
import { fetchQuestions } from './fetch-strategies';
import { handleQuestionTransformation } from './question-transformation';
import { toast } from 'sonner';

interface FetchResult {
  questions: Question[];
  progressData: UserProgress[];
}

/**
 * Hook for loading questions with optimized error handling and performance
 */
export function useLoadQuestions(
  userId?: string,
  category?: QuestionCategory,
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Cancel any in-progress requests when component unmounts or dependencies change
  const cancelPreviousRequests = () => {
    if (abortControllerRef.current) {
      console.log("Cancelling previous question loading request");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const loadQuestions = useCallback(async (): Promise<FetchResult> => {
    if (!userId || !category) {
      console.log("Cannot load questions, missing userId or category");
      return { questions: [], progressData: [] };
    }
    
    // Cancel any previous requests
    cancelPreviousRequests();
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch questions using our dedicated fetch strategies module
      const result = await fetchQuestions(
        userId, 
        category, 
        subcategory, 
        options, 
        abortControllerRef.current
      );
      
      // Transform questions using our transformation utilities
      const transformedQuestions = handleQuestionTransformation(result.questions);
      
      return { 
        questions: transformedQuestions, 
        progressData: result.progressData 
      };
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        console.log("Request was aborted, ignoring error");
        return { questions: [], progressData: [] };
      }
      
      console.error('Error loading questions:', err);
      const resultError = err instanceof Error ? err : new Error('Unknown error loading questions');
      setError(resultError);
      
      // Improved error feedback to user
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      toast.error(`Fehler beim Laden der Karteikarten: ${errorMessage}. Bitte versuche es später erneut.`);
      
      // Retry logic for certain errors (3 attempts maximum)
      if (retryCount < 3) {
        console.log(`Retry attempt ${retryCount + 1} of 3`);
        setRetryCount(prev => prev + 1);
        // Implement exponential backoff (wait longer between each retry)
        const retryDelay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => loadQuestions(), retryDelay);
      }
      
      return { questions: [], progressData: [] };
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [userId, category, subcategory, options, retryCount]);

  // Clean up abort controller on unmount
  const cleanup = () => {
    cancelPreviousRequests();
  };

  return { 
    loadQuestions,
    loadingQuestions: loading,
    questionsError: error,
    retryCount,
    cleanup
  };
}
