
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CreateQuestionDTO, Question, Answer, RegulationCategory } from "@/types/questions";
import { createQuestion, uploadQuestionImage } from "@/api/questions";
import { Json } from "@/integrations/supabase/types";
import { useQuestions } from "./useQuestions";
import { useQuestionImage } from "./questions/useQuestionImage";
import { useQuestionAnswers } from "./questions/useQuestionAnswers";
import { useQuestionFormState } from "./questions/useQuestionFormState";

interface UseQuestionFormProps {
  id?: string;
  initialData?: Partial<CreateQuestionDTO>;
}

export const useQuestionForm = ({ id, initialData }: UseQuestionFormProps = {}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const { data: questions } = useQuestions();

  if (!user) {
    throw new Error("User must be authenticated to use this hook");
  }
  
  const {
    imageFile,
    imagePreview,
    handleImageChange,
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
  } = useQuestionFormState({ initialData, userId: user.id });

  const handleAnswersChange = (newAnswers: Answer[]) => {
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const {
    answers,
    handleAnswerChange,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer
  } = useQuestionAnswers(formData.answers, handleAnswersChange);

  useEffect(() => {
    if (isEditMode && id && questions) {
      const questionToEdit = questions.find(q => q.id === id);
      if (questionToEdit) {
        console.log("Loading question data:", questionToEdit);
        setFormData({
          category: questionToEdit.category,
          sub_category: questionToEdit.sub_category,
          question_type: questionToEdit.question_type,
          difficulty: questionToEdit.difficulty,
          text: questionToEdit.text,
          image_url: questionToEdit.image_url,
          answers: questionToEdit.answers,
          created_by: questionToEdit.created_by,
          regulation_category: questionToEdit.regulation_category || "both"
        });
        
        if (questionToEdit.image_url) {
          setImagePreview(questionToEdit.image_url);
        }
      }
    }
  }, [isEditMode, id, questions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (!formData.text) {
        toast.error("Bitte geben Sie einen Fragetext ein.");
        return;
      }
      
      if (!formData.answers || formData.answers.length === 0 || !formData.answers.some(a => a.text)) {
        toast.error("Bitte geben Sie mindestens eine Antwort ein.");
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
        answers: formData.answers,
        created_by: user.id,
        regulation_category: formData.category === "Signale" ? formData.regulation_category : undefined
      };
      
      if (isEditMode && id) {
        const supabaseAnswers: Json = formData.answers.map(answer => ({
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
        toast.success("Frage erfolgreich aktualisiert!");
      } else {
        await createQuestion(questionData);
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
    removeImage,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer,
    handleSubmit
  };
};
