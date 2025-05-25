
import React from 'react';
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import UnifiedMobileCard from './UnifiedMobileCard';

interface MobileFlashcardDisplayProps {
  question: Question;
  onAnswer: (score: number) => void;
  regulationPreference: RegulationFilterType;
  className?: string;
}

export default function MobileFlashcardDisplay({ 
  question, 
  onAnswer,
  regulationPreference,
  className = '' 
}: MobileFlashcardDisplayProps) {
  return (
    <div className={`h-full w-full ${className}`}>
      <UnifiedMobileCard
        key={question.id} // Force re-render on question change
        question={question}
        onAnswer={onAnswer}
        regulationPreference={regulationPreference}
      />
    </div>
  );
}
