
import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/questions';
import { FlashcardState, AnswerFeedback } from '@/types/flashcard';

interface UseUnifiedCardStateProps {
  question: Question;
  autoReset?: boolean;
  onStateChange?: (state: FlashcardState) => void;
}

export function useUnifiedCardState({
  question,
  autoReset = true,
  onStateChange
}: UseUnifiedCardStateProps) {
  const [state, setState] = useState<FlashcardState>({
    isFlipped: false,
    isAnswered: false,
    isAnimating: false,
    swipeEnabled: false
  });

  const [answerHistory, setAnswerHistory] = useState<AnswerFeedback[]>([]);

  // Reset state when question changes
  useEffect(() => {
    if (autoReset) {
      setState({
        isFlipped: false,
        isAnswered: false,
        isAnimating: false,
        swipeEnabled: false
      });
      setAnswerHistory([]);
    }
  }, [question.id, autoReset]);

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  const updateState = useCallback((updates: Partial<FlashcardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const flip = useCallback(() => {
    if (state.isAnimating) return;
    
    updateState({ isAnimating: true });
    
    setTimeout(() => {
      updateState({ 
        isFlipped: !state.isFlipped, 
        isAnimating: false,
        swipeEnabled: !state.isFlipped && question.question_type === 'open'
      });
    }, 300);
  }, [state.isFlipped, state.isAnimating, question.question_type, updateState]);

  const answer = useCallback((score: number) => {
    if (state.isAnswered) return;

    const feedback: AnswerFeedback = {
      score,
      isCorrect: score >= 4,
      timestamp: Date.now()
    };

    setAnswerHistory(prev => [...prev, feedback]);
    updateState({ 
      isAnswered: true, 
      swipeEnabled: false 
    });
  }, [state.isAnswered, updateState]);

  const reset = useCallback(() => {
    setState({
      isFlipped: false,
      isAnswered: false,
      isAnimating: false,
      swipeEnabled: false
    });
    setAnswerHistory([]);
  }, []);

  return {
    state,
    answerHistory,
    actions: {
      flip,
      answer,
      reset,
      updateState
    },
    computed: {
      canFlip: !state.isAnimating,
      canAnswer: state.isFlipped && !state.isAnswered,
      isMultipleChoice: question.question_type === 'MC_single' || question.question_type === 'MC_multi',
      lastAnswer: answerHistory[answerHistory.length - 1]
    }
  };
}
