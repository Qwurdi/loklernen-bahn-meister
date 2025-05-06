
import { describe, it, expect } from 'vitest';
import { updateStreak, calculateStreakUpdate } from '../streak-management';

describe('streak-management service', () => {
  describe('updateStreak', () => {
    it('should increase streak for good scores (>= 4)', () => {
      expect(updateStreak(4, 0)).toBe(1);
      expect(updateStreak(4, 5)).toBe(6);
      expect(updateStreak(5, 10)).toBe(11);
    });

    it('should reset streak for poor scores (< 4)', () => {
      expect(updateStreak(0, 5)).toBe(0);
      expect(updateStreak(1, 5)).toBe(0);
      expect(updateStreak(2, 5)).toBe(0);
      expect(updateStreak(3, 5)).toBe(0);
    });

    it('should handle undefined current streak', () => {
      expect(updateStreak(5)).toBe(1); // Default currentStreak to 0
      expect(updateStreak(3)).toBe(0); // Default currentStreak to 0
    });
  });

  describe('calculateStreakUpdate', () => {
    it('should increment streak when last activity was yesterday', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const yesterdayFormatted = yesterday.toISOString().split('T')[0];
      const currentStreak = 5;
      
      expect(calculateStreakUpdate(yesterdayFormatted, currentStreak)).toBe(6);
    });

    it('should keep streak when last activity was today', () => {
      const today = new Date();
      const todayFormatted = today.toISOString().split('T')[0];
      const currentStreak = 5;
      
      expect(calculateStreakUpdate(todayFormatted, currentStreak)).toBe(5);
    });

    it('should reset streak to 1 when last activity was not consecutive', () => {
      const today = new Date();
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const twoDaysAgoFormatted = twoDaysAgo.toISOString().split('T')[0];
      const currentStreak = 5;
      
      expect(calculateStreakUpdate(twoDaysAgoFormatted, currentStreak)).toBe(1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const lastWeekFormatted = lastWeek.toISOString().split('T')[0];
      
      expect(calculateStreakUpdate(lastWeekFormatted, currentStreak)).toBe(1);
    });
  });
});
