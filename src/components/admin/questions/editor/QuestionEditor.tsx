
import React from 'react';
import { EditorTabs } from '../EditorTabs';
import { BasicInfoTab } from '../BasicInfoTab';
import { ContentTab } from '../ContentTab';
import { AnswersTab } from '../AnswersTab';
import { SinglePageEditor } from './SinglePageEditor';
import { EditorViewToggle } from './EditorViewToggle';
import { Answer, QuestionCategory, RegulationCategory, QuestionType } from '@/types/questions';
import { StructuredContent } from '@/types/rich-text'; 
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface QuestionEditorProps {
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

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
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
  const { editorViewPreference, setEditorViewPreference } = useUserPreferences();
  
  const handleViewChange = (view: 'tabs' | 'single') => {
    setEditorViewPreference(view);
  };

  return (
    <div>
      <EditorViewToggle view={editorViewPreference} onChange={handleViewChange} />

      {editorViewPreference === 'tabs' ? (
        <EditorTabs>
          <EditorTabs.Content value="basics" title="Grunddaten" icon="Settings">
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
          </EditorTabs.Content>
          
          <EditorTabs.Content value="content" title="Inhalt" icon="FileText">
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
          </EditorTabs.Content>
          
          <EditorTabs.Content value="answers" title="Antworten" icon="ListChecks">
            <AnswersTab
              answers={answers}
              questionType={questionType}
              isSignalQuestion={isSignalQuestion}
              handleAnswerChange={handleAnswerChange}
              toggleAnswerCorrectness={toggleAnswerCorrectness}
              removeAnswer={removeAnswer}
              addAnswer={addAnswer}
            />
          </EditorTabs.Content>
        </EditorTabs>
      ) : (
        <SinglePageEditor
          category={category}
          subCategory={subCategory}
          difficulty={difficulty}
          text={text}
          hint={hint}
          isSignalQuestion={isSignalQuestion}
          regulationCategory={regulationCategory}
          imagePreview={imagePreview}
          answers={answers}
          questionType={questionType}
          onCategoryChange={onCategoryChange}
          onSubCategoryChange={onSubCategoryChange}
          onDifficultyChange={onDifficultyChange}
          onQuestionTypeChange={onQuestionTypeChange}
          onRegulationCategoryChange={onRegulationCategoryChange}
          onTextChange={onTextChange}
          onHintChange={onHintChange}
          onImageChange={onImageChange}
          handlePastedImage={handlePastedImage}
          removeImage={removeImage}
          handleAnswerChange={handleAnswerChange}
          toggleAnswerCorrectness={toggleAnswerCorrectness}
          removeAnswer={removeAnswer}
          addAnswer={addAnswer}
        />
      )}
    </div>
  );
};
