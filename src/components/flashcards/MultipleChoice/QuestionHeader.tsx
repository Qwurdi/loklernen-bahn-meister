
import React from "react";
import { Question } from "@/types/questions";
import { useDynamicTextSize } from "@/hooks/useDynamicTextSize";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";
import HintButton from "../HintButton";

interface QuestionHeaderProps {
  question: Question;
  submitted: boolean;
  isMobile: boolean;
}

export default function QuestionHeader({ question, submitted, isMobile }: QuestionHeaderProps) {
  const textSizeClass = useDynamicTextSize(
    question.text,
    'question'
  );
  
  return (
    <>
      <div className={`${textSizeClass} mb-4 font-medium`}>
        <SafeRichText content={question.text} />
      </div>
      
      {/* Hint button - no longer auto shows, only on request */}
      {!submitted && (
        <div className="mb-4">
          <HintButton 
            hint={question.hint}
            question={question.text}
            answers={question.answers}
          />
        </div>
      )}
    </>
  );
}
