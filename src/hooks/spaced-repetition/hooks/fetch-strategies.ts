import { QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress } from '../types';
import {
  fetchUserProgress,
  fetchNewQuestions,
  fetchPracticeQuestions,
  fetchQuestionsByBox
} from '../services';
import { toast } from 'sonner';

// Cache mechanism for questions to reduce database load
const questionCache = new Map();
const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

/**
 * Main function to fetch questions with optimized caching and error handling
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
  
  // Check cache first
  const cacheKey = `${userId}-${category}-${subcategory}-${regulationCategory}-${boxNumber}-${selectedCategories.join('-')}`;
  const cachedData = questionCache.get(cacheKey);
  
  if (cachedData && !options.bypassCache) {
    const { timestamp, data } = cachedData;
    if (Date.now() - timestamp < CACHE_TIMEOUT) {
      console.log('Using cached question data');
      return data;
    } else {
      // Cache expired
      questionCache.delete(cacheKey);
    }
  }
  
  // Check for abort signal
  if (abortController?.signal.aborted) {
    console.log('Request aborted, returning empty result');
    return { questions: [], progressData: [] };
  }
  
  try {
    let result;
    
    // Practice mode strategy
    if (options.practiceMode) {
      result = await fetchPracticeQuestionStrategy(
        category, 
        subcategory, 
        regulationCategory,
        batchSize,
        selectedCategories
      );
    }
    // Box number strategy
    else if (boxNumber !== undefined) {
      result = await fetchBoxQuestionStrategy(
        userId,
        boxNumber,
        regulationCategory,
        selectedCategories
      );
    }
    // Regular spaced repetition strategy
    else {
      result = await fetchDueQuestionStrategy(
        userId,
        category,
        subcategory,
        regulationCategory,
        batchSize,
        selectedCategories
      );
    }
    
    // Cache successful results
    if (result.questions.length > 0) {
      questionCache.set(cacheKey, {
        timestamp: Date.now(),
        data: result
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching questions:", error);
    
    // Return cached data as fallback if available
    if (cachedData) {
      console.log('Using cached data as fallback after error');
      return cachedData.data;
    }
    
    // Fallback to practice mode if other strategies fail
    if (!options.practiceMode) {
      console.log('Falling back to practice mode after error');
      try {
        return await fetchPracticeQuestionStrategy(
          category, 
          subcategory, 
          regulationCategory, 
          batchSize,
          selectedCategories
        );
      } catch (fallbackError) {
        console.error("Even practice mode fallback failed:", fallbackError);
      }
    }
    
    throw error;
  }
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
 * Strategy for fetching due questions with optimized query flow
 */
async function fetchDueQuestionStrategy(
  userId: string,
  category: QuestionCategory,
  subcategory?: string,
  regulationCategory: string = "all",
  batchSize: number = 15,
  selectedCategories?: string[]
) {
  console.log("Fetching due questions with optimized flow");
  
  try {
    // Set timeout for progress data fetch
    const progressPromise = fetchUserProgress(
      userId, 
      category, 
      subcategory, 
      regulationCategory,
      selectedCategories
    );
    
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout fetching user progress')), 5000);
    });
    
    // Race the fetch against the timeout
    const filteredProgressData = await Promise.race([progressPromise, timeoutPromise]) as UserProgress[];
    
    console.log(`Received ${filteredProgressData.length} progress items`);
    
    // Extract questions directly - simpler approach
    const questionsWithProgress = filteredProgressData
      .filter(p => p.questions) // Ensure questions exist
      .map(p => p.questions)
      .filter(Boolean); // Remove null/undefined
      
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
      
    // Try to fetch new questions with timeout
    const newQuestionsPromise = fetchNewQuestions(
      category, 
      subcategory, 
      regulationCategory, 
      questionIdsWithProgress, 
      batchSize,
      selectedCategories
    );
    
    // Create timeout promise for new questions
    const newQuestionsTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout fetching new questions')), 4000);
    });
    
    // Race the fetch against the timeout
    const newQuestions = await Promise.race([newQuestionsPromise, newQuestionsTimeoutPromise]) as any[];
    
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
  } catch (progressError) {
    console.error("Error in due question strategy:", progressError);
    
    // Simplified fallback that doesn't reuse parameters
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
