
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

// In-memory cache for questions to improve performance
const questionsCache = new Map<string, {
  timestamp: number,
  result: FetchResult
}>();

const CACHE_TIMEOUT = 2 * 60 * 1000; // 2 minutes cache timeout

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
  
  // Track if the component is still mounted
  const componentMounted = useRef(true);
  
  // Cancel any in-progress requests when component unmounts or dependencies change
  const cancelPreviousRequests = () => {
    if (abortControllerRef.current) {
      console.log("Cancelling previous question loading request");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const loadQuestions = useCallback(async (forceRefresh = false): Promise<FetchResult> => {
    if (!userId || !category) {
      console.log("Cannot load questions, missing userId or category");
      return { questions: [], progressData: [] };
    }
    
    // Generate cache key based on request parameters
    const cacheKey = `${userId}-${category}-${subcategory}-${options.regulationCategory}-${options.boxNumber}-${options.practiceMode}-${options.selectedCategories?.join(',')}`;
    
    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
      const cached = questionsCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_TIMEOUT) {
        console.log("Using cached questions data");
        return cached.result;
      }
    }
    
    // Cancel any previous requests
    cancelPreviousRequests();
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    if (componentMounted.current) {
      setLoading(true);
      setError(null);
    }
    
    try {
      console.log("Fetching questions from API");
      
      // Add timeout for the fetch operation
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          console.log("Request timeout reached, aborting");
          abortControllerRef.current.abort();
        }
      }, 7000); // 7 second timeout
      
      // Fetch questions using our dedicated fetch strategies module
      const result = await fetchQuestions(
        userId, 
        category, 
        subcategory, 
        options, 
        abortControllerRef.current
      );
      
      // Clear timeout as request completed successfully
      clearTimeout(timeoutId);
      
      // Transform questions using our transformation utilities
      const transformedQuestions = handleQuestionTransformation(result.questions);
      
      const finalResult = { 
        questions: transformedQuestions, 
        progressData: result.progressData 
      };
      
      // Cache successful results
      if (transformedQuestions.length > 0) {
        questionsCache.set(cacheKey, {
          timestamp: Date.now(),
          result: finalResult
        });
      }
      
      return finalResult;
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        console.log("Request was aborted, ignoring error");
        
        // Check cache for fallback data
        const cached = questionsCache.get(cacheKey);
        if (cached) {
          console.log("Using cached data after abort");
          return cached.result;
        }
        
        return { questions: [], progressData: [] };
      }
      
      console.error('Error loading questions:', err);
      const resultError = err instanceof Error ? err : new Error('Unknown error loading questions');
      
      if (componentMounted.current) {
        setError(resultError);
      }
      
      // Improved error feedback to user
      if (componentMounted.current && retryCount < 1) {
        const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
        toast.error(`Fehler beim Laden der Karteikarten: ${errorMessage}`, {
          id: 'question-loading-error' // Prevent duplicate toasts
        });
      }
      
      // Retry logic for certain errors (2 attempts maximum)
      if (retryCount < 2 && componentMounted.current) {
        console.log(`Retry attempt ${retryCount + 1} of 2`);
        setRetryCount(prev => prev + 1);
        // Implement exponential backoff (wait longer between each retry)
        const retryDelay = Math.pow(2, retryCount) * 1000;
        
        // Use timeout for retry
        const retryTimeout = setTimeout(() => {
          if (componentMounted.current) {
            loadQuestions(true); // Force refresh on retry
          }
        }, retryDelay);
        
        // Clear timeout if component unmounts
        return { questions: [], progressData: [] };
      }
      
      // Check if we have cached data to use as fallback
      const cached = questionsCache.get(cacheKey);
      if (cached) {
        console.log("Using cached data after error");
        return cached.result;
      }
      
      return { questions: [], progressData: [] };
    } finally {
      if (componentMounted.current) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, [userId, category, subcategory, options, retryCount]);

  // Clean up resources on unmount
  const cleanup = useCallback(() => {
    componentMounted.current = false;
    cancelPreviousRequests();
  }, []);

  return { 
    loadQuestions,
    loadingQuestions: loading,
    questionsError: error,
    retryCount,
    cleanup
  };
}
