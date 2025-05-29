
import React from 'react';
import { Question } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import UnifiedMobileCard from './UnifiedMobileCard';

interface ModernFlashcardDisplayProps {
  question: Question;
  onAnswer: (score: number) => void;
  regulationPreference: RegulationFilterType;
  className?: string;
}

export default function ModernFlashcardDisplay({ 
  question, 
  onAnswer, 
  regulationPreference,
  className = '' 
}: ModernFlashcardDisplayProps) {
  return (
    <div className={`h-full w-full ${className}`}>
      <UnifiedMobileCard
        key={question.id}
        question={question}
        onAnswer={onAnswer}
        regulationPreference={regulationPreference}
      />
    </div>
  );
}
