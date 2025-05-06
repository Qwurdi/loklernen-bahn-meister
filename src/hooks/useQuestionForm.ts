
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CreateQuestionDTO, Question, Answer, RegulationCategory } from "@/types/questions";
import { createQuestion, uploadQuestionImage, duplicateQuestion } from "@/api/questions";
import { Json } from "@/integrations/supabase/types";
import { useQuestions } from "./useQuestions";
import { useQuestionImage } from "./questions/useQuestionImage";
import { useQuestionAnswers } from "./questions/useQuestionAnswers";
import { useQuestionFormState } from "./questions/useQuestionFormState";
import { useQueryClient } from "@tanstack/react-query";

interface UseQuestionFormProps {
  id?: string;
  initialData?: Partial<CreateQuestionDTO>;
}

export const useQuestionForm = ({ id, initialData }: UseQuestionFormProps = {}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { data: questions, isLoading: questionsLoading } = useQuestions();
  
  const {
    imageFile,
    imagePreview,
    handleImageChange,
    handlePastedImage,
    removeImage,
    setImagePreview
  } = useQuestionImage(initialData?.image_url);

  const {
    formData,
    setFormData,
    handleInputChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleDifficultyChange,
    handleRegulationCategoryChange
  } = useQuestionFormState({ 
    initialData, 
    userId: user?.id || 'anonymous' 
  });

  const handleAnswersChange = (newAnswers: Answer[]) => {
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const {
    answers,
    handleAnswerChange,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer
  } = useQuestionAnswers(formData.answers || [], handleAnswersChange);
  
  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    
    if (!formData.text?.trim()) {
      newErrors.push("Bitte geben Sie einen Fragetext ein.");
    }
    
    if (!formData.category) {
      newErrors.push("Bitte wählen Sie eine Kategorie aus.");
    }
    
    if (!formData.sub_category) {
      newErrors.push("Bitte wählen Sie eine Unterkategorie aus.");
    }
    
    if (!formData.answers || formData.answers.length === 0) {
      newErrors.push("Bitte geben Sie mindestens eine Antwort ein.");
    } else {
      // Check if any answer text is empty
      if (formData.answers.some(a => !a.text?.trim())) {
        newErrors.push("Bitte geben Sie für alle Antworten einen Text ein.");
      }
      
      // For MC_single and MC_multi, ensure at least one answer is marked as correct
      if ((formData.question_type === "MC_single" || formData.question_type === "MC_multi") && 
          !formData.answers.some(a => a.isCorrect)) {
        newErrors.push("Bitte markieren Sie mindestens eine Antwort als korrekt.");
      }
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  useEffect(() => {
    const loadQuestionData = async () => {
      if (isEditMode && id && questions) {
        const questionToEdit = questions.find(q => q.id === id);
        if (questionToEdit) {
          console.log("Loading question data:", questionToEdit);
          
          // Format HTML content if needed
          const formattedText = questionToEdit.text;
          
          // Hier ist der Fehler - wir müssen das ID-Feld korrekt behandeln
          setFormData((prev) => ({
            ...prev,
            id: questionToEdit.id,
            category: questionToEdit.category,
            sub_category: questionToEdit.sub_category,
            question_type: questionToEdit.question_type,
            difficulty: questionToEdit.difficulty,
            text: formattedText,
            image_url: questionToEdit.image_url,
            answers: questionToEdit.answers,
            created_by: questionToEdit.created_by,
            regulation_category: questionToEdit.regulation_category || "both"
          }));
          
          if (questionToEdit.image_url) {
            setImagePreview(questionToEdit.image_url);
          }
        }
      }
    };
    
    loadQuestionData();
  }, [isEditMode, id, questions, setFormData, setImagePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Bitte korrigieren Sie die markierten Felder.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // If we're in anonymous mode (for some reason user is null), show error
      if (!user) {
        toast.error("Die Bearbeitung erfordert eine Anmeldung. Bitte laden Sie die Seite neu und melden Sie sich an.");
        return;
      }
      
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        finalImageUrl = await uploadQuestionImage(imageFile, user.id);
      }
      
      const questionData: CreateQuestionDTO = {
        category: formData.category!,
        sub_category: formData.sub_category!,
        question_type: formData.question_type!,
        difficulty: formData.difficulty!,
        text: formData.text!,
        image_url: finalImageUrl,
        answers: formData.answers!,
        created_by: user.id,
        regulation_category: formData.category === "Signale" ? formData.regulation_category : undefined
      };
      
      if (isEditMode && id) {
        const supabaseAnswers: Json = formData.answers!.map(answer => ({
          text: answer.text,
          isCorrect: answer.isCorrect
        }));
        
        const { error } = await supabase
          .from('questions')
          .update({
            category: questionData.category,
            sub_category: questionData.sub_category,
            question_type: questionData.question_type,
            difficulty: questionData.difficulty,
            text: questionData.text,
            image_url: questionData.image_url,
            answers: supabaseAnswers,
            updated_at: new Date().toISOString(),
            regulation_category: questionData.regulation_category
          })
          .eq('id', id);
        
        if (error) throw error;
        
        // Invalidate cache for the updated question
        await queryClient.invalidateQueries({ queryKey: ['questions'] });
        
        toast.success("Frage erfolgreich aktualisiert!");
      } else {
        await createQuestion(questionData);
        
        // Invalidate cache for all questions
        await queryClient.invalidateQueries({ queryKey: ['questions'] });
        
        toast.success("Frage erfolgreich erstellt!");
      }
      
      navigate("/admin/questions");
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Fehler beim Speichern der Frage. Bitte versuchen Sie es später noch einmal.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDuplicate = async () => {
    if (!id || !formData) {
      toast.error("Keine Frage zum Duplizieren gefunden.");
      return;
    }
    
    try {
      setIsLoading(true);
      toast.info("Dupliziere Frage...");
      
      const originalQuestion = questions?.find(q => q.id === id);
      
      if (!originalQuestion) {
        throw new Error("Frage zum Duplizieren nicht gefunden.");
      }
      
      const duplicatedQuestion = await duplicateQuestion(originalQuestion);
      
      // Invalidate cache to make sure the new question appears in the list
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      
      toast.success("Frage erfolgreich dupliziert!");
      navigate(`/admin/questions/edit/${duplicatedQuestion.id}`);
    } catch (error) {
      console.error("Error duplicating question:", error);
      toast.error("Fehler beim Duplizieren der Frage.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
