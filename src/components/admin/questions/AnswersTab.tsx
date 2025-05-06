
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, X } from "lucide-react";
import { SignalAnswerInput } from "@/components/admin/SignalAnswerInput";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Answer, QuestionType } from '@/types/questions';
import { useDynamicTextSize } from '@/hooks/useDynamicTextSize';

interface AnswersTabProps {
  answers: Answer[];
  questionType: QuestionType;
  isSignalQuestion: boolean;
  handleAnswerChange: (index: number, value: string) => void;
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
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Für Signalfragen ist nur eine korrekte Antwort möglich.
                </p>
                <SignalAnswerInput
                  value={answers?.[0]?.text || ""}
                  onChange={(text) => handleAnswerChange(0, text)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {questionType === "MC_single" 
                    ? "Bei Single-Choice-Fragen ist nur eine richtige Antwort möglich."
                    : "Bei Multiple-Choice-Fragen sind mehrere richtige Antworten möglich."}
                </p>
                
                <div className="space-y-3">
                  {answers?.map((answer, index) => (
                    <AnswerItem 
                      key={index}
                      index={index}
                      answer={answer}
                      handleAnswerChange={handleAnswerChange}
                      toggleAnswerCorrectness={toggleAnswerCorrectness}
                      removeAnswer={removeAnswer}
                      showDeleteButton={answers.length > 1}
                      questionType={questionType}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {!isSignalQuestion && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Antwortvorschau</h3>
              <div className="rounded-md bg-gray-50 p-4">
                <h4 className="mb-3 font-medium">So sehen Lernende die Antworten:</h4>
                <div className="space-y-2">
                  {answers.map((answer, index) => (
                    <AnswerPreview 
                      key={index} 
                      answer={answer}
                      questionType={questionType}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const AnswerItem: React.FC<{
  index: number;
  answer: Answer;
  handleAnswerChange: (index: number, value: string) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
  showDeleteButton: boolean;
  questionType: QuestionType;
}> = ({
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

const AnswerPreview: React.FC<{
  answer: Answer;
  questionType: QuestionType;
}> = ({ answer, questionType }) => {
  const textSize = useDynamicTextSize(answer.text, 'answer');
  
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
        <span className={textSize}>{answer.text || "Leere Antwort"}</span>
      </div>
    </div>
  );
};
