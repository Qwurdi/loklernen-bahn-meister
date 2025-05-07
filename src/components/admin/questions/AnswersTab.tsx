
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SignalQuestionAnswer } from './answers/SignalQuestionAnswer';
import { MultipleChoiceAnswers } from './answers/MultipleChoiceAnswers';
import { AnswerPreviewSection } from './answers/AnswerPreviewSection';
import { Answer, QuestionType } from '@/types/questions';
import { StructuredContent } from '@/types/rich-text';

interface AnswersTabProps {
  answers: Answer[];
  questionType: QuestionType;
  isSignalQuestion: boolean;
  handleAnswerChange: (index: number, value: string | StructuredContent) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
  addAnswer: () => void;
}

export const AnswersTab: React.FC<AnswersTabProps> = ({
  answers,
  questionType,
  isSignalQuestion,
  handleAnswerChange,
  toggleAnswerCorrectness,
  removeAnswer,
  addAnswer
}) => {
  // Handler for signal question answer changes
  const handleSignalAnswerChange = (text: string | StructuredContent) => {
    handleAnswerChange(0, text);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Antwortoptionen</h3>
              {!isSignalQuestion && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAnswer}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Antwort hinzufügen
                </Button>
              )}
            </div>
            
            {questionType === "open" && isSignalQuestion ? (
              <SignalQuestionAnswer
                answerText={answers?.[0]?.text || ""}
                onAnswerChange={handleSignalAnswerChange}
              />
            ) : (
              <MultipleChoiceAnswers
                answers={answers}
                questionType={questionType}
                handleAnswerChange={handleAnswerChange}
                toggleAnswerCorrectness={toggleAnswerCorrectness}
                removeAnswer={removeAnswer}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {!isSignalQuestion && (
        <AnswerPreviewSection
          answers={answers}
          questionType={questionType}
        />
      )}
    </div>
  );
};
