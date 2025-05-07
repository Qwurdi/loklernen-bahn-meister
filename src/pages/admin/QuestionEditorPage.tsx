
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { useQuestionForm } from "@/hooks/useQuestionForm";
import { QuestionFormHeader } from "@/components/admin/questions/QuestionFormHeader";
import { PreviewModal } from "@/components/admin/questions/PreviewModal";
import { useAutoSave } from "@/hooks/questions/useAutoSave";
import { toast } from "sonner";
import { FormErrors } from "@/components/admin/questions/editor/FormErrors";
import { AutoSaveIndicator } from "@/components/admin/questions/editor/AutoSaveIndicator";
import { DraftDialog } from "@/components/admin/questions/editor/DraftDialog";
import { NavigationWarning } from "@/components/admin/questions/editor/NavigationWarning";
import { QuestionEditor } from "@/components/admin/questions/editor/QuestionEditor";

const QuestionEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: questions } = useQuestions();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const navigate = useNavigate();
  
  const {
    isEditMode,
    isLoading,
    formData,
    imagePreview,
    handleInputChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleDifficultyChange,
    handleRegulationCategoryChange,
    handleQuestionTypeChange,
    handleAnswerChange,
    handleImageChange,
    handlePastedImage,
    removeImage,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer,
    handleSubmit,
    handleDuplicate,
    setFormData,
    errors
  } = useQuestionForm({ id });
  
  const { lastSaved, isDirty, loadDraft, clearDraft } = useAutoSave({
    formData,
    isEditMode
  });

  // Handle rich text changes
  const handleRichTextChange = (value: string) => {
    setFormData(prev => ({ ...prev, text: value }));
  };

  // Load draft on initial load if available
  useEffect(() => {
    try {
      const draft = loadDraft();
      if (draft && !isEditMode) {
        setDraftData(draft);
        setShowDraftDialog(true);
      }
    } catch (error) {
      console.error("Error checking for draft:", error);
    }
  }, [loadDraft, isEditMode]);

  const isSignalQuestion = formData.category === "Signale";

  const handleLoadDraft = () => {
    if (draftData) {
      setFormData(draftData.formData);
    }
    setShowDraftDialog(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftDialog(false);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("Sie haben ungespeicherte Änderungen. Sind Sie sicher, dass Sie abbrechen möchten?")) {
        navigate("/admin/questions");
      }
    } else {
      navigate("/admin/questions");
    }
  };

  const handleToggleAnswerCorrectness = (index: number) => {
    toggleAnswerCorrectness(index, formData.question_type!);
  };

  return (
    <div className="container pb-10">
      <NavigationWarning isDirty={isDirty} />
      
      <QuestionFormHeader 
        isEditMode={isEditMode} 
        isLoading={isLoading} 
        onSave={handleSubmit}
        onPreview={() => setShowPreviewModal(true)}
        showDuplicateButton={isEditMode}
        onDuplicate={handleDuplicate}
        onCancel={handleCancel}
      />
      
      <FormErrors errors={errors} />
      
      <AutoSaveIndicator 
        lastSaved={lastSaved} 
        isDirty={isDirty}
        onSave={handleSubmit}
        isLoading={isLoading}
      />

      <form onSubmit={handleSubmit}>
        <QuestionEditor 
          category={formData.category!}
          subCategory={formData.sub_category || ""}
          difficulty={formData.difficulty || 1}
          text={formData.text || ""}
          isSignalQuestion={isSignalQuestion}
          regulationCategory={formData.regulation_category}
          imagePreview={imagePreview}
          answers={formData.answers || []}
          questionType={formData.question_type!}
          onCategoryChange={handleCategoryChange}
          onSubCategoryChange={handleSubCategoryChange}
          onDifficultyChange={handleDifficultyChange}
          onQuestionTypeChange={handleQuestionTypeChange}
          onRegulationCategoryChange={handleRegulationCategoryChange}
          onTextChange={handleRichTextChange}
          onImageChange={handleImageChange}
          handlePastedImage={handlePastedImage}
          removeImage={removeImage}
          handleAnswerChange={handleAnswerChange}
          toggleAnswerCorrectness={handleToggleAnswerCorrectness}
          removeAnswer={removeAnswer}
          addAnswer={addAnswer}
        />
      </form>
      
      <PreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        question={formData}
      />
      
      <DraftDialog 
        open={showDraftDialog}
        onOpenChange={setShowDraftDialog}
        draftData={draftData}
        onLoadDraft={handleLoadDraft}
        onDiscardDraft={handleDiscardDraft}
      />
    </div>
  );
};

export default QuestionEditorPage;
