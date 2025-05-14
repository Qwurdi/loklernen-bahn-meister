
import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useSpacedRepetition } from '../index';
import { mockQuestions, mockUserProgress } from './mockData';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mocking the services used by the hook
vi.mock('../services', () => ({
  fetchUserProgress: vi.fn().mockResolvedValue(mockUserProgress),
  fetchNewQuestions: vi.fn().mockResolvedValue(mockQuestions),
  fetchPracticeQuestions: vi.fn().mockResolvedValue(mockQuestions),
  fetchQuestionsByBox: vi.fn().mockResolvedValue(mockUserProgress),
  updateUserProgress: vi.fn().mockResolvedValue({}),
  updateUserStats: vi.fn().mockResolvedValue({})
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

// Test component using the hook
function TestComponent() {
  const {
    loading,
    error,
    dueQuestions,
    submitAnswer,
    pendingUpdatesCount,
    applyPendingUpdates
  } = useSpacedRepetition('Signale', 'Hauptsignale');

  return (
    <div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="error">{error ? error.message : 'no-error'}</div>
      <div data-testid="questions-count">{dueQuestions.length}</div>
      <div data-testid="pending-updates">{pendingUpdatesCount}</div>
      <button 
        onClick={() => submitAnswer('q1', 5)}
        data-testid="submit-answer-btn"
      >
        Submit Answer
      </button>
      <button 
        onClick={() => applyPendingUpdates()}
        data-testid="apply-updates-btn"
      >
        Apply Updates
      </button>
    </div>
  );
}

describe('useSpacedRepetition', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializes with loading state and fetches questions', async () => {
    const { getByTestId } = render(<TestComponent />);
    
    // Initially loading
    expect(getByTestId('loading').textContent).toBe('true');
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    expect(getByTestId('loading').textContent).toBe('false');
    expect(getByTestId('questions-count').textContent).not.toBe('0');
    expect(getByTestId('error').textContent).toBe('no-error');
  });

  it('submits answers and tracks pending updates', async () => {
    const { getByTestId } = render(<TestComponent />);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    // Submit an answer
    const submitButton = getByTestId('submit-answer-btn');
    
    await act(async () => {
      submitButton.click();
    });
    
    // Check that we have a pending update
    expect(getByTestId('pending-updates').textContent).toBe('1');
    
    // Apply updates
    const applyButton = getByTestId('apply-updates-btn');
    
    await act(async () => {
      applyButton.click();
      // Wait for updates to apply
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    // Pending updates should be cleared
    expect(getByTestId('pending-updates').textContent).toBe('0');
  });
});
