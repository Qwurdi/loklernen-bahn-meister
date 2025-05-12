
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { useSessionState } from '../useSessionState';

// Mock component that uses the hook
function TestComponent() {
  const { 
    state, 
    goToNextQuestion,
    goToPreviousQuestion,
    setCurrentQuestionIndex,
    markQuestionAsAnswered,
    finishSession
  } = useSessionState(5);
  
  return (
    <div>
      <div data-testid="current-index">{state.currentQuestionIndex}</div>
      <div data-testid="total-questions">{state.totalQuestions}</div>
      <div data-testid="answered-count">{state.answeredQuestions.length}</div>
      <div data-testid="is-finished">{state.isFinished ? 'true' : 'false'}</div>
      <button onClick={() => goToNextQuestion()} data-testid="next-btn">Next</button>
      <button onClick={() => goToPreviousQuestion()} data-testid="prev-btn">Previous</button>
      <button onClick={() => setCurrentQuestionIndex(2)} data-testid="set-index-btn">Set to 2</button>
      <button onClick={() => markQuestionAsAnswered(state.currentQuestionIndex)} data-testid="mark-answered-btn">Mark Answered</button>
      <button onClick={() => finishSession()} data-testid="finish-btn">Finish</button>
    </div>
  );
}

describe('useSessionState', () => {
  it('initializes with the correct state', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('current-index').textContent).toBe('0');
    expect(screen.getByTestId('total-questions').textContent).toBe('5');
    expect(screen.getByTestId('answered-count').textContent).toBe('0');
    expect(screen.getByTestId('is-finished').textContent).toBe('false');
  });

  it('increments the question index when goToNextQuestion is called', async () => {
    render(<TestComponent />);
    const nextButton = screen.getByTestId('next-btn');
    
    await act(async () => {
      await userEvent.click(nextButton);
    });
    
    expect(screen.getByTestId('current-index').textContent).toBe('1');
  });

  it('decrements the question index when goToPreviousQuestion is called', async () => {
    render(<TestComponent />);
    
    // First go to the next question
    const nextButton = screen.getByTestId('next-btn');
    await act(async () => {
      await userEvent.click(nextButton);
    });
    
    expect(screen.getByTestId('current-index').textContent).toBe('1');
    
    // Then go back
    const prevButton = screen.getByTestId('prev-btn');
    await act(async () => {
      await userEvent.click(prevButton);
    });
    
    expect(screen.getByTestId('current-index').textContent).toBe('0');
  });

  it('sets the question index when setCurrentQuestionIndex is called', async () => {
    render(<TestComponent />);
    
    const setIndexButton = screen.getByTestId('set-index-btn');
    await act(async () => {
      await userEvent.click(setIndexButton);
    });
    
    expect(screen.getByTestId('current-index').textContent).toBe('2');
  });

  it('adds question to answered list when markQuestionAsAnswered is called', async () => {
    render(<TestComponent />);
    
    const markAnsweredButton = screen.getByTestId('mark-answered-btn');
    await act(async () => {
      await userEvent.click(markAnsweredButton);
    });
    
    expect(screen.getByTestId('answered-count').textContent).toBe('1');
  });

  it('finishes the session when finishSession is called', async () => {
    render(<TestComponent />);
    
    const finishButton = screen.getByTestId('finish-btn');
    await act(async () => {
      await userEvent.click(finishButton);
    });
    
    expect(screen.getByTestId('is-finished').textContent).toBe('true');
  });
});
