
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { useQuestionForm } from "@/hooks/useQuestionForm";
import { QuestionEditorHeader } from "@/components/admin/questions/QuestionEditorHeader";
import { QuestionCategorySelector } from "@/components/admin/questions/QuestionCategorySelector";
import { QuestionSubCategorySelector } from "@/components/admin/questions/QuestionSubCategorySelector";
import { QuestionDetailsForm } from "@/components/admin/questions/QuestionDetailsForm";
import { QuestionPreview } from "@/components/admin/questions/QuestionPreview";

const QuestionEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: questions } = useQuestions();
  
  const {
    isEditMode,
    isLoading,
    formData,
    imagePreview,
    handleInputChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleDifficultyChange,
    handleAnswerChange,
    handleImageChange,
    removeImage,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer,
    handleSubmit
  } = useQuestionForm({ id });
  
  useEffect(() => {
    if (isEditMode && id && questions) {
      const questionToEdit = questions.find(q => q.id === id);
      if (questionToEdit) {
        // Initial data will be handled by the hook
      }
    }
  }, [isEditMode, id, questions]);

  const isSignalQuestion = formData.category === "Signale";

  return (
    <div className="space-y-6">
      <QuestionEditorHeader 
        isEditMode={isEditMode} 
        isLoading={isLoading} 
        onSave={handleSubmit} 
      />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <QuestionCategorySelector
              category={formData.category}
              onCategoryChange={handleCategoryChange}
            />

            <QuestionSubCategorySelector
              category={formData.category}
              subCategory={formData.sub_category || ""}
              onSubCategoryChange={handleSubCategoryChange}
            />

            <QuestionDetailsForm
              text={formData.text || ""}
              imagePreview={imagePreview}
              questionType={formData.question_type}
              answers={formData.answers || []}
              isSignalQuestion={isSignalQuestion}
              onTextChange={handleInputChange}
              onImageChange={handleImageChange}
              removeImage={removeImage}
              handleAnswerChange={handleAnswerChange}
              toggleAnswerCorrectness={toggleAnswerCorrectness}
              removeAnswer={removeAnswer}
              addAnswer={addAnswer}
            />
          </div>
          
          <QuestionPreview
            text={formData.text || ""}
            imagePreview={imagePreview}
            answers={formData.answers || []}
            category={formData.category || ""}
            sub_category={formData.sub_category || ""}
            difficulty={formData.difficulty || 1}
          />
        </div>
      </form>
    </div>
  );
};

export default QuestionEditorPage;
