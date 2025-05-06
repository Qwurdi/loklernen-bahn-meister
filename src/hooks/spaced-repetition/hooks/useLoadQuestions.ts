
import { useState, useCallback } from 'react';
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
  
  const loadQuestions = useCallback(async (): Promise<FetchResult> => {
    if (!userId || !category) {
      return { questions: [], progressData: [] };
    }
    
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
      }
      
      // Regular spaced repetition mode - now with support for selected categories
      const filteredProgressData = await fetchUserProgress(
        userId, 
        category, 
        subcategory, 
        regulationCategory,
        selectedCategories
      );
      
      if (!filteredProgressData) {
        throw new Error('Failed to fetch user progress data');
      }
      
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
    } catch (err) {
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
    }
  }, [userId, category, subcategory, options.practiceMode, regulationCategory, boxNumber, batchSize, selectedCategories, retryCount]);

  return { 
    loadQuestions,
    loadingQuestions: loading,
    questionsError: error,
    retryCount
  };
}
