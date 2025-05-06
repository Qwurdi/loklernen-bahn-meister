
import { Question } from '@/types/questions';
import { transformAnswers } from '@/api/questions';

/**
 * Safely transforms a database question into application format
 * with error handling for malformed data
 */
export function transformQuestion(dbQuestion: any): Question {
  if (!dbQuestion) {
    console.error('Attempted to transform undefined question');
    throw new Error('Question data is missing');
  }

  try {
    // Make sure we have required fields
    if (!dbQuestion.id) {
      console.error('Question missing required ID field');
      throw new Error('Question ID is missing');
    }

    // Ensure answers are properly formatted
    let answers;
    try {
      answers = transformAnswers(dbQuestion.answers || []);
    } catch (error) {
      console.error(`Error transforming answers for question ${dbQuestion.id}:`, error);
      // Provide fallback empty answers rather than crashing
      answers = [];
    }

    // Ensure all required fields exist with defaults for nullable ones
    return {
      id: dbQuestion.id,
      category: dbQuestion.category || 'Signale', // Default category
      sub_category: dbQuestion.sub_category || 'Allgemein', // Default subcategory
      question_type: dbQuestion.question_type || 'open', // Default to open question type
      difficulty: typeof dbQuestion.difficulty === 'number' ? dbQuestion.difficulty : 1,
      text: dbQuestion.text || 'Keine Frage vorhanden', // Default text
      image_url: dbQuestion.image_url || null,
      answers: answers,
      created_by: dbQuestion.created_by || 'system', // Default creator
      revision: dbQuestion.revision || 1, // Default revision number
      created_at: dbQuestion.created_at || new Date().toISOString(), // Default to now
      updated_at: dbQuestion.updated_at || new Date().toISOString(), // Default to now
      regulation_category: dbQuestion.regulation_category || null,
    };
  } catch (err) {
    console.error('Failed to transform question:', dbQuestion, err);
    throw new Error(`Question transformation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

/**
 * Calculate the next review date based on box number
 */
export function calculateNextReviewDate(boxNumber: number): string {
  const now = new Date();
  
  // Implement spaced repetition algorithm
  switch (boxNumber) {
    case 1:
      now.setDate(now.getDate() + 1); // 1 day
      break;
    case 2:
      now.setDate(now.getDate() + 3); // 3 days
      break;
    case 3:
      now.setDate(now.getDate() + 7); // 1 week
      break;
    case 4:
      now.setDate(now.getDate() + 14); // 2 weeks
      break;
    case 5:
      now.setDate(now.getDate() + 30); // 1 month
      break;
    case 6:
      now.setDate(now.getDate() + 60); // 2 months
      break;
    case 7:
      now.setDate(now.getDate() + 120); // 4 months
      break;
    default:
      now.setDate(now.getDate() + 1); // Default to 1 day for unknown box
  }
  
  return now.toISOString();
}

/**
 * Use memoization to cache expensive operations
 */
const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

export const memoizedTransformQuestion = memoize(transformQuestion);
