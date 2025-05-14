
import React from "react";
import { Question } from "@/types/questions";
import FlashcardActionButton from "../FlashcardActionButton";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import ZoomableImage from "@/components/common/ZoomableImage";
import MultipleChoiceQuestion from "../MultipleChoiceQuestion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";

interface AnswerSideProps {
  question: Question;
  answered: boolean;
  onKnown: () => void;
  onNotKnown: () => void;
  isCleanMode?: boolean;
}

export default function AnswerSide({ 
  question, 
  answered,
  onKnown, 
  onNotKnown,
  isCleanMode = false
}: AnswerSideProps) {
  // Check if this is a multiple choice question
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // For multiple choice questions, use the new component
  if (isMultipleChoice) {
    // Determine container padding based on clean mode
    const containerPadding = isCleanMode ? "p-3" : "p-4";
    
    return (
      <div className={`flex flex-col h-full bg-white ${containerPadding}`}>
        {!isCleanMode && (
          <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-2">
            Wähle die richtige Antwort
          </div>
        )}
        
        <ScrollArea className="flex-1 pr-2">
          <MultipleChoiceQuestion
            question={question}
            onAnswer={(isCorrect) => isCorrect ? onKnown() : onNotKnown()}
            isMobile={true}
            isCleanMode={isCleanMode}
          />
        </ScrollArea>
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
  
  // Determine container padding based on clean mode
  const containerPadding = isCleanMode ? "p-3" : "p-4";
  
  return (
    <div className={`flex flex-col h-full bg-white ${containerPadding}`}>
      {!isCleanMode && (
        <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-2">
          Antwort
        </div>
      )}
      
      {/* Scrollable content area with improved ScrollArea component */}
      <ScrollArea className="flex-1 pr-2 pb-16">
        {/* Answer content with clear text */}
        <div className={`bg-blue-50 ${isCleanMode ? 'p-3' : 'p-4'} rounded-xl w-full shadow-sm border border-blue-100 mb-4`}>
          <div className={`${textSizeClass} font-bold text-blue-800`}>
            <SafeRichText content={answerText} />
          </div>
        </div>
        
        {/* Image container with ZoomableImage */}
        {question?.image_url && (
          <ZoomableImage
            src={question.image_url}
            alt="Signal"
            containerClassName={`w-full ${isCleanMode ? 'max-w-[180px]' : 'max-w-[200px]'} mx-auto mb-4`}
          />
        )}
      </ScrollArea>
      
      {/* Floating action buttons with fixed positioning - only for open questions */}
      {!answered && (
        <div className="absolute left-0 right-0 bottom-4 flex justify-center items-center z-10 bg-white bg-opacity-80 py-2">
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
