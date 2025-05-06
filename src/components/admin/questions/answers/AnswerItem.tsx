
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, X } from "lucide-react";
import { Answer, QuestionType } from '@/types/questions';

interface AnswerItemProps {
  index: number;
  answer: Answer;
  handleAnswerChange: (index: number, value: string) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
  showDeleteButton: boolean;
  questionType: QuestionType;
}

export const AnswerItem: React.FC<AnswerItemProps> = ({
  index,
  answer,
  handleAnswerChange,
  toggleAnswerCorrectness,
  removeAnswer,
  showDeleteButton,
  questionType
}) => {
  return (
    <div className="flex items-start gap-2 rounded-md border bg-card p-3 hover:border-gray-300 transition-colors">
      <div className="mt-1 flex items-center gap-2">
        <GripVertical className="h-5 w-5 text-gray-400" />
        <div className="flex items-center h-6">
          {questionType === "MC_single" ? (
            <div 
              className={`h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer ${answer.isCorrect ? 'border-loklernen-ultramarine bg-loklernen-ultramarine/10' : ''}`}
              onClick={() => toggleAnswerCorrectness(index)}
            >
              {answer.isCorrect && (
                <div className="h-3 w-3 rounded-full bg-loklernen-ultramarine" />
              )}
            </div>
          ) : (
            <Checkbox 
              checked={answer.isCorrect} 
              onCheckedChange={() => toggleAnswerCorrectness(index)} 
              className="h-5 w-5"
            />
          )}
        </div>
      </div>
      
      <Textarea
        value={answer.text}
        onChange={(e) => handleAnswerChange(index, e.target.value)}
        placeholder={`Antwortoption ${index + 1}`}
        className="flex-1 min-h-[60px]"
      />
      
      {showDeleteButton && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeAnswer(index)}
          className="mt-1 h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
