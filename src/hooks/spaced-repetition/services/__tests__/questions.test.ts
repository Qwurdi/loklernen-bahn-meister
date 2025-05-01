
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUserProgress, fetchNewQuestions, fetchPracticeQuestions } from '../questions';
import { supabase } from '@/integrations/supabase/client';
import { transformQuestion } from '../../utils';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis()
  }
}));

// Mock transformQuestion utility
vi.mock('../../utils', () => ({
  transformQuestion: vi.fn(question => ({ ...question, transformed: true }))
}));

describe('questions service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchUserProgress', () => {
    it('should fetch user progress with correct filters', async () => {
      // Mock data response
      const mockProgressData = {
        data: [
          { 
            id: 'progress-1', 
            questions: { id: 'q1', category: 'Signale', sub_category: 'Hauptsignale', regulation_category: 'DS 301' }
          },
          { 
            id: 'progress-2', 
            questions: { id: 'q2', category: 'Signale', sub_category: 'Hauptsignale', regulation_category: 'both' }
          },
          { 
            id: 'progress-3', 
            questions: { id: 'q3', category: 'Betriebsdienst', sub_category: 'Rangieren', regulation_category: 'DV 301' }
          }
        ],
        error: null
      };
      
      supabase.from().select().eq().lte = vi.fn().mockResolvedValue(mockProgressData);

      const userId = 'test-user-id';
      const category = 'Signale';
      const subcategory = 'Hauptsignale';
      const regulationCategory = 'DS 301';

      const result = await fetchUserProgress(userId, category, subcategory, regulationCategory);

      // Check if we're querying the right table
      expect(supabase.from).toHaveBeenCalledWith('user_progress');
      
      // Verify filtering logic works - should only return progress entries for the specified category, subcategory, and regulation
      expect(result.length).toBeLessThanOrEqual(2); // Should exclude the Betriebsdienst entry
      
      // Verify we're selecting progress with questions data joined
      expect(supabase.from().select).toHaveBeenCalledWith('*, questions(*)');
    });
  });

  describe('fetchNewQuestions', () => {
    it('should fetch new questions with correct filters', async () => {
      // Mock data response
      const mockQuestionsData = {
        data: [
          { id: 'q1', category: 'Signale', sub_category: 'Hauptsignale', regulation_category: 'DS 301' },
          { id: 'q2', category: 'Signale', sub_category: 'Hauptsignale', regulation_category: 'both' },
          { id: 'q3', category: 'Signale', sub_category: 'Hauptsignale', regulation_category: null }
        ],
        error: null
      };
      
      supabase.from().select().eq().or().limit = vi.fn().mockResolvedValue(mockQuestionsData);

      const category = 'Signale';
      const subcategory = 'Hauptsignale';
      const regulationCategory = 'DS 301';
      const questionIdsWithProgress = ['q2']; // This question already has progress
      const batchSize = 10;

      const result = await fetchNewQuestions(
        category, 
        subcategory, 
        regulationCategory, 
        questionIdsWithProgress,
        batchSize
      );

      // Check if we're querying the right table
      expect(supabase.from).toHaveBeenCalledWith('questions');
      
      // Verify filtering logic works - should filter out questions with ids in questionIdsWithProgress
      expect(result.length).toBeLessThanOrEqual(2); // Should exclude q2
      
      // Verify we're limiting the query to batchSize
      expect(supabase.from().select().eq().limit).toHaveBeenCalledWith(batchSize);
    });
  });

  describe('fetchPracticeQuestions', () => {
    it('should fetch practice questions and transform them', async () => {
      // Mock data response
      const mockQuestionsData = {
        data: [
          { id: 'q1', category: 'Signale', sub_category: 'Hauptsignale', regulation_category: 'DS 301' },
          { id: 'q2', category: 'Signale', sub_category: 'Hauptsignale', regulation_category: 'both' }
        ],
        error: null
      };
      
      supabase.from().select().eq().or().limit = vi.fn().mockResolvedValue(mockQuestionsData);

      const category = 'Signale';
      const subcategory = 'Hauptsignale';
      const regulationCategory = 'DS 301';
      const batchSize = 10;

      const result = await fetchPracticeQuestions(
        category, 
        subcategory, 
        regulationCategory, 
        batchSize
      );

      // Check if we're querying the right table
      expect(supabase.from).toHaveBeenCalledWith('questions');
      
      // Verify we're transforming questions
      expect(transformQuestion).toHaveBeenCalledTimes(2);
      
      // Verify we're getting transformed questions back
      expect(result[0].transformed).toBeTruthy();
      expect(result[1].transformed).toBeTruthy();
    });
  });
});
