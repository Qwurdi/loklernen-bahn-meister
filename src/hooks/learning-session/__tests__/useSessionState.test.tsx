
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSessionState } from '../useSessionState';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Question } from '@/types/questions';

// Mock data
const mockQuestions: Question[] = [
  {
    id: 'q1',
    category: 'Signale',
    sub_category: 'Haupt- und Vorsignale',
    question_type: 'open',
    difficulty: 3,
    text: 'Was bedeutet das Signal Hp 0?',
    image_url: null,
    answers: [{ text: 'Halt', isCorrect: true }],
    created_by: 'test-user',
    revision: 1,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'q2',
    category: 'Signale',
    sub_category: 'Haupt- und Vorsignale',
    question_type: 'open',
    difficulty: 2,
    text: 'Was bedeutet das Signal Hp 1?',
    image_url: null,
    answers: [{ text: 'Fahrt', isCorrect: true }],
    created_by: 'test-user',
    revision: 1,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

// Mock functions
const mockSubmitAnswer = vi.fn();
const mockApplyPendingUpdates = vi.fn().mockResolvedValue(undefined);

describe('useSessionState hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSessionState(false, mockQuestions, true, false, { id: 'test-user' }));
    
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.correctCount).toBe(0);
    expect(result.current.sessionFinished).toBe(false);
    expect(result.current.sessionCards.length).toBe(2);
  });

  it('should set session cards when questions are loaded', () => {
    const { result } = renderHook(() => useSessionState(false, mockQuestions, true, false, { id: 'test-user' }));
    
    expect(result.current.sessionCards.length).toBe(2);
    // Verify that cards are shuffled (though this is probabilistic, the length should match)
    expect(result.current.sessionCards.length).toEqual(mockQuestions.length);
  });

  it('should not set session cards when category is not found', () => {
    const { result } = renderHook(() => useSessionState(false, mockQuestions, false, false, { id: 'test-user' }));
    
    expect(result.current.sessionCards.length).toBe(0);
  });

  it('should not set session cards when category requires auth but user not logged in', () => {
    const { result } = renderHook(() => useSessionState(false, mockQuestions, true, true, null));
    
    expect(result.current.sessionCards.length).toBe(0);
  });

  it('should handle answer correctly with correct score', async () => {
    const { result } = renderHook(() => useSessionState(false, mockQuestions, true, false, { id: 'test-user' }));
    
    await act(async () => {
      await result.current.handleAnswer('q1', 5, mockSubmitAnswer);
    });
    
    expect(result.current.correctCount).toBe(1);
    expect(mockSubmitAnswer).toHaveBeenCalledWith('q1', 5);
  });

  it('should not increment correct count for scores below 4', async () => {
    const { result } = renderHook(() => useSessionState(false, mockQuestions, true, false, { id: 'test-user' }));
    
    await act(async () => {
      await result.current.handleAnswer('q1', 3, mockSubmitAnswer);
    });
    
    expect(result.current.correctCount).toBe(0);
    expect(mockSubmitAnswer).toHaveBeenCalledWith('q1', 3);
  });

  it('should handle session completion', async () => {
    const { result } = renderHook(() => useSessionState(false, mockQuestions, true, false, { id: 'test-user' }));
    
    await act(async () => {
      result.current.handleComplete(mockApplyPendingUpdates);
    });
    
    expect(result.current.sessionFinished).toBe(true);
    expect(mockApplyPendingUpdates).toHaveBeenCalledTimes(1);
  });

  it('should handle session restart', async () => {
    const { result } = renderHook(() => useSessionState(false, mockQuestions, true, false, { id: 'test-user' }));
    
    // First complete the session
    await act(async () => {
      result.current.handleComplete(mockApplyPendingUpdates);
    });
    
    expect(result.current.sessionFinished).toBe(true);
    
    // Then restart it
    await act(async () => {
      await result.current.handleRestart(mockApplyPendingUpdates, mockQuestions);
    });
    
    expect(result.current.sessionFinished).toBe(false);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.correctCount).toBe(0);
    expect(result.current.sessionCards.length).toBe(2);
    expect(mockApplyPendingUpdates).toHaveBeenCalledTimes(2);
  });

  it('should set empty sessionCards array when no due questions are available', () => {
    const { result } = renderHook(() => useSessionState(false, [], true, false, { id: 'test-user' }));
    
    expect(result.current.sessionCards).toEqual([]);
  });
});
