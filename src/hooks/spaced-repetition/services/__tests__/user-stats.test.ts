
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateUserStats } from '../user-stats';
import { supabase } from '@/integrations/supabase/client';
import { calculateXpGain } from '../score-calculation';
import { calculateStreakUpdate } from '../streak-management';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => ({
            data: null,
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        error: null
      }))
    }))
  }
}));

vi.mock('../score-calculation', () => ({
  calculateXpGain: vi.fn().mockReturnValue(10)
}));

vi.mock('../streak-management', () => ({
  calculateStreakUpdate: vi.fn().mockReturnValue(2)
}));

describe('user-stats service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateUserStats', () => {
    it('should update existing user stats when they exist', async () => {
      // Mock existing stats
      const mockExistingStats = {
        data: {
          user_id: 'test-user-id',
          xp: 100,
          total_correct: 10,
          total_incorrect: 2,
          last_activity_date: '2025-05-01',
          streak_days: 1
        },
        error: null
      };
      
      // Mock select and update response
      const mockMaybeSingle = vi.fn(() => mockExistingStats);
      const mockEqSelect = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEqSelect }));
      
      const mockUpdateResponse = { error: null };
      const mockEqUpdate = vi.fn(() => mockUpdateResponse);
      const mockUpdate = vi.fn(() => ({ eq: mockEqUpdate }));
      
      const mockFrom = vi.fn(() => ({
        select: mockSelect,
        update: mockUpdate
      }));
      
      // @ts-ignore - Override the mock
      supabase.from = mockFrom;

      const userId = 'test-user-id';
      const score = 5;

      await updateUserStats(userId, score);

      // Check if we're querying the right table
      expect(mockFrom).toHaveBeenCalledWith('user_stats');
      
      // Check if we're selecting with the right user ID
      expect(mockEqSelect).toHaveBeenCalledWith('user_id', userId);
      
      // Check if calculateXpGain was called with the right parameters
      expect(calculateXpGain).toHaveBeenCalledWith(score);
      
      // Check if calculateStreakUpdate was called
      expect(calculateStreakUpdate).toHaveBeenCalled();
      
      // Check if we're updating the correct user stats
      expect(mockEqUpdate).toHaveBeenCalledWith('user_id', userId);
    });

    it('should create new user stats when they do not exist', async () => {
      // Mock no existing stats
      const mockNoExistingStats = {
        data: null,
        error: null
      };
      
      // Mock select and insert response
      const mockMaybeSingle = vi.fn(() => mockNoExistingStats);
      const mockEqSelect = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEqSelect }));
      
      const mockInsertResponse = { error: null };
      const mockInsert = vi.fn(() => mockInsertResponse);
      
      const mockFrom = vi.fn(() => ({
        select: mockSelect,
        insert: mockInsert
      }));
      
      // @ts-ignore - Override the mock
      supabase.from = mockFrom;

      const userId = 'test-user-id';
      const score = 2;

      await updateUserStats(userId, score);

      // Check if we're querying the right table
      expect(mockFrom).toHaveBeenCalledWith('user_stats');
      
      // Check if we're selecting with the right user ID
      expect(mockEqSelect).toHaveBeenCalledWith('user_id', userId);
      
      // Check if calculateXpGain was called with the right parameters
      expect(calculateXpGain).toHaveBeenCalledWith(score);
      
      // Check if the insert method was called
      expect(mockInsert).toHaveBeenCalled();
      
      // Check if we're inserting with the right user ID in the data
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: userId
      }));
    });
  });
});
