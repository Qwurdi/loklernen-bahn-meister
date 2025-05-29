
import React from 'react';
import { Question } from '@/types/questions';
import MultipleChoiceQuestion from '@/components/flashcards/MultipleChoice';

interface ModernMultipleChoiceProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export default function ModernMultipleChoice({
  question,
  onAnswer
}: ModernMultipleChoiceProps) {
  return (
    <div className="space-y-4">
      <MultipleChoiceQuestion 
        question={question} 
        onAnswer={onAnswer}
        isMobile={false}
      />
    </div>
  );
}
