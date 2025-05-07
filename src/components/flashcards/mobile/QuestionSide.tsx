
import React from "react";
import { Question } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import ZoomableImage from "@/components/common/ZoomableImage";

interface QuestionSideProps {
  question: Question;
  onShowAnswer: () => void;
}

export default function QuestionSide({ question, onShowAnswer }: QuestionSideProps) {
  // Check if this is a multiple choice question
  const isMultipleChoice = question.question_type === "MC_single" || question.question_type === "MC_multi";
  
  // Use dynamic text sizing based on question length
  const textSizeClass = useDynamicTextSize(question?.text || '', 'question');
  
  return (
    <div className="flex flex-col h-full p-4 bg-white">
      <div className="bg-blue-50 px-3 py-1.5 rounded-full text-xs text-blue-600 self-start mb-3">
        {question.question_type === "open" ? "Signal" : "Multiple Choice"}
      </div>
      
      {/* Question text moved above image for visibility */}
      <h2 className={`${textSizeClass} font-medium mb-4 text-gray-900`}>
        {question?.text}
      </h2>
      
      {/* Image container with ZoomableImage */}
      <div className="flex-1 flex items-center justify-center mb-4">
        {question?.image_url && (
          <ZoomableImage
            src={question.image_url}
            alt="Signal"
            containerClassName="w-full max-w-[200px] mx-auto"
          />
        )}
      </div>
      
      <Button 
        className="w-full py-6 mt-auto bg-loklernen-ultramarine text-white hover:bg-loklernen-sapphire"
        onClick={onShowAnswer}
      >
        <Lightbulb className="h-5 w-5 mr-2" />
        {isMultipleChoice ? "Antwortoptionen anzeigen" : "Signal anzeigen"}
      </Button>
    </div>
  );
}
