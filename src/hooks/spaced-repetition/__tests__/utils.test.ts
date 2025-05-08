
import { describe, it, expect } from 'vitest';
import { calculateNextReviewDate, transformQuestion } from '../utils';

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

  describe('calculateNextReviewDate', () => {
    it('should calculate next review date for Box 1', () => {
      const today = new Date();
      const result = calculateNextReviewDate(today, 1);
      
      // Should return date one day in future
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const resultDate = new Date(result);
      
      // Compare only the date part (year, month, day)
      expect(resultDate.getFullYear()).toBe(tomorrow.getFullYear());
      expect(resultDate.getMonth()).toBe(tomorrow.getMonth());
      expect(resultDate.getDate()).toBe(tomorrow.getDate());
    });
    
    it('should calculate next review date for Box 3', () => {
      const today = new Date();
      const result = calculateNextReviewDate(today, 3);
      
      // Should return date 7 days in future
      const future = new Date(today);
      future.setDate(future.getDate() + 7);
      
      const resultDate = new Date(result);
      
      // Compare only the date part (year, month, day)
      expect(resultDate.getFullYear()).toBe(future.getFullYear());
      expect(resultDate.getMonth()).toBe(future.getMonth());
      expect(resultDate.getDate()).toBe(future.getDate());
    });
    
    it('should handle default case (invalid box number)', () => {
      const today = new Date();
      const result = calculateNextReviewDate(today, 10); // Non-existent box
      
      // Should default to 1 day
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const resultDate = new Date(result);
      
      // Compare only the date part
      expect(resultDate.getFullYear()).toBe(tomorrow.getFullYear());
      expect(resultDate.getMonth()).toBe(tomorrow.getMonth());
      expect(resultDate.getDate()).toBe(tomorrow.getDate());
    });
  });
});
