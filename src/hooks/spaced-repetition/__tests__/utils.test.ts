
import { describe, it, expect } from 'vitest';
import { calculateNextReview, transformQuestion } from '../utils';

describe('spaced repetition utils', () => {
  describe('transformQuestion', () => {
    it('should correctly transform a question', () => {
      const mockDbQuestion = {
        id: 'test-id',
        text: 'Test question?',
        answers: JSON.stringify([{ text: 'Answer 1', isCorrect: true }])
      };
      
      const transformedQuestion = transformQuestion(mockDbQuestion);
      
      expect(transformedQuestion).toHaveProperty('id', 'test-id');
      expect(transformedQuestion).toHaveProperty('text', 'Test question?');
      expect(transformedQuestion).toHaveProperty('answers');
    });
  });

  describe('calculateNextReview', () => {
    it('should calculate next review for a new question with high score', () => {
      const score = 5; // Excellent response
      
      const result = calculateNextReview(score);
      
      expect(result).toHaveProperty('interval_days', 1);
      expect(result).toHaveProperty('ease_factor');
      expect(result.ease_factor).toBeGreaterThanOrEqual(2.5);
      expect(result).toHaveProperty('next_review_at');
    });
    
    it('should calculate next review for a new question with low score', () => {
      const score = 1; // Poor response
      
      const result = calculateNextReview(score);
      
      expect(result).toHaveProperty('interval_days', 1); // Should reset to 1 day
      expect(result).toHaveProperty('ease_factor');
      expect(result.ease_factor).toBeLessThan(2.5); // Should decrease the ease factor
      expect(result).toHaveProperty('next_review_at');
    });
    
    it('should calculate next review for an existing question with high score', () => {
      const score = 5; // Excellent response
      const currentProgress = {
        id: 'progress-id',
        question_id: 'test-question-id',
        repetition_count: 2,
        correct_count: 1,
        incorrect_count: 0,
        last_score: 4,
        ease_factor: 2.3,
        interval_days: 6,
        last_reviewed_at: '2025-05-01T00:00:00.000Z',
        next_review_at: '2025-05-07T00:00:00.000Z',
      };
      
      const result = calculateNextReview(score, currentProgress);
      
      expect(result).toHaveProperty('interval_days');
      expect(result.interval_days).toBeGreaterThan(currentProgress.interval_days); // Should increase the interval
      expect(result).toHaveProperty('ease_factor');
      expect(result.ease_factor).toBeGreaterThanOrEqual(currentProgress.ease_factor); // Should increase or maintain ease factor
      expect(result).toHaveProperty('next_review_at');
    });
    
    it('should handle first repetition correctly', () => {
      const score = 5; // Excellent response
      const currentProgress = {
        id: 'progress-id',
        question_id: 'test-question-id',
        repetition_count: 0, // First repetition
        correct_count: 0,
        incorrect_count: 0,
        last_score: 0,
        ease_factor: 2.5,
        interval_days: 1,
        last_reviewed_at: '2025-05-01T00:00:00.000Z',
        next_review_at: '2025-05-02T00:00:00.000Z',
      };
      
      const result = calculateNextReview(score, currentProgress);
      
      expect(result).toHaveProperty('interval_days', 1); // Should be 1 day for first rep
      expect(result).toHaveProperty('ease_factor');
      expect(result).toHaveProperty('next_review_at');
    });
    
    it('should handle second repetition correctly', () => {
      const score = 5; // Excellent response
      const currentProgress = {
        id: 'progress-id',
        question_id: 'test-question-id',
        repetition_count: 1, // Second repetition
        correct_count: 1,
        incorrect_count: 0,
        last_score: 5,
        ease_factor: 2.5,
        interval_days: 1,
        last_reviewed_at: '2025-05-01T00:00:00.000Z',
        next_review_at: '2025-05-02T00:00:00.000Z',
      };
      
      const result = calculateNextReview(score, currentProgress);
      
      expect(result).toHaveProperty('interval_days', 6); // Should be 6 days for second rep
      expect(result).toHaveProperty('ease_factor');
      expect(result).toHaveProperty('next_review_at');
    });
  });
});
