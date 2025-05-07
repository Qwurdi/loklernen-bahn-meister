
import React from 'react';
import { Answer, QuestionType } from '@/types/questions';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';
import { getTextValue } from '@/types/rich-text';

interface AnswerPreviewProps {
  answer: Answer;
  questionType: QuestionType;
}

export const AnswerPreview: React.FC<AnswerPreviewProps> = ({ 
  answer, 
  questionType 
}) => {
  const textSize = useDynamicTextSize(getTextValue(answer.text), 'answer');
  
  return (
    <div 
      className={`rounded-md p-3 cursor-pointer ${
        answer.isCorrect 
        ? "bg-green-100 border border-green-200" 
        : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        {questionType === "MC_single" ? (
          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
            answer.isCorrect ? "border-green-500" : "border-gray-300"
          }`}>
            {answer.isCorrect && <div className="h-2 w-2 rounded-full bg-green-500" />}
          </div>
        ) : (
          <div className={`h-4 w-4 rounded border flex items-center justify-center ${
            answer.isCorrect ? "border-green-500 bg-green-500/10" : "border-gray-300"
          }`}>
            {answer.isCorrect && <div className="h-2 w-2 rounded-sm bg-green-500" />}
          </div>
        )}
        <span className={textSize}>
          <SafeRichText content={answer.text || "Leere Antwort"} />
        </span>
      </div>
    </div>
  );
};
