
import React from "react";
import { Question } from "@/types/questions";
import FlashcardActionButton from "../FlashcardActionButton";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import ZoomableImage from "@/components/common/ZoomableImage";
import MultipleChoiceQuestion from "../MultipleChoiceQuestion";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";

interface AnswerSideProps {
  question: Question;
  answered: boolean;
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function AnswerSide({ 
  question, 
  answered,
  onKnown, 
  onNotKnown 
}: AnswerSideProps) {
  // Check if this is a multiple choice question
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // For multiple choice questions, use the new component
  if (isMultipleChoice) {
    return (
      <div className="flex flex-col h-full p-4 bg-white">
        <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-3">
          Wähle die richtige Antwort
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <MultipleChoiceQuestion
            question={question}
            onAnswer={(isCorrect) => isCorrect ? onKnown() : onNotKnown()}
            isMobile={true}
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
    <div className="flex flex-col h-full p-4 bg-white">
      <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-3">Antwort</div>
      
      {/* Scrollable content area with padding at bottom to ensure visibility of buttons */}
      <div className="flex-1 flex flex-col overflow-y-auto pb-24">
        {/* Answer content with clear text */}
        <div className="bg-blue-50 p-4 rounded-xl w-full shadow-sm border border-blue-100 mb-6">
          <div className={`${textSizeClass} font-bold text-blue-800`}>
            <SafeRichText content={answerText} />
          </div>
        </div>
        
        {/* Image container with ZoomableImage */}
        {question?.image_url && (
          <ZoomableImage
            src={question.image_url}
            alt="Signal"
            containerClassName="w-full max-w-[200px] mx-auto mb-6"
          />
        )}
      </div>
      
      {/* Floating action buttons with fixed positioning - only for open questions */}
      {!answered && (
        <div className="absolute left-0 right-0 bottom-4 flex justify-center items-center">
          <div className="flex justify-center items-center space-x-6">
            <FlashcardActionButton
              variant="unknown"
              onClick={onNotKnown}
              isMobile={true}
            />
            <FlashcardActionButton
              variant="known"
              onClick={onKnown}
              isMobile={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
