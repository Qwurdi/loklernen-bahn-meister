
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSpacedRepetition } from '../useSpacedRepetition';
import { 
  fetchUserProgress, 
  fetchNewQuestions, 
  fetchPracticeQuestions, 
  updateUserProgress, 
  updateUserStats 
} from '../services';

// Mock the AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id' }
  }))
}));

// Mock the service functions
vi.mock('../services', () => ({
  fetchUserProgress: vi.fn(),
  fetchNewQuestions: vi.fn(),
  fetchPracticeQuestions: vi.fn(),
  updateUserProgress: vi.fn(),
  updateUserStats: vi.fn()
}));

describe('useSpacedRepetition hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load due questions when initialized', async () => {
    // Setup mock returns
    const mockProgressData = [
      { question_id: 'q1', questions: { id: 'q1', text: 'Question 1?' } }
    ];
    const mockNewQuestions = [
      { id: 'q2', text: 'Question 2?' }
    ];
    
    (fetchUserProgress as any).mockResolvedValue(mockProgressData);
    (fetchNewQuestions as any).mockResolvedValue(mockNewQuestions);

    const { result } = renderHook(() => useSpacedRepetition('Signale'));
    
    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Verify the services were called correctly
    expect(fetchUserProgress).toHaveBeenCalledWith('test-user-id', 'Signale', undefined, 'all');
    expect(fetchNewQuestions).toHaveBeenCalled();
    
    // Verify we have the expected questions
    expect(result.current.dueQuestions.length).toBeGreaterThan(0);
  });

  it('should load practice questions in practice mode', async () => {
    // Setup mock return
    const mockPracticeQuestions = [
      { id: 'q1', text: 'Practice Question 1?' },
      { id: 'q2', text: 'Practice Question 2?' }
    ];
    
    (fetchPracticeQuestions as any).mockResolvedValue(mockPracticeQuestions);

    const { result } = renderHook(() => useSpacedRepetition(
      'Signale', 
      undefined, 
      { practiceMode: true }
    ));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Verify the practice service was called correctly
    expect(fetchPracticeQuestions).toHaveBeenCalledWith('Signale', undefined, 'all', 50);
    
    // Verify we have the expected questions
    expect(result.current.dueQuestions).toEqual(mockPracticeQuestions);
  });

  it('should submit answers correctly', async () => {
    // Setup mock returns
    const mockProgressData = [
      { question_id: 'q1', questions: { id: 'q1', text: 'Question 1?' } }
    ];
    
    (fetchUserProgress as any).mockResolvedValue(mockProgressData);
    (fetchNewQuestions as any).mockResolvedValue([]);
    (updateUserProgress as any).mockResolvedValue({ userId: 'test-user-id', questionId: 'q1', score: 5 });
    (updateUserStats as any).mockResolvedValue({});

    const { result } = renderHook(() => useSpacedRepetition('Signale'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Submit an answer
    await act(async () => {
      await result.current.submitAnswer('q1', 5);
    });
    
    // Verify the update services were called correctly
    expect(updateUserProgress).toHaveBeenCalledWith(
      'test-user-id', 
      'q1', 
      5, 
      expect.anything()
    );
    expect(updateUserStats).toHaveBeenCalledWith('test-user-id', 5);
    
    // Verify that questions were reloaded after submission
    expect(fetchUserProgress).toHaveBeenCalledTimes(2);
  });

  it('should handle reload questions correctly', async () => {
    // Setup mock returns
    const mockProgressData = [
      { question_id: 'q1', questions: { id: 'q1', text: 'Question 1?' } }
    ];
    
    (fetchUserProgress as any).mockResolvedValue(mockProgressData);
    (fetchNewQuestions as any).mockResolvedValue([]);

    const { result } = renderHook(() => useSpacedRepetition('Signale'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Reset call counts
    vi.clearAllMocks();
    
    // Reload questions
    await act(async () => {
      await result.current.reloadQuestions();
    });
    
    // Verify services were called again
    expect(fetchUserProgress).toHaveBeenCalledTimes(1);
    expect(fetchNewQuestions).toHaveBeenCalledTimes(1);
  });

  it('should apply regulation category filter correctly', async () => {
    // Setup mock returns
    const mockProgressData = [
      { question_id: 'q1', questions: { id: 'q1', text: 'Question 1?' } }
    ];
    
    (fetchUserProgress as any).mockResolvedValue(mockProgressData);
    (fetchNewQuestions as any).mockResolvedValue([]);

    const { result } = renderHook(() => useSpacedRepetition(
      'Signale', 
      undefined, 
      { regulationCategory: 'DS 301' }
    ));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Verify the regulation category was passed correctly
    expect(fetchUserProgress).toHaveBeenCalledWith('test-user-id', 'Signale', undefined, 'DS 301');
    expect(fetchNewQuestions).toHaveBeenCalledWith('Signale', undefined, 'DS 301', expect.anything(), expect.anything());
  });
});
