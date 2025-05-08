
import {
  fetchDueCardsForSR,
  fetchCategoryCardsForSR,
  fetchSpecificCardsForSR,
  fetchAllCardsForSR
} from '../index';
import { vi } from 'vitest';

// Setup mocks
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      then: vi.fn(cb => cb({ data: [], error: null }))
    })
  }
}));

vi.mock('@/api/questions', () => ({
  getQuestionsByIds: vi.fn().mockResolvedValue([])
}));

// Mock transformQuestionToFlashcard
vi.mock('../../utils', () => ({
  transformQuestionToFlashcard: vi.fn(q => ({ ...q, transformedForTest: true }))
}));

describe('Spaced Repetition Question Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      const category = 'Signale';
      const userId = 'test-user-id';
      const regulation = 'DS 301';
      const options = { batchSize: 10 };
      
      await fetchCategoryCardsForSR(category, userId, regulation, options);
      
      // In a real test we would verify the specific Supabase calls
    });

    it('should handle guest mode (no userId)', async () => {
      const category = 'Signale';
      
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
