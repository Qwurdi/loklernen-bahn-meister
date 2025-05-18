
import React from 'react';
import { Question } from "@/types/questions";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";
import MobileMultipleChoice from './MobileMultipleChoice';
import MobileActionButtons from './MobileActionButtons';

interface MobileAnswerSideProps {
  question: Question;
  answered: boolean;
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function MobileAnswerSide({ 
  question, 
  answered,
  onKnown, 
  onNotKnown 
}: MobileAnswerSideProps) {
  // Check if this is a multiple choice question
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // For multiple choice questions, use the optimized component
  if (isMultipleChoice) {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-2">
          Wähle die richtige Antwort
        </div>
        
        <div className="flex-1 overflow-hidden">
          <MobileMultipleChoice
            question={question}
            onAnswer={(isCorrect) => isCorrect ? onKnown() : onNotKnown()}
          />
        </div>
      </div>
    );
  }
  
  // Get the correct answer text
  const answerText = question?.answers?.[0]?.text || '';
  
  // Use dynamic text sizing based on answer length
  const textSizeClass = useDynamicTextSize(
    typeof answerText === 'string' ? answerText : 'medium',
    'answer'
  );
  
  return (
    <div className="h-full flex flex-col p-4">
      <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-2">
        Antwort
      </div>
      
      {/* Answer content - optimized for no scrolling */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-blue-50 p-3 rounded-lg w-full mb-4 max-h-[40%] overflow-hidden">
          <div className={`${textSizeClass} font-bold text-blue-800`}>
            <SafeRichText content={answerText} />
          </div>
        </div>
        
        {/* Image - dynamically sized */}
        {question?.image_url && (
          <div className="flex-1 max-h-[40%] w-full flex items-center justify-center">
            <img
              src={question.image_url}
              alt="Signal"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>
      
      {/* Action buttons - fixed at bottom */}
      {!answered && (
        <MobileActionButtons onKnown={onKnown} onNotKnown={onNotKnown} />
      )}
    </div>
  );
}
