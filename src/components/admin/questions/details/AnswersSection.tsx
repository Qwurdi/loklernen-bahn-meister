
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { SignalAnswerInput } from "../../SignalAnswerInput";
import { Answer, QuestionType } from '@/types/questions';

interface AnswersSectionProps {
  questionType: QuestionType;
  answers: Answer[];
  isSignalQuestion: boolean;
  handleAnswerChange: (index: number, value: string) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
  addAnswer: () => void;
}

export const AnswersSection: React.FC<AnswersSectionProps> = ({
  questionType,
  answers,
  isSignalQuestion,
  handleAnswerChange,
  toggleAnswerCorrectness,
  removeAnswer,
  addAnswer
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Antworten</Label>
        {!isSignalQuestion && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAnswer}
          >
            <Plus className="mr-2 h-4 w-4" />
            Antwort hinzufügen
          </Button>
        )}
      </div>
      
      {questionType === "open" && isSignalQuestion ? (
        <SignalAnswerInput
          value={answers?.[0]?.text || ""}
          onChange={(text) => handleAnswerChange(0, text)}
        />
      ) : (
        <div className="space-y-3">
          {answers?.map((answer, index) => (
            <div key={index} className="flex items-start gap-2 rounded-md border border-gray-200 p-2">
              <Button
                type="button"
                size="icon"
                variant={answer.isCorrect ? "default" : "outline"}
                className="mt-1 h-6 w-6 shrink-0"
                onClick={() => toggleAnswerCorrectness(index)}
              >
                {answer.isCorrect && <span>✓</span>}
              </Button>
              <Textarea
                placeholder={`Antwort ${index + 1}`}
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="flex-1 min-h-[60px]"
              />
              {answers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-1 h-6 w-6 shrink-0"
                  onClick={() => removeAnswer(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
