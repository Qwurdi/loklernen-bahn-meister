
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

// Calculate the next review date based on the box number
export function calculateNextReviewDate(boxNumber: number): string {
  const now = new Date();
  
  switch (boxNumber) {
    case 1:
      return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(); // 1 day
    case 2:
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days
    case 3:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    case 4:
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 days
    case 5:
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    default:
      return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(); // Default to 1 day
  }
}

// Process answers based on the new box system
export function processAnswer(
  isCorrect: boolean, 
  currentProgress?: UserProgress
): {
  box_number: number;
  streak: number;
  next_review_at: string;
} {
  const boxNumber = currentProgress?.box_number || 1;
  const currentStreak = currentProgress?.streak || 0;

  // If answer is correct, increment streak
  if (isCorrect) {
    let newStreak = currentStreak + 1;
    let newBoxNumber = boxNumber;

    // Check if we should move the card to the next box
    const requiredStreakForBox = [0, 2, 3, 4, 5]; // Index 0 is unused, starts from Box 1
    if (newStreak >= requiredStreakForBox[boxNumber] && boxNumber < 5) {
      newBoxNumber = boxNumber + 1;
      newStreak = 0; // Reset streak when advancing to the next box
    }

    return {
      box_number: newBoxNumber,
      streak: newStreak,
      next_review_at: calculateNextReviewDate(newBoxNumber),
    };
  } 
  // If answer is incorrect, reset streak and potentially move down a box
  else {
    let newBoxNumber = boxNumber;
    
    // Rules for moving down
    if (boxNumber > 1 && boxNumber <= 4) {
      newBoxNumber = boxNumber - 1;
    } else if (boxNumber === 5) {
      newBoxNumber = 3; // From Box 5 to Box 3 on failure
    }
    
    return {
      box_number: newBoxNumber,
      streak: 0, // Reset streak on wrong answer
      next_review_at: calculateNextReviewDate(newBoxNumber),
    };
  }
}
