
import { describe, it, expect } from 'vitest';
import * as ProgressServices from '../index';

describe('Spaced Repetition Services Index', () => {
  it('should export all required service functions', () => {
    // Question-related functions
    expect(ProgressServices.fetchUserProgress).toBeDefined();
    expect(ProgressServices.fetchNewQuestions).toBeDefined();
    expect(ProgressServices.fetchPracticeQuestions).toBeDefined();
    expect(ProgressServices.fetchQuestionsByBox).toBeDefined();
    
    // User progress and stats related functions
    expect(ProgressServices.updateUserProgress).toBeDefined();
    expect(ProgressServices.updateUserStats).toBeDefined();
    
    // Score calculation functions
    expect(ProgressServices.calculateNewBoxNumber).toBeDefined();
    expect(ProgressServices.calculateXpGain).toBeDefined();
    
    // Streak management functions
    expect(ProgressServices.updateStreak).toBeDefined();
    expect(ProgressServices.calculateStreakUpdate).toBeDefined();
  });
});
