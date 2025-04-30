
import { Question } from '@/types/questions';
import { UserProgress } from './types';
import { transformAnswers } from '@/api/questions';

// Helper function to transform database questions to application questions
export function transformQuestion(dbQuestion: any): Question {
  return {
    ...dbQuestion,
    answers: transformAnswers(dbQuestion.answers)
  };
}

// Calculate the next review date based on user's performance
export function calculateNextReview(score: number, currentProgress?: UserProgress) {
  const baseEaseFactor = currentProgress?.ease_factor || 2.5;
  const baseInterval = currentProgress?.interval_days || 1;

  // Adjust ease factor based on performance (0-5 scale)
  const newEaseFactor = baseEaseFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));

  // Calculate new interval
  let newInterval = baseInterval;
  if (score >= 4) { // Good response
    if (currentProgress?.repetition_count === 0) {
      newInterval = 1;
    } else if (currentProgress?.repetition_count === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(baseInterval * newEaseFactor);
    }
  } else if (score >= 2) { // Hard response
    newInterval = Math.max(1, Math.round(baseInterval * 1.2));
  } else { // Wrong response
    newInterval = 1;
  }

  return {
    interval_days: newInterval,
    ease_factor: Math.max(1.3, newEaseFactor),
    next_review_at: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString()
  };
}
