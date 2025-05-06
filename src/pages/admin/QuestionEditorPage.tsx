
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { useQuestionForm } from "@/hooks/useQuestionForm";
import { QuestionFormHeader } from "@/components/admin/questions/QuestionFormHeader";
import { EditorTabs, EditorTabContent } from "@/components/admin/questions/EditorTabs";
import { BasicInfoTab } from "@/components/admin/questions/BasicInfoTab";
import { ContentTab } from "@/components/admin/questions/ContentTab";
import { AnswersTab } from "@/components/admin/questions/AnswersTab";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PreviewModal } from "@/components/admin/questions/PreviewModal";
import { useAutoSave } from "@/hooks/questions/useAutoSave";
import { toast } from "sonner";

const QuestionEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: questions } = useQuestions();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  
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
    handleAnswerChange,
    handleImageChange,
    removeImage,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer,
    handleSubmit,
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
    const draft = loadDraft();
    if (draft && !isEditMode) {
      setDraftData(draft);
      setShowDraftDialog(true);
    }
  }, [loadDraft, isEditMode]);

  // Load existing question data
  useEffect(() => {
    if (isEditMode && id && questions) {
      const questionToEdit = questions.find(q => q.id === id);
      if (questionToEdit) {
        // Initial data will be handled by the hook
      }
    }
  }, [isEditMode, id, questions]);

  const isSignalQuestion = formData.category === "Signale";

  const handleLoadDraft = () => {
    if (draftData) {
      setFormData(draftData.formData);
      toast.success(`Entwurf vom ${new Date(draftData.timestamp).toLocaleString()} geladen`);
    }
    setShowDraftDialog(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftDialog(false);
    toast.info("Entwurf verworfen");
  };

  return (
    <div className="container pb-10">
      <QuestionFormHeader 
        isEditMode={isEditMode} 
        isLoading={isLoading} 
        onSave={handleSubmit}
        onPreview={() => setShowPreviewModal(true)}
        showDuplicateButton={isEditMode}
      />
      
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {lastSaved && (
        <div className="text-xs text-muted-foreground mb-4">
          Letzter automatischer Speicherstand: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <EditorTabs>
          <EditorTabContent value="basics">
            <BasicInfoTab
              category={formData.category!}
              subCategory={formData.sub_category || ""}
              difficulty={formData.difficulty || 1}
              isSignalQuestion={isSignalQuestion}
              regulationCategory={formData.regulation_category}
              onCategoryChange={handleCategoryChange}
              onSubCategoryChange={handleSubCategoryChange}
              onDifficultyChange={handleDifficultyChange}
              onRegulationCategoryChange={isSignalQuestion ? handleRegulationCategoryChange : undefined}
            />
          </EditorTabContent>
          
          <EditorTabContent value="content">
            <ContentTab
              text={formData.text || ""}
              imagePreview={imagePreview}
              onTextChange={handleRichTextChange}
              onImageChange={handleImageChange}
              removeImage={removeImage}
            />
          </EditorTabContent>
          
          <EditorTabContent value="answers">
            <AnswersTab
              answers={formData.answers || []}
              questionType={formData.question_type!}
              isSignalQuestion={isSignalQuestion}
              handleAnswerChange={handleAnswerChange}
              toggleAnswerCorrectness={(index) => toggleAnswerCorrectness(index, formData.question_type!)}
              removeAnswer={removeAnswer}
              addAnswer={addAnswer}
            />
          </EditorTabContent>
        </EditorTabs>
      </form>
      
      <PreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        question={formData}
      />
      
      <AlertDialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gespeicherten Entwurf gefunden</AlertDialogTitle>
            <AlertDialogDescription>
              Ein automatisch gespeicherter Entwurf vom {draftData?.timestamp ? new Date(draftData.timestamp).toLocaleString() : 'unbekannten Zeitpunkt'} wurde gefunden. Möchten Sie diesen laden oder verwerfen?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardDraft}>Verwerfen</AlertDialogCancel>
            <AlertDialogAction onClick={handleLoadDraft}>Entwurf laden</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuestionEditorPage;
