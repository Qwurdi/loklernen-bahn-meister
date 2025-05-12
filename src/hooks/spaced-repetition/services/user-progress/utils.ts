
/**
 * Helper function to calculate new box number based on score
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
 * Helper function to calculate next review date based on box number
 */
export function calculateNextReviewDate(boxNumber: number): string {
  const now = new Date();
  
  switch (boxNumber) {
    case 1:
      // Box 1: Review after 1 day
      now.setDate(now.getDate() + 1);
      break;
    case 2:
      // Box 2: Review after 3 days
      now.setDate(now.getDate() + 3);
      break;
    case 3:
      // Box 3: Review after 7 days
      now.setDate(now.getDate() + 7);
      break;
    case 4:
      // Box 4: Review after 14 days
      now.setDate(now.getDate() + 14);
      break;
    case 5:
      // Box 5: Review after 30 days
      now.setDate(now.getDate() + 30);
      break;
    default:
      // Fallback to 1 day
      now.setDate(now.getDate() + 1);
  }
  
  return now.toISOString();
}

/**
 * Helper function to calculate XP gain based on score
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
