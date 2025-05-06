import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { useQuestionForm } from "@/hooks/useQuestionForm";
import { QuestionFormHeader } from "@/components/admin/questions/QuestionFormHeader";
import { EditorTabs, EditorTabContent } from "@/components/admin/questions/EditorTabs";
import { BasicInfoTab } from "@/components/admin/questions/BasicInfoTab";
import { ContentTab } from "@/components/admin/questions/ContentTab";
import { AnswersTab } from "@/components/admin/questions/AnswersTab";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Save } from "lucide-react";
import { PreviewModal } from "@/components/admin/questions/PreviewModal";
import { useAutoSave } from "@/hooks/questions/useAutoSave";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const QuestionEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: questions } = useQuestions();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basics");
  
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

  // Show a confirmation dialog if the user tries to navigate away with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        const message = "Sie haben ungespeicherte Änderungen. Sind Sie sicher, dass Sie die Seite verlassen möchten?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

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

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("Sie haben ungespeicherte Änderungen. Sind Sie sicher, dass Sie abbrechen möchten?")) {
        navigate("/admin/questions");
      }
    } else {
      navigate("/admin/questions");
    }
  };

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container pb-10">
      <QuestionFormHeader 
        isEditMode={isEditMode} 
        isLoading={isLoading} 
        onSave={handleSubmit}
        onPreview={() => setShowPreviewModal(true)}
        showDuplicateButton={isEditMode}
        onDuplicate={handleDuplicate}
        onCancel={handleCancel}
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
        <div className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
          <span>Letzter automatischer Speicherstand: {lastSaved.toLocaleTimeString()}</span>
          {isDirty && (
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 text-xs py-0 px-2 flex items-center gap-1"
              onClick={(e) => handleSubmit(e)}
              disabled={isLoading}
            >
              <Save className="h-3 w-3" />
              Jetzt speichern
            </Button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <EditorTabs defaultValue={activeTab} onValueChange={handleChangeTab}>
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
              handlePastedImage={handlePastedImage}
              removeImage={removeImage}
            />
          </EditorTabContent>
          
          <EditorTabContent value="answers">
            <AnswersTab
              answers={formData.answers || []}
              questionType={formData.question_type!}
              isSignalQuestion={isSignalQuestion}
              handleAnswerChange={handleAnswerChange}
              toggleAnswerCorrectness={toggleAnswerCorrectness}
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
