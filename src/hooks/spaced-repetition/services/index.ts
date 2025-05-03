
// Export all functions from questions.ts
export {
  fetchUserProgress,
  fetchNewQuestions,
  fetchPracticeQuestions,
  fetchQuestionsByBox
} from './questions';

// Export all functions from user-progress.ts except fetchQuestionsByBox
export {
  updateUserProgress,
  updateUserStats
} from './user-progress';
