
import React from 'react';
import { Question } from '@/types/questions';
import MultipleChoiceQuestion from '@/components/flashcards/MultipleChoice';

interface EnhancedMobileMultipleChoiceProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export default function EnhancedMobileMultipleChoice({
  question,
  onAnswer
}: EnhancedMobileMultipleChoiceProps) {
  return (
    <MultipleChoiceQuestion 
      question={question} 
      onAnswer={onAnswer}
      isMobile={true}
    />
  );
}
