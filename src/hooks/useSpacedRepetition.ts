
// This file is now just re-exporting from the new structure
// to maintain backward compatibility for existing imports
export { useSpacedRepetition } from './spaced-repetition';
export type { UserProgress, SpacedRepetitionOptions, SpacedRepetitionResult } from './spaced-repetition/types';

// Also re-export the helper function to transform questions to flashcards for backwards compatibility
export { transformQuestionToFlashcard } from './spaced-repetition/utils';
