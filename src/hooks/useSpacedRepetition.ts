
// This file is now just re-exporting from the new structure
// to maintain backward compatibility for existing imports
export { useSpacedRepetition } from './spaced-repetition';
export { useOptimizedSpacedRepetition } from './spaced-repetition/useOptimizedSpacedRepetition';
export type { UserProgress, SpacedRepetitionOptions, SpacedRepetitionResult } from './spaced-repetition/types';
