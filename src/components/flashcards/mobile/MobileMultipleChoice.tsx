import React, { useState } from 'react';
import { Question } from "@/types/questions";
import { Check, X } from "lucide-react";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";

interface MobileMultipleChoiceProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export default function MobileMultipleChoice({ question, onAnswer }: MobileMultipleChoiceProps) {
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
    typeof question.text === 'string' ? question.text : 'medium',
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
  
  const handleSubmit = () => {
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
  
  return (
    <div className="h-full flex flex-col">
      {/* Question text - keep compact */}
      <div className={`${questionTextClass} mb-2 text-gray-900 max-h-[20%] overflow-hidden`}>
        <SafeRichText content={question.text} />
      </div>
      
      {/* Answer options - optimized for display without scrolling */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          {question.answers.map((answer, index) => (
            <button 
              key={index}
              className={`w-full mb-2 px-3 py-2 text-left rounded-lg flex items-center border ${
                submitted && answer.isCorrect
                  ? 'border-green-300 bg-green-50'
                  : submitted && selectedAnswers.includes(index) && !answer.isCorrect
                    ? 'border-red-300 bg-red-50'
                    : selectedAnswers.includes(index)
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200'
              }`}
              onClick={() => handleSelection(index)}
              disabled={submitted}
            >
              {/* Radio/checkbox indicator */}
              <div className={`mr-2 w-5 h-5 rounded-${isSingleChoice ? 'full' : 'md'} flex-shrink-0 border ${
                selectedAnswers.includes(index) 
                  ? isSingleChoice ? 'bg-blue-500 border-blue-500' : 'bg-blue-100 border-blue-500'
                  : 'border-gray-300'
              } flex items-center justify-center`}>
                {selectedAnswers.includes(index) && isSingleChoice && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
                {selectedAnswers.includes(index) && !isSingleChoice && (
                  <Check className="h-3 w-3 text-blue-500" />
                )}
              </div>
              
              {/* Answer text - compact */}
              <div className="text-sm flex-1 pr-1 truncate">
                <SafeRichText content={answer.text} />
              </div>
              
              {/* Feedback icons */}
              {submitted && answer.isCorrect && (
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              )}
              {submitted && selectedAnswers.includes(index) && !answer.isCorrect && (
                <X className="h-5 w-5 text-red-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Submit or continue button */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswers.length === 0}
          className={`py-3 rounded-lg w-full mt-2 font-medium ${
            selectedAnswers.length > 0
              ? 'bg-loklernen-ultramarine text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          Antwort prüfen
        </button>
      ) : (
        <button
          onClick={() => onAnswer(isCorrect)}
          className="py-3 bg-loklernen-ultramarine text-white rounded-lg w-full mt-2 font-medium"
        >
          Weiter
        </button>
      )}
    </div>
  );
}
