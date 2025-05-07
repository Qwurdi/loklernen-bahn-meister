
import React from 'react';
import { BasicInfoTab } from "@/components/admin/questions/BasicInfoTab";
import { ContentTab } from "@/components/admin/questions/ContentTab";
import { AnswersTab } from "@/components/admin/questions/AnswersTab";
import { EditorTabContent } from "@/components/admin/questions/EditorTabs";
import { QuestionCategory, RegulationCategory, QuestionType } from '@/types/questions';

interface TabContentProps {
  activeTab: string;
  category: QuestionCategory;
  subCategory: string;
  difficulty: number;
  text: string;
  isSignalQuestion: boolean;
  regulationCategory?: RegulationCategory;
  imagePreview: string | null;
  answers: any[];
  questionType: QuestionType;
  onCategoryChange: (category: QuestionCategory) => void;
  onSubCategoryChange: (subCategory: string) => void;
  onDifficultyChange: (difficulty: number) => void;
  onRegulationCategoryChange: (regulationCategory: RegulationCategory) => void;
  onTextChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePastedImage?: (file: File) => void;
  removeImage: () => void;
  handleAnswerChange: (index: number, value: string) => void;
  toggleAnswerCorrectness: (index: number) => void;
  removeAnswer: (index: number) => void;
  addAnswer: () => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  category,
  subCategory,
  difficulty,
  text,
  isSignalQuestion,
  regulationCategory = 'both',
  imagePreview,
  answers,
  questionType,
  onCategoryChange,
  onSubCategoryChange,
  onDifficultyChange,
  onRegulationCategoryChange,
  onTextChange,
  onImageChange,
  handlePastedImage,
  removeImage,
  handleAnswerChange,
  toggleAnswerCorrectness,
  removeAnswer,
  addAnswer
}) => {
  return (
    <>
      <EditorTabContent value="basics" className={activeTab === "basics" ? "" : "hidden"}>
        <BasicInfoTab
          category={category}
          subCategory={subCategory}
          difficulty={difficulty}
          isSignalQuestion={isSignalQuestion}
          regulationCategory={regulationCategory}
          onCategoryChange={onCategoryChange}
          onSubCategoryChange={onSubCategoryChange}
          onDifficultyChange={onDifficultyChange}
          onRegulationCategoryChange={isSignalQuestion ? onRegulationCategoryChange : undefined}
        />
      </EditorTabContent>
      
      <EditorTabContent value="content" className={activeTab === "content" ? "" : "hidden"}>
        <ContentTab
          text={text}
          imagePreview={imagePreview}
          onTextChange={onTextChange}
          onImageChange={onImageChange}
          handlePastedImage={handlePastedImage}
          removeImage={removeImage}
        />
      </EditorTabContent>
      
      <EditorTabContent value="answers" className={activeTab === "answers" ? "" : "hidden"}>
        <AnswersTab
          answers={answers}
          questionType={questionType}
          isSignalQuestion={isSignalQuestion}
          handleAnswerChange={handleAnswerChange}
          toggleAnswerCorrectness={toggleAnswerCorrectness}
          removeAnswer={removeAnswer}
          addAnswer={addAnswer}
        />
      </EditorTabContent>
    </>
  );
};
