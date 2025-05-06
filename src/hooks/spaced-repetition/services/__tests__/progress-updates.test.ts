
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateNextReviewDate } from '../../utils';
import { updateUserProgress } from '../progress-updates';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            data: null,
            error: null
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          data: null,
          error: null
        }))
      }))
    }))
  }
}));

// Mock calculateNextReviewDate utility
vi.mock('../../utils', () => ({
  calculateNextReviewDate: vi.fn().mockReturnValue('2025-05-10T00:00:00.000Z')
}));

describe('progress-updates service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateUserProgress', () => {
    it('should update existing progress correctly', async () => {
      // Mock the supabase response for update
      const mockUpdateResponse = { data: [{ id: 'updated-progress-id' }], error: null };
      const mockSelect = vi.fn(() => mockUpdateResponse);
      const mockEq = vi.fn(() => ({ select: mockSelect }));
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
      const mockInsertResponse = { data: [{ id: 'new-progress-id' }], error: null };
      const mockSelect = vi.fn(() => mockInsertResponse);
      const mockInsert = vi.fn(() => ({ select: mockSelect }));
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
      const mockUpdateError = { data: null, error: new Error('Update failed') };
      const mockSelect = vi.fn(() => mockUpdateError);
      const mockEq = vi.fn(() => ({ select: mockSelect }));
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
});
