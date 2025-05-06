
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AnswerPreview } from './AnswerPreview';
import { Answer, QuestionType } from '@/types/questions';

interface AnswerPreviewSectionProps {
  answers: Answer[];
  questionType: QuestionType;
}

export const AnswerPreviewSection: React.FC<AnswerPreviewSectionProps> = ({
  answers,
  questionType
}) => {
  return (
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
  );
};
