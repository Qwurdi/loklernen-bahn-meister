
import { describe, it, expect } from 'vitest';
import { calculateNewBoxNumber, calculateXpGain } from '../score-calculation';

describe('score-calculation service', () => {
  describe('calculateNewBoxNumber', () => {
    it('should move back to box 1 for low scores', () => {
      expect(calculateNewBoxNumber(3, 0)).toBe(1);
      expect(calculateNewBoxNumber(3, 1)).toBe(1);
      expect(calculateNewBoxNumber(3, 2)).toBe(1);
    });

    it('should increment box for average scores (score = 3)', () => {
      expect(calculateNewBoxNumber(1, 3)).toBe(2);
      expect(calculateNewBoxNumber(2, 3)).toBe(3);
      expect(calculateNewBoxNumber(4, 3)).toBe(5); // Max box is 5
    });

    it('should increment box for good scores (score > 3)', () => {
      expect(calculateNewBoxNumber(1, 4)).toBe(2);
      expect(calculateNewBoxNumber(2, 4)).toBe(3);
      expect(calculateNewBoxNumber(3, 5)).toBe(4);
      expect(calculateNewBoxNumber(4, 5)).toBe(5);
    });

    it('should not exceed maximum box (5)', () => {
      expect(calculateNewBoxNumber(5, 3)).toBe(5);
      expect(calculateNewBoxNumber(5, 4)).toBe(5);
      expect(calculateNewBoxNumber(5, 5)).toBe(5);
    });
  });

  describe('calculateXpGain', () => {
    it('should return minimal XP for very poor recalls', () => {
      expect(calculateXpGain(0)).toBe(5);
      expect(calculateXpGain(1)).toBe(5);
    });

    it('should return modest XP for poor recalls', () => {
      expect(calculateXpGain(2)).toBe(8);
    });

    it('should return standard XP for okay recalls', () => {
      expect(calculateXpGain(3)).toBe(10); // Base XP
    });

    it('should return bonus XP for good recalls', () => {
      expect(calculateXpGain(4)).toBe(12); // Base XP * 1.2
    });

    it('should return higher bonus XP for perfect recalls', () => {
      expect(calculateXpGain(5)).toBe(15); // Base XP * 1.5
    });

    it('should return standard XP for unexpected score values', () => {
      expect(calculateXpGain(6)).toBe(10); // Default to base XP
    });
  });
});
