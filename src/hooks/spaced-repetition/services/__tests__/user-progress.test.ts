
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateNextReview } from '../../utils';
import { updateUserProgress, updateUserStats } from '../user-progress';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis()
  }
}));

// Mock calculateNextReview utility
vi.mock('../../utils', () => ({
  calculateNextReview: vi.fn().mockReturnValue({
    interval_days: 6,
    ease_factor: 2.5,
    next_review_at: '2025-05-10T00:00:00.000Z'
  })
}));

describe('user-progress service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateUserProgress', () => {
    it('should update existing progress correctly', async () => {
      // Mock the supabase response for update
      const mockUpdateResponse = { error: null };
      supabase.from().update().eq = vi.fn().mockResolvedValue(mockUpdateResponse);

      const userId = 'test-user-id';
      const questionId = 'test-question-id';
      const score = 5;
      const currentProgress = {
        id: 'progress-id',
        question_id: questionId,
        repetition_count: 1,
        correct_count: 1,
        incorrect_count: 0,
        last_score: 0,
        ease_factor: 2.3,
        interval_days: 1,
        last_reviewed_at: '2025-05-01T00:00:00.000Z',
        next_review_at: '2025-05-02T00:00:00.000Z',
      };

      await updateUserProgress(userId, questionId, score, currentProgress);

      // Check if calculateNextReview was called with the right parameters
      expect(calculateNextReview).toHaveBeenCalledWith(score, currentProgress);
      
      // Check if supabase update was called with the right table
      expect(supabase.from).toHaveBeenCalledWith('user_progress');
      
      // Check if the update method was called
      expect(supabase.from().update).toHaveBeenCalled();
      
      // Check if we're updating the correct record
      expect(supabase.from().update().eq).toHaveBeenCalledWith('id', 'progress-id');
    });

    it('should create new progress when no existing progress is provided', async () => {
      // Mock the supabase response for insert
      const mockInsertResponse = { error: null };
      supabase.from().insert = vi.fn().mockResolvedValue(mockInsertResponse);

      const userId = 'test-user-id';
      const questionId = 'test-question-id';
      const score = 3;

      await updateUserProgress(userId, questionId, score);

      // Check if calculateNextReview was called with the right parameters
      expect(calculateNextReview).toHaveBeenCalledWith(score, undefined);
      
      // Check if supabase insert was called with the right table
      expect(supabase.from).toHaveBeenCalledWith('user_progress');
      
      // Check if the insert method was called
      expect(supabase.from().insert).toHaveBeenCalled();
    });

    it('should throw an error when Supabase update fails', async () => {
      // Mock the supabase response for update failure
      const mockUpdateError = { error: new Error('Update failed') };
      supabase.from().update().eq = vi.fn().mockResolvedValue(mockUpdateError);

      const userId = 'test-user-id';
      const questionId = 'test-question-id';
      const score = 5;
      const currentProgress = {
        id: 'progress-id',
        question_id: questionId,
        repetition_count: 1,
        correct_count: 1,
        incorrect_count: 0,
        last_score: 0,
        ease_factor: 2.3,
        interval_days: 1,
        last_reviewed_at: '2025-05-01T00:00:00.000Z',
        next_review_at: '2025-05-02T00:00:00.000Z',
      };

      await expect(updateUserProgress(userId, questionId, score, currentProgress))
        .rejects.toThrow();
    });
  });

  describe('updateUserStats', () => {
    it('should update existing user stats when they exist', async () => {
      // Mock existing stats
      const mockExistingStats = {
        data: {
          xp: 100,
          total_correct: 10,
          total_incorrect: 2
        },
        error: null
      };
      
      // Mock update response
      const mockUpdateResponse = { error: null };
      
      supabase.from().select().eq().single = vi.fn().mockResolvedValue(mockExistingStats);
      supabase.from().update().eq = vi.fn().mockResolvedValue(mockUpdateResponse);

      const userId = 'test-user-id';
      const score = 5;

      await updateUserStats(userId, score);

      // Check if we're querying the right table
      expect(supabase.from).toHaveBeenCalledWith('user_stats');
      
      // Check if we're updating the correct user stats
      expect(supabase.from().update().eq).toHaveBeenCalledWith('user_id', userId);
    });

    it('should create new user stats when they do not exist', async () => {
      // Mock no existing stats (PGRST116 is the "no rows returned" error code)
      const mockNoExistingStats = {
        data: null,
        error: { code: 'PGRST116' }
      };
      
      // Mock insert response
      const mockInsertResponse = { error: null };
      
      supabase.from().select().eq().single = vi.fn().mockResolvedValue(mockNoExistingStats);
      supabase.from().insert = vi.fn().mockResolvedValue(mockInsertResponse);

      const userId = 'test-user-id';
      const score = 2;

      await updateUserStats(userId, score);

      // Check if we're querying the right table
      expect(supabase.from).toHaveBeenCalledWith('user_stats');
      
      // Check if the insert method was called
      expect(supabase.from().insert).toHaveBeenCalled();
    });
  });
});
