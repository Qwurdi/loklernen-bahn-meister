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

export function useLoadQuestions(
  userId?: string,
  category?: QuestionCategory,
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Default to 'all' if regulationCategory is not provided
  const regulationCategory = options.regulationCategory || "all";
  const boxNumber = options.boxNumber;
  const selectedCategories = options.selectedCategories || [];
  
  // Optimized batch size - ideal for didactic and technical balance
  const batchSize = options.batchSize || 15; // Default to 15 cards per session
  
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
        }
        
        return { questions: practiceQuestions || [], progressData: [] };
      }
      
      // If a specific box is requested, only fetch questions from that box
      if (boxNumber !== undefined) {
        const boxProgress = await fetchQuestionsByBox(
          userId, 
          boxNumber, 
          regulationCategory,
          selectedCategories
        );
        
        // Transform the questions from the box data
        const questionsFromBox = boxProgress
          .filter(p => p.questions) // Ensure questions exist
          .map(p => transformQuestion(p.questions));
          
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
      
      // Transform the questions from the progress data
      const questionsWithProgress = filteredProgressData
        .filter(p => p.questions) // Ensure questions exist
        .map(p => transformQuestion(p.questions));
        
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

      // Combine progress questions and new questions, and limit to batch size
      const allQuestions = [
        ...questionsWithProgress,
        ...newQuestions.map(transformQuestion)
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
      toast.error("Fehler beim Laden der Karteikarten. Bitte versuche es später erneut.");
      return { questions: [], progressData: [] };
    } finally {
      setLoading(false);
    }
  }, [userId, category, subcategory, options.practiceMode, regulationCategory, boxNumber, batchSize, selectedCategories]);

  return { 
    loadQuestions,
    loadingQuestions: loading,
    questionsError: error
  };
}
