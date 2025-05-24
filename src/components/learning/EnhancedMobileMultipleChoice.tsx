
import React, { useState } from 'react';
import { Question } from "@/types/questions";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";
import ExpandableAnswerOption from './ExpandableAnswerOption';

interface EnhancedMobileMultipleChoiceProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export default function EnhancedMobileMultipleChoice({ question, onAnswer }: EnhancedMobileMultipleChoiceProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const isSingleChoice = question.question_type === 'MC_single';
  
  // Calculate correct answer indices
  const correctAnswerIndices = question.answers
    .map((answer, index) => answer.isCorrect ? index : -1)
    .filter(index => index !== -1);
  
  // Text sizing for compact display
  const questionTextClass = useDynamicTextSize(
    question.text,
    'question'
  );
  
  const handleSelection = (index: number) => {
    if (submitted) return;
    
    if (isSingleChoice) {
      setSelectedAnswers([index]);
    } else {
      setSelectedAnswers(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    }
  };
  
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (selectedAnswers.length === 0 || submitted) return;
    
    // Determine if the answer is correct
    if (isSingleChoice) {
      const selectedIsCorrect = question.answers[selectedAnswers[0]]?.isCorrect || false;
      setIsCorrect(selectedIsCorrect);
    } else {
      const allCorrectSelected = correctAnswerIndices.every(idx => selectedAnswers.includes(idx));
      const noIncorrectSelected = selectedAnswers.every(idx => question.answers[idx]?.isCorrect);
      setIsCorrect(allCorrectSelected && noIncorrectSelected);
    }
    
    setSubmitted(true);
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAnswer(isCorrect);
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Question text - compact but readable */}
      <div className={`${questionTextClass} mb-4 text-gray-900`}>
        <SafeRichText content={question.text} />
      </div>
      
      {/* Answer options - with smart scrolling if needed */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-2">
          {question.answers.map((answer, index) => (
            <ExpandableAnswerOption
              key={index}
              content={answer.text}
              isSelected={selectedAnswers.includes(index)}
              isCorrect={answer.isCorrect}
              isSubmitted={submitted}
              onClick={() => handleSelection(index)}
              showRadio={isSingleChoice}
              maxLines={2}
            />
          ))}
        </div>
      </div>
      
      {/* Action button - fixed at bottom */}
      <div className="flex-shrink-0 pt-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswers.length === 0}
            className={`py-3 rounded-lg w-full font-medium transition-colors ${
              selectedAnswers.length > 0
                ? 'bg-loklernen-ultramarine text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            Antwort prüfen
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="py-3 bg-loklernen-ultramarine text-white rounded-lg w-full font-medium hover:bg-blue-700 transition-colors"
          >
            Weiter
          </button>
        )}
      </div>
    </div>
  );
}
