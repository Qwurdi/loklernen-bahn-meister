
import React from 'react';
import { AnswerItem } from './AnswerItem';
import { Answer, QuestionType } from '@/types/questions';

interface MultipleChoiceAnswersProps {
  answers: Answer[];
  questionType: QuestionType;
  handleAnswerChange: (index: number, value: string) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
}

export const MultipleChoiceAnswers: React.FC<MultipleChoiceAnswersProps> = ({
  answers,
  questionType,
  handleAnswerChange,
  toggleAnswerCorrectness,
  removeAnswer
}) => {
  return (
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
  );
};
