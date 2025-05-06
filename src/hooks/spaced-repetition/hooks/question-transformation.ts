
import { Question } from '@/types/questions';
import { transformQuestion } from '../utils';

/**
 * Safely transform questions with error handling and filtering
 */
export function handleQuestionTransformation(questions: any[]): Question[] {
  if (!Array.isArray(questions)) {
    console.error('Expected questions array, got:', typeof questions);
    return [];
  }

  // Safely transform each question and filter out null results
  return questions
    .map(safeTransformQuestion)
    .filter(Boolean) as Question[];
}

/**
 * Function to safely transform data with error handling
 */
export function safeTransformQuestion(question: any): Question | null {
  if (!question) return null;
  
  try {
    return transformQuestion(question);
  } catch (err) {
    console.error(`Error transforming question (ID: ${question?.id || 'unknown'})`, err);
    // Return null for failed transformations
    return null;
  }
}
