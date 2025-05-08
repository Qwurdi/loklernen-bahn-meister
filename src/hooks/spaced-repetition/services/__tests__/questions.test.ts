import {
  fetchDueCardsForSR,
  fetchCategoryCardsForSR,
  fetchSpecificCardsForSR,
  fetchAllCardsForSR
} from '../index';
import { QuestionCategory } from '@/types/questions';

// Setup mocks
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      then: jest.fn(cb => cb({ data: [], error: null }))
    })
  }
}));

jest.mock('@/api/questions', () => ({
  getQuestionsByIds: jest.fn().mockResolvedValue([])
}));

// Mock transformQuestionToFlashcard
jest.mock('../../utils', () => ({
  transformQuestionToFlashcard: jest.fn(q => ({ ...q, transformedForTest: true }))
}));

describe('Spaced Repetition Question Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchDueCardsForSR', () => {
    it('should fetch due cards for a user', async () => {
      const userId = 'test-user-id';
      const regulation = 'DS 301';
      const options = { batchSize: 10 };
      
      await fetchDueCardsForSR(userId, regulation, options);
      
      // In a real test we would verify the specific Supabase calls
    });

    it('should handle empty results', async () => {
      const userId = 'test-user-id';
      
      const result = await fetchDueCardsForSR(userId);
      
      expect(result).toEqual([]);
    });
  });

  describe('fetchCategoryCardsForSR', () => {
    it('should fetch cards for a specific category', async () => {
      const category = 'Signale' as QuestionCategory;
      const userId = 'test-user-id';
      const regulation = 'DS 301';
      const options = { batchSize: 10 };
      
      await fetchCategoryCardsForSR(category, userId, regulation, options);
      
      // In a real test we would verify the specific Supabase calls
    });

    it('should handle guest mode (no userId)', async () => {
      const category = 'Signale' as QuestionCategory;
      
      const result = await fetchCategoryCardsForSR(category, undefined);
      
      expect(result).toEqual([]);
    });
  });

  describe('fetchSpecificCardsForSR', () => {
    it('should fetch specific cards by IDs', async () => {
      const cardIds = [1, 2, 3];
      const regulation = 'DS 301';
      
      await fetchSpecificCardsForSR(cardIds, regulation);
      
      // In a real test we would verify the specific API calls
    });

    it('should handle empty IDs array', async () => {
      const result = await fetchSpecificCardsForSR([]);
      
      expect(result).toEqual([]);
    });
  });

  describe('fetchAllCardsForSR', () => {
    it('should fetch all cards for a user', async () => {
      const userId = 'test-user-id';
      const regulation = 'DS 301';
      const options = { batchSize: 10 };
      
      await fetchAllCardsForSR(userId, regulation, options);
      
      // In a real test we would verify the specific Supabase calls
    });
  });
});
