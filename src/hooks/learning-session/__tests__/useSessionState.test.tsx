
import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { useSessionState } from '../useSessionState';
import { Question } from '@/types/questions';
import { describe, expect, it, vi } from 'vitest';

// Mock data
const mockQuestions: Question[] = [
  {
    id: '1',
    category: 'Signale',
    sub_category: 'Test',
    question_type: 'MC_single',
    difficulty: 1,
    text: 'Test Question 1',
    image_url: null, // Added the required property
    answers: [{ text: 'Answer 1', isCorrect: true }],
    created_by: 'test',
    revision: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    category: 'Signale',
    sub_category: 'Test',
    question_type: 'MC_single',
    difficulty: 1,
    text: 'Test Question 2',
    image_url: null, // Added the required property
    answers: [{ text: 'Answer 2', isCorrect: true }],
    created_by: 'test',
    revision: 1,
    created_at: '',
    updated_at: '',
  }
];

// Mock component that uses the hook
function TestComponent() {
  const { 
    currentIndex, 
    setCurrentIndex,
    correctCount,
    sessionCards,
    sessionFinished,
    handleAnswer,
    handleComplete,
    handleRestart
  } = useSessionState(
    false, // questionsLoading
    mockQuestions, // dueQuestions
    true, // categoryFound
    false, // categoryRequiresAuth
    { id: 'test-user' } // user
  );
  
  return (
    <div>
      <div data-testid="current-index">{currentIndex}</div>
      <div data-testid="correct-count">{correctCount}</div>
      <div data-testid="session-cards">{sessionCards.length}</div>
      <div data-testid="is-finished">{sessionFinished ? 'true' : 'false'}</div>
      <button onClick={() => setCurrentIndex(currentIndex + 1)} data-testid="next-btn">Next</button>
      <button onClick={() => setCurrentIndex(currentIndex - 1)} data-testid="prev-btn">Previous</button>
      <button onClick={() => setCurrentIndex(2)} data-testid="set-index-btn">Set to 2</button>
      <button onClick={() => handleAnswer('1', 5)} data-testid="answer-btn">Answer Correctly</button>
      {/* Fixed the event handler by using an arrow function */}
      <button onClick={() => handleComplete()} data-testid="complete-btn">Complete</button>
    </div>
  );
}

describe('useSessionState', () => {
  it('initializes with the correct state', () => {
    const { result } = renderHook(() => 
      useSessionState(false, mockQuestions, true, false, { id: 'test-user' })
    );
    
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.correctCount).toBe(0);
    expect(result.current.sessionCards.length).toBe(2);
    expect(result.current.sessionFinished).toBe(false);
  });

  it('increments correct count when answering correctly', async () => {
    const submitAnswerMock = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => 
      useSessionState(false, mockQuestions, true, false, { id: 'test-user' })
    );
    
    // Answer with score 5 (considered correct)
    await result.current.handleAnswer('1', 5, submitAnswerMock);
    
    expect(result.current.correctCount).toBe(1);
    expect(submitAnswerMock).toHaveBeenCalledWith('1', 5);
  });

  it('marks session as finished when handleComplete is called', () => {
    const applyUpdatesMock = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => 
      useSessionState(false, mockQuestions, true, false, { id: 'test-user' })
    );
    
    result.current.handleComplete(applyUpdatesMock);
    
    expect(result.current.sessionFinished).toBe(true);
    expect(applyUpdatesMock).toHaveBeenCalled();
  });

  it('resets session when handleRestart is called', async () => {
    const applyUpdatesMock = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => 
      useSessionState(false, mockQuestions, true, false, { id: 'test-user' })
    );
    
    // First complete the session
    result.current.handleComplete(applyUpdatesMock);
    expect(result.current.sessionFinished).toBe(true);
    
    // Then restart it
    await result.current.handleRestart(applyUpdatesMock, mockQuestions);
    
    expect(result.current.sessionFinished).toBe(false);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.correctCount).toBe(0);
    expect(applyUpdatesMock).toHaveBeenCalled();
  });
});
