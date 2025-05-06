import { useState, useCallback, useRef } from 'react';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress } from '../types';
import { transformQuestion } from '../utils';
import {
  fetchUserProgress,
  fetchNewQuestions,
  fetchPracticeQuestions,
  fetchQuestionsByBox
} from '../services';
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
  
  // Default to 'all' if regulationCategory is not provided
  const regulationCategory = options.regulationCategory || "all";
  const boxNumber = options.boxNumber;
  const selectedCategories = options.selectedCategories || [];
  
  // Optimized batch size - ideal for didactic and technical balance
  const batchSize = options.batchSize || 15; // Default to 15 cards per session
  
  // Function to safely transform data with error handling
  const safeTransformQuestion = (question: any): Question | null => {
    if (!question) return null;
    
    try {
      return transformQuestion(question);
    } catch (err) {
      console.error(`Error transforming question (ID: ${question?.id || 'unknown'})`, err);
      // Return null for failed transformations
      return null;
    }
  };
  
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
    console.log(`Loading questions with category=${category}, subcategory=${subcategory}, regulation=${regulationCategory}, practice=${options.practiceMode}, selectedCategories=${selectedCategories?.join(',')}`);
    
    try {
      // Handle practice mode differently - just load questions without checking if they're due
      if (options.practiceMode) {
        const practiceQuestions = await fetchPracticeQuestions(
          category, 
          subcategory, 
          regulationCategory, 
          batchSize,
          selectedCategories
        );
        
        if (!practiceQuestions || practiceQuestions.length === 0) {
          console.log('No practice questions found');
          toast.error("Keine Übungsfragen gefunden. Bitte wähle eine andere Kategorie.");
          return { questions: [], progressData: [] };
        }
        
        // Safely transform each question and filter out null results
        const transformedQuestions = practiceQuestions
          .map(safeTransformQuestion)
          .filter(Boolean) as Question[];
          
        console.log(`Successfully loaded ${transformedQuestions.length} practice questions`);
        
        return { questions: transformedQuestions || [], progressData: [] };
      }
      
      // If a specific box is requested, only fetch questions from that box
      if (boxNumber !== undefined) {
        try {
          console.log(`Attempting to fetch questions from box ${boxNumber}`);
          const boxProgress = await fetchQuestionsByBox(
            userId, 
            boxNumber, 
            regulationCategory,
            selectedCategories
          );
          
          // Transform the questions from the box data with safety checks
          const questionsFromBox = boxProgress
            .filter(p => p.questions) // Ensure questions exist
            .map(p => safeTransformQuestion(p.questions))
            .filter(Boolean) as Question[]; // Filter out null results
            
          console.log(`Loaded ${questionsFromBox.length} questions from box ${boxNumber}`);
          
          if (questionsFromBox.length === 0) {
            console.log(`No questions found in box ${boxNumber}`);
            toast.info(`Keine Karten in Box ${boxNumber} gefunden.`);
          }
          
          return { questions: questionsFromBox, progressData: boxProgress };
        } catch (boxError) {
          console.error(`Error fetching box ${boxNumber}:`, boxError);
          // Fall back to regular due questions if box fetch fails
          toast.error(`Fehler beim Laden von Box ${boxNumber}. Lade allgemeine fällige Karten.`);
          // Continue with regular loading below
        }
      }
      
      // Regular spaced repetition mode - now with support for selected categories
      try {
        console.log("Fetching user progress data for spaced repetition");
        const filteredProgressData = await fetchUserProgress(
          userId, 
          category, 
          subcategory, 
          regulationCategory,
          selectedCategories
        );
        
        if (!filteredProgressData) {
          console.error('Failed to fetch user progress data - received null/undefined');
          throw new Error('Failed to fetch user progress data');
        }
        
        console.log(`Received ${filteredProgressData.length} progress items`);
        
        // Transform the questions from the progress data with safety checks
        const questionsWithProgress = filteredProgressData
          .filter(p => p.questions) // Ensure questions exist
          .map(p => safeTransformQuestion(p.questions))
          .filter(Boolean) as Question[]; // Filter out null results
          
        console.log("Questions with progress:", questionsWithProgress.length);

        // If we have enough questions with progress, no need to fetch new ones
        if (questionsWithProgress.length >= batchSize) {
          return { 
            questions: questionsWithProgress.slice(0, batchSize), 
            progressData: filteredProgressData 
          };
        }

        // Otherwise, fetch new questions (those without progress)
        // Get the IDs of questions that already have progress
        const questionIdsWithProgress = filteredProgressData
          .filter(p => p.questions?.id)
          .map(p => p.question_id);
          
        console.log("Question IDs with progress:", questionIdsWithProgress.length);

        // Try to fetch new questions if we don't have enough questions with progress
        try {
          console.log("Fetching new questions to supplement progress data");
          const newQuestions = await fetchNewQuestions(
            category, 
            subcategory, 
            regulationCategory, 
            questionIdsWithProgress, 
            batchSize,
            selectedCategories
          );

          // Safely transform and filter the new questions
          const transformedNewQuestions = newQuestions
            .map(safeTransformQuestion)
            .filter(Boolean) as Question[];

          // Combine progress questions and new questions, and limit to batch size
          const allQuestions = [
            ...questionsWithProgress,
            ...transformedNewQuestions
          ].slice(0, batchSize);
          
          console.log("Final questions count:", allQuestions.length);
          
          if (allQuestions.length === 0) {
            console.log('No questions found');
            toast.info("Keine Karteikarten für diese Kategorie gefunden.");
          }
          
          return { questions: allQuestions, progressData: filteredProgressData };
        } catch (newQuestionsError) {
          console.error("Error fetching new questions:", newQuestionsError);
          // If fetching new questions fails but we have some with progress, return those
          if (questionsWithProgress.length > 0) {
            console.log("Returning only questions with progress due to error fetching new questions");
            return { 
              questions: questionsWithProgress, 
              progressData: filteredProgressData 
            };
          }
          throw newQuestionsError;
        }
      } catch (progressError) {
        console.error("Error fetching user progress:", progressError);
        
        // Try fetching just new questions as fallback if progress fetch fails
        console.log("Trying fallback: fetching only new questions without progress data");
        const newQuestions = await fetchNewQuestions(
          category, 
          subcategory, 
          regulationCategory, 
          [], // No progress data, so no IDs to exclude
          batchSize,
          selectedCategories
        );
        
        const transformedNewQuestions = newQuestions
          .map(safeTransformQuestion)
          .filter(Boolean) as Question[];
          
        console.log(`Fallback: loaded ${transformedNewQuestions.length} new questions`);
        
        return { questions: transformedNewQuestions, progressData: [] };
      }
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
  }, [userId, category, subcategory, options.practiceMode, regulationCategory, boxNumber, batchSize, selectedCategories, retryCount]);

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
