
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BasicInfoTab } from '../BasicInfoTab';
import { ContentTab } from '../ContentTab';
import { AnswersTab } from '../AnswersTab';
import { QuestionCategory, RegulationCategory, QuestionType, Answer } from '@/types/questions';
import { StructuredContent } from '@/types/rich-text';

interface SinglePageEditorProps {
  category: QuestionCategory;
  subCategory: string;
  difficulty: number;
  text: string | StructuredContent;
  hint?: string | StructuredContent | null;
  isSignalQuestion: boolean;
  regulationCategory?: RegulationCategory;
  imagePreview: string | null;
  answers: Answer[];
  questionType: QuestionType;
  onCategoryChange: (category: QuestionCategory) => void;
  onSubCategoryChange: (subCategory: string) => void;
  onDifficultyChange: (difficulty: number) => void;
  onQuestionTypeChange: (type: QuestionType) => void;
  onRegulationCategoryChange?: (regulationCategory: RegulationCategory) => void;
  onTextChange: (value: string | StructuredContent) => void;
  onHintChange?: (value: string | StructuredContent) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePastedImage?: (file: File) => void;
  removeImage: () => void;
  handleAnswerChange: (index: number, value: string | StructuredContent) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
  addAnswer: () => void;
}

export const SinglePageEditor: React.FC<SinglePageEditorProps> = ({
  category,
  subCategory,
  difficulty,
  text,
  hint,
  isSignalQuestion,
  regulationCategory,
  imagePreview,
  answers,
  questionType,
  onCategoryChange,
  onSubCategoryChange,
  onDifficultyChange,
  onQuestionTypeChange,
  onRegulationCategoryChange,
  onTextChange,
  onHintChange,
  onImageChange,
  handlePastedImage,
  removeImage,
  handleAnswerChange,
  toggleAnswerCorrectness,
  removeAnswer,
  addAnswer
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-2">Grunddaten</h2>
      <Card>
        <CardContent className="pt-6">
          <BasicInfoTab
            category={category}
            subCategory={subCategory}
            difficulty={difficulty}
            questionType={questionType}
            isSignalQuestion={isSignalQuestion}
            regulationCategory={regulationCategory}
            onCategoryChange={onCategoryChange}
            onSubCategoryChange={onSubCategoryChange}
            onDifficultyChange={onDifficultyChange}
            onQuestionTypeChange={onQuestionTypeChange}
            onRegulationCategoryChange={onRegulationCategoryChange}
          />
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mb-2 mt-8">Inhalt</h2>
      <Card>
        <CardContent className="pt-6">
          <ContentTab
            text={text}
            hint={hint}
            imagePreview={imagePreview}
            onTextChange={onTextChange}
            onHintChange={onHintChange}
            onImageChange={onImageChange}
            handlePastedImage={handlePastedImage}
            removeImage={removeImage}
          />
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mb-2 mt-8">Antworten</h2>
      <Card>
        <CardContent className="pt-6">
          <AnswersTab
            answers={answers}
            questionType={questionType}
            isSignalQuestion={isSignalQuestion}
            handleAnswerChange={handleAnswerChange}
            toggleAnswerCorrectness={toggleAnswerCorrectness}
            removeAnswer={removeAnswer}
            addAnswer={addAnswer}
          />
        </CardContent>
      </Card>
    </div>
  );
};
