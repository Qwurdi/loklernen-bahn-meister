
// Export all functions from questions.ts
export {
  fetchUserProgress,
  fetchNewQuestions,
  fetchPracticeQuestions,
  fetchQuestionsByBox
} from './questions';

// Export all functions from user-progress.ts
export {
  updateUserProgress,
  updateUserStats
} from './user-progress';

// Export the new SR-specific functions
export {
  fetchDueCardsForSR,
  fetchCategoryCardsForSR,
  fetchSpecificCardsForSR,
  fetchAllCardsForSR
} from './questions';
