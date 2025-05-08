import { Question } from '@/types/questions';
import { Flashcard } from './types';

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
  return {
    ...question,
    answers: typeof question.answers === 'string' ? JSON.parse(question.answers) : question.answers,
    // Add any other transformations needed
  };
}

// Other utility functions can be added here
