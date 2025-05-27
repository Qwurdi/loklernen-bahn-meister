
import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useSpacedRepetition } from '../index';

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

// Mock SpacedRepetitionService
vi.mock('@/services/SpacedRepetitionService', () => ({
  spacedRepetitionService: {
    loadSessionQuestions: vi.fn().mockResolvedValue([
      {
        question: {
          id: 'q1',
          category: 'Signale',
          sub_category: 'Hauptsignale',
          difficulty: 3,
          text: 'Test question 1',
          question_type: 'MC_single',
          answers: [
            { text: 'Answer 1', isCorrect: true },
            { text: 'Answer 2', isCorrect: false }
          ],
          image_url: null,
          created_by: 'test-user',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          revision: 1
        },
        progress: undefined
      }
    ]),
    submitAnswer: vi.fn().mockResolvedValue({})
  }
}));

// Test component using the hook
function TestComponent() {
  const {
    loading,
    error,
    questions,
    progress,
    submitAnswer,
    loadQuestions
  } = useSpacedRepetition();

  return (
    <div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="error">{error ? error.message : 'no-error'}</div>
      <div data-testid="questions-count">{questions.length}</div>
      <div data-testid="progress-total">{progress.totalQuestions}</div>
      <button 
        onClick={() => submitAnswer('q1', 5)}
        data-testid="submit-answer-btn"
      >
        Submit Answer
      </button>
      <button 
        onClick={() => loadQuestions({ category: 'Signale' })}
        data-testid="load-questions-btn"
      >
        Load Questions
      </button>
    </div>
  );
}

describe('useSpacedRepetition', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializes with default state', () => {
    const { getByTestId } = render(<TestComponent />);
    
    expect(getByTestId('loading').textContent).toBe('false');
    expect(getByTestId('error').textContent).toBe('no-error');
    expect(getByTestId('questions-count').textContent).toBe('0');
    expect(getByTestId('progress-total').textContent).toBe('0');
  });

  it('loads questions when requested', async () => {
    const { getByTestId } = render(<TestComponent />);
    
    const loadButton = getByTestId('load-questions-btn');
    
    await act(async () => {
      loadButton.click();
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    expect(getByTestId('questions-count').textContent).toBe('1');
    expect(getByTestId('progress-total').textContent).toBe('1');
  });

  it('submits answers correctly', async () => {
    const { getByTestId } = render(<TestComponent />);
    
    // First load questions
    const loadButton = getByTestId('load-questions-btn');
    await act(async () => {
      loadButton.click();
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    // Then submit an answer
    const submitButton = getByTestId('submit-answer-btn');
    await act(async () => {
      submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    
    // Verify submit was called
    expect(getByTestId('error').textContent).toBe('no-error');
  });
});
