import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateNextReviewDate } from '../../utils';
import { updateUserProgress } from '../progress-updates';
import { updateUserStats } from '../user-stats';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        error: null
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: null
          }))
        }))
      }))
    }))
  }
}));

// Mock calculateNextReviewDate utility
vi.mock('../../utils', () => ({
  calculateNextReviewDate: vi.fn().mockReturnValue('2025-05-10T00:00:00.000Z')
}));

describe('user-progress service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateUserProgress', () => {
    it('should update existing progress correctly', async () => {
      // Mock the supabase response for update
      const mockUpdateResponse = { error: null };
      const mockEq = vi.fn(() => mockUpdateResponse);
      const mockUpdate = vi.fn(() => ({ eq: mockEq }));
      const mockFrom = vi.fn(() => ({ update: mockUpdate }));
      
      // @ts-ignore - Override the mock
      supabase.from = mockFrom;

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
        box_number: 1,
        streak: 0
      };

      await updateUserProgress(userId, questionId, score, currentProgress);

      // Check if calculateNextReviewDate was called correctly
      expect(calculateNextReviewDate).toHaveBeenCalled();
      
      // Check if supabase update was called with the right table
      expect(mockFrom).toHaveBeenCalledWith('user_progress');
      
      // Check if the update method was called
      expect(mockUpdate).toHaveBeenCalled();
      
      // Check if we're updating the correct record
      expect(mockEq).toHaveBeenCalledWith('id', 'progress-id');
    });

    it('should create new progress when no existing progress is provided', async () => {
      // Mock the supabase response for insert
      const mockInsertResponse = { error: null };
      const mockInsert = vi.fn(() => mockInsertResponse);
      const mockFrom = vi.fn(() => ({ insert: mockInsert }));
      
      // @ts-ignore - Override the mock
      supabase.from = mockFrom;

      const userId = 'test-user-id';
      const questionId = 'test-question-id';
      const score = 3;

      await updateUserProgress(userId, questionId, score);

      // Check if calculateNextReviewDate was called with the right parameters
      expect(calculateNextReviewDate).toHaveBeenCalled();
      
      // Check if supabase insert was called with the right table
      expect(mockFrom).toHaveBeenCalledWith('user_progress');
      
      // Check if the insert method was called
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should throw an error when Supabase update fails', async () => {
      // Mock the supabase response for update failure
      const mockUpdateError = { error: new Error('Update failed') };
      const mockEq = vi.fn(() => mockUpdateError);
      const mockUpdate = vi.fn(() => ({ eq: mockEq }));
      const mockFrom = vi.fn(() => ({ update: mockUpdate }));
      
      // @ts-ignore - Override the mock
      supabase.from = mockFrom;

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
        box_number: 1,
        streak: 0
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
      
      const mockSingle = vi.fn(() => mockExistingStats);
      const mockEqSelect = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEqSelect }));
      
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
      
      // Check if we're updating the correct user stats
      expect(mockEqUpdate).toHaveBeenCalledWith('user_id', userId);
    });

    it('should create new user stats when they do not exist', async () => {
      // Mock no existing stats (PGRST116 is the "no rows returned" error code)
      const mockNoExistingStats = {
        data: null,
        error: { code: 'PGRST116' }
      };
      
      // Mock insert response
      const mockInsertResponse = { error: null };
      
      const mockSingle = vi.fn(() => mockNoExistingStats);
      const mockEqSelect = vi.fn(() => ({ single: mockSingle }));
      const mockSelect = vi.fn(() => ({ eq: mockEqSelect }));
      
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
      
      // Check if the insert method was called
      expect(mockInsert).toHaveBeenCalled();
    });
  });
});
