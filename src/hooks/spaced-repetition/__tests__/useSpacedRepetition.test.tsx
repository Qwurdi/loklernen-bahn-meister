
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { useSpacedRepetition } from '../index';
import { mockQuestions, mockUserProgress } from './mockData';

// Mocking the services used by the hook
jest.mock('../services', () => ({
  fetchUserProgress: jest.fn().mockResolvedValue(mockUserProgress),
  fetchNewQuestions: jest.fn().mockResolvedValue(mockQuestions),
  fetchPracticeQuestions: jest.fn().mockResolvedValue(mockQuestions),
  fetchQuestionsByBox: jest.fn().mockResolvedValue(mockUserProgress),
  updateUserProgress: jest.fn().mockResolvedValue({}),
  updateUserStats: jest.fn().mockResolvedValue({})
}));

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
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
  it('initializes with loading state and fetches questions', async () => {
    render(<TestComponent />);
    
    // Initially loading
    expect(screen.getByTestId('loading').textContent).toBe('true');
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('questions-count').textContent).not.toBe('0');
    expect(screen.getByTestId('error').textContent).toBe('no-error');
  });

  it('submits answers and tracks pending updates', async () => {
    render(<TestComponent />);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    // Submit an answer
    const submitButton = screen.getByTestId('submit-answer-btn');
    
    await act(async () => {
      await userEvent.click(submitButton);
    });
    
    // Check that we have a pending update
    expect(screen.getByTestId('pending-updates').textContent).toBe('1');
    
    // Apply updates
    const applyButton = screen.getByTestId('apply-updates-btn');
    
    await act(async () => {
      await userEvent.click(applyButton);
      // Wait for updates to apply
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    // Pending updates should be cleared
    expect(screen.getByTestId('pending-updates').textContent).toBe('0');
  });
});
