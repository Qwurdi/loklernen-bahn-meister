import { Question } from '@/types/questions';
import { Flashcard } from './types';

// Utility function to transform a Question object to a Flashcard object
export function transformQuestionToFlashcard(question: Question): Flashcard {
  // If Question and Flashcard have the same structure, we can simply return the question
  // If Flashcard needs additional properties or transformations, add them here
  return {
    ...question,
    // Add any additional Flashcard-specific fields here if needed
  };
}

// Other utility functions related to spaced repetition can be added here
