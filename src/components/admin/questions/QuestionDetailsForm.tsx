
import React from 'react';
import { QuestionText } from './details/QuestionText';
import { ImageSelector } from './details/ImageSelector';
import { DifficultySelector } from './details/DifficultySelector';
import { AnswersSection } from './details/AnswersSection';
import { RegulationCategorySelector } from "./RegulationCategorySelector";
import { Answer, QuestionType, RegulationCategory } from '@/types/questions';

interface QuestionDetailsFormProps {
  text: string;
  imagePreview: string | null;
  questionType: QuestionType;
  answers: Answer[];
  isSignalQuestion: boolean;
  difficulty: number;
  regulationCategory?: RegulationCategory;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  handleAnswerChange: (index: number, value: string) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
  addAnswer: () => void;
  onDifficultyChange: (value: number) => void;
  onRegulationCategoryChange?: (value: RegulationCategory) => void;
}

export const QuestionDetailsForm = ({
  text,
  imagePreview,
  questionType,
  answers,
  isSignalQuestion,
  difficulty,
  regulationCategory = "both",
  onTextChange,
  onImageChange,
  removeImage,
  handleAnswerChange,
  toggleAnswerCorrectness,
  removeAnswer,
  addAnswer,
  onDifficultyChange,
  onRegulationCategoryChange
}: QuestionDetailsFormProps) => {
  return (
    <div className="space-y-6">
      <QuestionText 
        text={text}
        onTextChange={onTextChange}
      />
      
      <ImageSelector
        imagePreview={imagePreview}
        onImageChange={onImageChange}
        removeImage={removeImage}
      />

      {isSignalQuestion && onRegulationCategoryChange && (
        <RegulationCategorySelector 
          value={regulationCategory}
          onChange={onRegulationCategoryChange}
        />
      )}

      <DifficultySelector
        difficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
      />

      <AnswersSection
        questionType={questionType}
        answers={answers}
        isSignalQuestion={isSignalQuestion}
        handleAnswerChange={handleAnswerChange}
        toggleAnswerCorrectness={toggleAnswerCorrectness}
        removeAnswer={removeAnswer}
        addAnswer={addAnswer}
      />
    </div>
  );
};
