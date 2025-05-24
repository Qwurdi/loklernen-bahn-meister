
import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/questions';

interface CardStateProps {
  question: Question;
  onAnswerSubmitted?: () => void;
}

interface CardState {
  isFlipped: boolean;
  isAnswered: boolean;
  swipeEnabled: boolean;
}

export function useCardState({ question, onAnswerSubmitted }: CardStateProps) {
  const [cardState, setCardState] = useState<CardState>({
    isFlipped: false,
    isAnswered: false,
    swipeEnabled: false
  });

  // Reset state when question changes
  useEffect(() => {
    setCardState({
      isFlipped: false,
      isAnswered: false,
      swipeEnabled: false
    });
  }, [question.id]);

  const showAnswer = useCallback(() => {
    setCardState(prev => ({ ...prev, isFlipped: true }));
    
    // Enable swipe after delay for non-MC questions
    const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
    if (!isMultipleChoice) {
      setTimeout(() => {
        setCardState(prev => ({ ...prev, swipeEnabled: true }));
      }, 1000);
    }
  }, [question.question_type]);

  const submitAnswer = useCallback((score: number) => {
    if (cardState.isAnswered) return; // Prevent double submission
    
    setCardState(prev => ({ ...prev, isAnswered: true, swipeEnabled: false }));
    onAnswerSubmitted?.();
  }, [cardState.isAnswered, onAnswerSubmitted]);

  return {
    ...cardState,
    showAnswer,
    submitAnswer,
    resetState: () => setCardState({
      isFlipped: false,
      isAnswered: false,
      swipeEnabled: false
    })
  };
}
