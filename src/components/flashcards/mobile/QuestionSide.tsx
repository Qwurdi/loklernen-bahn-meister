
import React from "react";
import { Question } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import ZoomableImage from "@/components/common/ZoomableImage";
import HintButton from "../HintButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";

interface QuestionSideProps {
  question: Question;
  onShowAnswer: () => void;
  isCleanMode?: boolean;
}

export default function QuestionSide({ 
  question, 
  onShowAnswer,
  isCleanMode = false
}: QuestionSideProps) {
  // Check if this is a multiple choice question
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Use dynamic text sizing based on question length
  const textSizeClass = useDynamicTextSize(
    typeof question?.text === 'string' ? question.text : 'medium',
    'question'
  );
  
  // Determine padding based on clean mode
  const containerPadding = isCleanMode ? "p-3" : "p-4";
  const questionType = question.question_type === "open" ? "Signal" : "Multiple Choice";
  
  return (
    <div className={`flex flex-col h-full bg-white ${containerPadding}`}>
      {!isCleanMode && (
        <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-2">
          {questionType}
        </div>
      )}
      
      <ScrollArea className="flex-1 pr-2">
        {/* Question text placed for maximum visibility */}
        <div className={`${textSizeClass} font-medium ${isCleanMode ? 'mb-2' : 'mb-3'} text-gray-900`}>
          <SafeRichText content={question.text} />
        </div>
        
        {/* Add the hint button - compact in clean mode */}
        <div className={isCleanMode ? "mb-2 -mt-1" : "mb-3"}>
          <HintButton 
            hint={question.hint}
            question={question.text}
            answers={question.answers}
          />
        </div>
        
        {/* Image container with ZoomableImage */}
        {question?.image_url && (
          <div className="flex items-center justify-center mb-3">
            <ZoomableImage
              src={question.image_url}
              alt="Signal"
              containerClassName={`w-full ${isCleanMode ? 'max-w-[180px]' : 'max-w-[200px]'} mx-auto`}
            />
          </div>
        )}
      </ScrollArea>
      
      {/* Floating action button for showing answer */}
      <Button 
        className={`w-full mt-2 bg-loklernen-ultramarine text-white hover:bg-loklernen-sapphire ${
          isCleanMode ? 'py-3' : 'py-6'
        }`}
        onClick={onShowAnswer}
      >
        <Lightbulb className="h-5 w-5 mr-2" />
        {isMultipleChoice ? "Antwortoptionen anzeigen" : "Signal anzeigen"}
      </Button>
    </div>
  );
}
