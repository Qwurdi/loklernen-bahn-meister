/**
 * Update streak based on score and current streak
 */
export function updateStreak(score: number, currentStreak: number = 0): number {
  if (score >= 4) {
    // For correct answers (scores >= 4), increase streak
    return currentStreak + 1;
  } else {
    // For incorrect answers, reset streak
    return 0;
  }
}

/**
 * Check if streak should be updated based on last activity date
 */
export function calculateStreakUpdate(lastActivityDate: string, currentStreak: number): number {
  const today = new Date();
  const lastActivity = new Date(lastActivityDate);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Format dates as YYYY-MM-DD for comparison
  const todayFormatted = today.toISOString().split('T')[0];
  const yesterdayFormatted = yesterday.toISOString().split('T')[0];
  const lastActivityFormatted = lastActivity.toISOString().split('T')[0];
  
  if (lastActivityFormatted === yesterdayFormatted) {
    // Last activity was yesterday, increment streak
    return currentStreak + 1;
  } else if (lastActivityFormatted === todayFormatted) {
    // Last activity was today, keep current streak
    return currentStreak;
  } else {
    // Not consecutive days, reset to 1
    return 1;
  }
}
