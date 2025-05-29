
import { useState, useCallback } from 'react';
import { Question } from '@/types/questions';

interface UseCardStateProps {
  question: Question;
  onAnswerSubmitted: (score: number) => void;
}

export function useCardState({ question, onAnswerSubmitted }: UseCardStateProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const showAnswer = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const submitAnswer = useCallback((score: number) => {
    setIsAnswered(true);
    onAnswerSubmitted(score);
  }, [onAnswerSubmitted]);

  const swipeEnabled = isFlipped && !isAnswered && question.question_type === 'open';

  return {
    isFlipped,
    isAnswered,
    swipeEnabled,
    showAnswer,
    submitAnswer
  };
}
