
import React from 'react';
import { Question } from "@/types/questions";
import { Lightbulb } from "lucide-react";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import ZoomableImage from "@/components/common/ZoomableImage";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";
import HintButton from "../HintButton";

interface MobileQuestionSideProps {
  question: Question;
  onShowAnswer: () => void;
}

export default function MobileQuestionSide({ question, onShowAnswer }: MobileQuestionSideProps) {
  // Check if this is a multiple choice question
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Use dynamic text sizing based on content length
  const textSizeClass = useDynamicTextSize(
    question.text,
    'question'
  );
  
  return (
    <div className="flex flex-col h-full p-4">
      {/* Category tag */}
      <div className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-600 self-start mb-2">
        {question.question_type === "open" ? "Signal" : "Multiple Choice"}
      </div>
      
      {/* Question text - prioritize display */}
      <div className={`${textSizeClass} font-medium mb-3 text-gray-900 max-h-[30%] overflow-auto`}>
        <SafeRichText content={question.text} />
      </div>
      
      {/* Image container - dynamic sizing */}
      <div className="flex-1 flex items-center justify-center mb-2 overflow-hidden">
        {question?.image_url && (
          <ZoomableImage
            src={question.image_url}
            alt="Signal"
            containerClassName="w-full h-full flex items-center justify-center"
            imageClassName="max-h-full max-w-full object-contain"
          />
        )}
      </div>
      
      {/* Compact hint button */}
      <div className="mb-2">
        <HintButton 
          hint={question.hint}
          question={question.text}
          answers={question.answers}
          minimal={true}
        />
      </div>
      
      {/* Tap to flip hint */}
      <p className="text-center text-sm text-gray-500 mb-2">
        Tippe auf die Karte oder den Button, um die Antwort zu sehen
      </p>
      
      {/* Answer button - stick to bottom */}
      <button 
        className="w-full py-3 bg-gradient-to-r from-loklernen-ultramarine to-blue-600 text-white rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-98"
        onClick={onShowAnswer}
      >
        <Lightbulb className="h-4 w-4 mr-2" />
        {isMultipleChoice ? "Optionen anzeigen" : "Signal anzeigen"}
      </button>
    </div>
  );
}
