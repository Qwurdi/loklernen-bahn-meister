
import { calculateNextReviewDate } from "../utils";

/**
 * Calculate new box number based on score
 */
export function calculateNewBoxNumber(currentBox: number, score: number): number {
  if (score <= 2) {
    // Failed recall, move back to box 1
    return 1;
  } else if (score === 3) {
    // Difficult recall, stay in current box or move forward cautiously
    return Math.min(currentBox + 1, 5);  // Maximum box is 5
  } else {
    // Good recall, move forward
    return Math.min(currentBox + 1, 5);  // Maximum box is 5
  }
}

/**
 * Calculate XP gain based on score
 */
export function calculateXpGain(score: number): number {
  // Base XP is 10
  const baseXP = 10;
  
  // Apply multiplier based on score
  switch (score) {
    case 0:
    case 1:
      return 5;  // Very little XP for very poor recalls
    case 2:
      return 8;  // Modest XP for poor recalls
    case 3:
      return baseXP;  // Standard XP for okay recalls
    case 4:
      return baseXP * 1.2;  // 20% bonus for good recalls
    case 5:
      return baseXP * 1.5;  // 50% bonus for perfect recalls
    default:
      return baseXP;
  }
}
