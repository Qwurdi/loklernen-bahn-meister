
import { QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress } from '../types';
import {
  fetchUserProgress,
  fetchNewQuestions,
  fetchPracticeQuestions,
  fetchQuestionsByBox
} from '../services';
import { toast } from 'sonner';

/**
 * Main function to fetch questions based on different strategies
 */
export async function fetchQuestions(
  userId: string,
  category: QuestionCategory,
  subcategory?: string,
  options: SpacedRepetitionOptions = {},
  abortController?: AbortController
): Promise<{
  questions: any[];
  progressData: UserProgress[];
}> {
  // Extract common options
  const regulationCategory = options.regulationCategory || "all";
  const boxNumber = options.boxNumber;
  const selectedCategories = options.selectedCategories || [];
  const batchSize = options.batchSize || 15;
  
  console.log(`Loading questions with category=${category}, subcategory=${subcategory}, regulation=${regulationCategory}, practice=${options.practiceMode}, selectedCategories=${selectedCategories?.join(',')}`);
  
  // Check for abort signal
  if (abortController?.signal.aborted) {
    return { questions: [], progressData: [] };
  }
  
  // Practice mode strategy
  if (options.practiceMode) {
    return await fetchPracticeQuestionStrategy(
      category, 
      subcategory, 
      regulationCategory,
      batchSize,
      selectedCategories
    );
  }
  
  // Box number strategy
  if (boxNumber !== undefined) {
    return await fetchBoxQuestionStrategy(
      userId,
      boxNumber,
      regulationCategory,
      selectedCategories
    );
  }
  
  // Regular spaced repetition strategy
  return await fetchDueQuestionStrategy(
    userId,
    category,
    subcategory,
    regulationCategory,
    batchSize,
    selectedCategories
  );
}

/**
 * Strategy for fetching practice questions
 */
async function fetchPracticeQuestionStrategy(
  category: QuestionCategory,
  subcategory?: string,
  regulationCategory: string = "all",
  batchSize: number = 15,
  selectedCategories?: string[]
) {
  try {
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
    } else {
      console.log(`Successfully loaded ${practiceQuestions.length} practice questions`);
    }
    
    return { questions: practiceQuestions || [], progressData: [] };
  } catch (error) {
    console.error("Error in practice question strategy:", error);
    throw error;
  }
}

/**
 * Strategy for fetching questions from a specific box
 */
async function fetchBoxQuestionStrategy(
  userId: string,
  boxNumber: number,
  regulationCategory: string = "all",
  selectedCategories?: string[]
) {
  try {
    console.log(`Attempting to fetch questions from box ${boxNumber}`);
    const boxProgress = await fetchQuestionsByBox(
      userId, 
      boxNumber, 
      regulationCategory,
      selectedCategories
    );
    
    const questionsFromBox = boxProgress
      .filter(p => p.questions) // Ensure questions exist
      .map(p => p.questions);
      
    console.log(`Loaded ${questionsFromBox.length} questions from box ${boxNumber}`);
    
    if (questionsFromBox.length === 0) {
      console.log(`No questions found in box ${boxNumber}`);
      toast.info(`Keine Karten in Box ${boxNumber} gefunden.`);
    }
    
    return { questions: questionsFromBox, progressData: boxProgress };
  } catch (error) {
    console.error(`Error in box question strategy for box ${boxNumber}:`, error);
    toast.error(`Fehler beim Laden von Box ${boxNumber}. Lade allgemeine fällige Karten.`);
    
    // Fallback to due questions strategy on error
    return await fetchDueQuestionStrategy(
      userId, 
      "Signale", 
      undefined, 
      regulationCategory, 
      15, 
      selectedCategories
    );
  }
}

/**
 * Strategy for fetching due questions and new questions if needed
 */
async function fetchDueQuestionStrategy(
  userId: string,
  category: QuestionCategory,
  subcategory?: string,
  regulationCategory: string = "all",
  batchSize: number = 15,
  selectedCategories?: string[]
) {
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
      throw new Error('Failed to fetch user progress data');
    }
    
    console.log(`Received ${filteredProgressData.length} progress items`);
    
    // Transform the questions from the progress data
    const questionsWithProgress = filteredProgressData
      .filter(p => p.questions) // Ensure questions exist
      .map(p => p.questions);
      
    console.log("Questions with progress:", questionsWithProgress.length);

    // If we have enough questions with progress, no need to fetch new ones
    if (questionsWithProgress.length >= batchSize) {
      return { 
        questions: questionsWithProgress.slice(0, batchSize), 
        progressData: filteredProgressData 
      };
    }

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

      // Combine progress questions and new questions, and limit to batch size
      const allQuestions = [
        ...questionsWithProgress,
        ...newQuestions
      ].slice(0, batchSize);
      
      console.log("Final questions count:", allQuestions.length);
      
      if (allQuestions.length === 0) {
        console.log('No questions found');
        toast.info("Keine Karteikarten für diese Kategorie gefunden.");
      }
      
      return { questions: allQuestions, progressData: filteredProgressData };
    } catch (error) {
      console.error("Error fetching new questions:", error);
      
      // If fetching new questions fails but we have some with progress, return those
      if (questionsWithProgress.length > 0) {
        console.log("Returning only questions with progress due to error fetching new questions");
        return { 
          questions: questionsWithProgress, 
          progressData: filteredProgressData 
        };
      }
      throw error;
    }
  } catch (progressError) {
    console.error("Error in due question strategy:", progressError);
    
    // Try fetching just new questions as fallback if progress fetch fails
    console.log("Trying fallback: fetching only new questions without progress data");
    try {
      const newQuestions = await fetchNewQuestions(
        category, 
        subcategory, 
        regulationCategory, 
        [], // No progress data, so no IDs to exclude
        batchSize,
        selectedCategories
      );
      
      console.log(`Fallback: loaded ${newQuestions.length} new questions`);
      
      return { questions: newQuestions, progressData: [] };
    } catch (fallbackError) {
      console.error("Fallback strategy also failed:", fallbackError);
      throw progressError; // Throw the original error
    }
  }
}
