import { Question } from '@/types/questions';
import { Flashcard } from './types';
import { Json } from '@/integrations/supabase/types';

/**
 * Transforms a Question object to a Flashcard object
 */
export function transformQuestionToFlashcard(question: Question): Flashcard {
  return {
    ...question,
    // Add any additional Flashcard-specific fields here if needed
  };
}

/**
 * Transforms a question from the database format
 */
export function transformQuestion(question: any): Question {
  // Handle the case when answers is a string (JSON)
  let parsedAnswers = question.answers;
  
  if (typeof question.answers === 'string') {
    try {
      parsedAnswers = JSON.parse(question.answers);
    } catch (e) {
      console.error('Failed to parse answers JSON', e);
      parsedAnswers = []; // Fallback to empty array if parsing fails
    }
  }

  return {
    ...question,
    answers: parsedAnswers,
  };
}

// Other utility functions can be added here
