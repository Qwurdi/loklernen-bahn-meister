
import { useState } from "react";
import { CreateQuestionDTO } from "@/types/questions";
import { supabase } from "@/integrations/supabase/client";
import { uploadQuestionImage, createQuestion, prepareContentForStorage, prepareAnswerForStorage } from "@/api/questions";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTextValue } from "@/types/rich-text";

export const useQuestionSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (
    e: React.FormEvent,
    formData: Partial<CreateQuestionDTO>,
    imageFile: File | null,
    isEditMode: boolean,
    id?: string,
    userId?: string
  ) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // If we're in anonymous mode (for some reason user is null), show error
      if (!userId) {
        toast.error("Die Bearbeitung erfordert eine Anmeldung. Bitte laden Sie die Seite neu und melden Sie sich an.");
        return;
      }
      
      // Validate form data
      if (!formData.category || !formData.sub_category || !formData.question_type || !formData.text) {
        toast.error("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
      }
      
      // Validate answers
      if (!formData.answers || !Array.isArray(formData.answers) || formData.answers.length === 0) {
        toast.error("Bitte geben Sie mindestens eine Antwort ein.");
        return;
      }
      
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        try {
          toast.info("Bild wird hochgeladen...");
          finalImageUrl = await uploadQuestionImage(imageFile, userId);
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          toast.error("Fehler beim Hochladen des Bildes. Die Frage wird ohne Bild gespeichert.");
          finalImageUrl = null;
        }
      }
      
      // Create proper question data for saving
      const questionData: CreateQuestionDTO = {
        category: formData.category,
        sub_category: formData.sub_category,
        question_type: formData.question_type,
        difficulty: formData.difficulty || 1,
        text: formData.text,
        image_url: finalImageUrl,
        answers: formData.answers.map(answer => ({
          text: answer.text,
          isCorrect: typeof answer.isCorrect === 'boolean' ? answer.isCorrect : false
        })),
        created_by: userId,
        regulation_category: formData.category === "Signale" ? formData.regulation_category : undefined,
        hint: formData.hint
      };
      
      if (isEditMode && id) {
        toast.info("Frage wird aktualisiert...");
        
        // Convert question text to database format
        const processedText = prepareContentForStorage(questionData.text);
        
        // Convert answers to database format
        const processedAnswers = questionData.answers.map(prepareAnswerForStorage);
        
        const { error } = await supabase
          .from('questions')
          .update({
            category: questionData.category,
            sub_category: questionData.sub_category,
            question_type: questionData.question_type,
            difficulty: questionData.difficulty,
            text: processedText,
            image_url: questionData.image_url,
            answers: processedAnswers as any,
            updated_at: new Date().toISOString(),
            regulation_category: questionData.regulation_category,
            hint: questionData.hint
          })
          .eq('id', id);
        
        if (error) throw error;
        
        // Invalidate cache for the updated question
        await queryClient.invalidateQueries({ queryKey: ['questions'] });
        
        toast.success("Frage erfolgreich aktualisiert!");
      } else {
        toast.info("Frage wird erstellt...");
        
        await createQuestion(questionData);
        
        // Invalidate cache for all questions
        await queryClient.invalidateQueries({ queryKey: ['questions'] });
        
        toast.success("Frage erfolgreich erstellt!");
      }
      
      // Navigate back to questions list
      navigate("/admin/questions");
      
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error(`Fehler beim Speichern der Frage: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
    
    return false;
  };

  return {
    isLoading,
    handleSubmit
  };
};
