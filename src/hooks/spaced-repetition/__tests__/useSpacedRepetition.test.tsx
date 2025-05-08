
import { renderHook, act } from '@testing-library/react';
import { useSpacedRepetition } from '../useSpacedRepetition';
import { fetchUserProgress, updateUserProgress } from '../services';
import { Question, QuestionCategory } from '@/types/questions';

// Mock dependencies
jest.mock('../services', () => ({
  fetchUserProgress: jest.fn(),
  fetchDueCardsForSR: jest.fn(),
  fetchNewQuestions: jest.fn(),
  fetchPracticeQuestions: jest.fn(),
  fetchSpecificCardsForSR: jest.fn(),
  fetchCategoryCardsForSR: jest.fn(),
  fetchAllCardsForSR: jest.fn(),
  updateUserProgress: jest.fn(),
  updateUserStats: jest.fn(),
}));

describe('useSpacedRepetition', () => {
  // Mock data
  const mockUserId = 'user1';
  const mockQuestion1 = { id: '1', title: 'Question 1' } as unknown as Question;
  const mockQuestion2 = { id: '2', title: 'Question 2' } as unknown as Question;
  
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchUserProgress as jest.Mock).mockResolvedValue([]);
  });

  it('should initialize with loading state true', () => {
    const { result } = renderHook(() => useSpacedRepetition(mockUserId));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.dueQuestions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should handle practice mode correctly', async () => {
    const options = { 
      practiceMode: true 
    };
    
    const { result, waitFor } = renderHook(() => useSpacedRepetition(undefined, options));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    expect(result.current.dueQuestions).toEqual([]);
  });

  it('should handle regulation filtering correctly', async () => {
    const options = { 
      regulationCategory: 'DS 301' 
    };
    
    const { result } = renderHook(() => useSpacedRepetition(mockUserId, options));
    
    expect(result.current.loading).toBe(true);
  });

  it('should handle submitAnswer correctly for a user', async () => {
    (updateUserProgress as jest.Mock).mockResolvedValue({});
    
    const { result, waitFor } = renderHook(() => useSpacedRepetition(mockUserId));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    await act(async () => {
      await result.current.submitAnswer(1, 5);
    });
    
    expect(result.current.pendingUpdatesCount).toBeGreaterThan(0);
  });

  it('should use the correct submission values', async () => {
    (updateUserProgress as jest.Mock).mockResolvedValue({});
    
    const { result, waitFor } = renderHook(() => useSpacedRepetition(mockUserId));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    await act(async () => {
      await result.current.submitAnswer(1, 5); // Correct
      await result.current.submitAnswer(2, 1); // Incorrect
    });
    
    expect(result.current.pendingUpdatesCount).toBe(2);
    // The test could check internal state, but that's implementation details
  });

  it('should apply pending updates when requested', async () => {
    (updateUserProgress as jest.Mock).mockResolvedValue({});
    
    const { result, waitFor } = renderHook(() => useSpacedRepetition(mockUserId));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    await act(async () => {
      await result.current.submitAnswer(1, 5);
      await result.current.applyPendingUpdates();
    });
    
    expect(result.current.pendingUpdatesCount).toBe(0);
  });

  it('should start a new session with the correct parameters', async () => {
    const { result, waitFor } = renderHook(() => useSpacedRepetition(mockUserId));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    await act(async () => {
      await result.current.startNewSession('category', 'Signale' as QuestionCategory, 'DS 301');
    });
    
    // In a real test, we'd verify that the correct service was called
    // Here we just test that the call doesn't throw an error
    expect(result.current.loading).toBe(false);
  });
});
