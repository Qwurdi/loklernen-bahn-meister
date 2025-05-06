
// Export all question service functions
export {
  fetchUserProgress,
  fetchNewQuestions,
  fetchPracticeQuestions,
  fetchQuestionsByBox
} from './questions';

// Export user progress related functions
export {
  updateUserProgress,
  updateUserStats
} from './user-progress';

// Export utility functions for score calculations
export {
  calculateNewBoxNumber,
  calculateXpGain
} from './score-calculation';

// Export streak management functions
export {
  updateStreak,
  calculateStreakUpdate
} from './streak-management';

// Export offline background sync functions
export {
  syncOfflineData,
  registerBackgroundSync,
  requestSync
} from './background-sync';
