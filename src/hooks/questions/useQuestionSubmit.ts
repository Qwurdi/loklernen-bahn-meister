
import { CreateQuestionDTO } from "@/types/questions";
import { supabase } from "@/integrations/supabase/client";
import { uploadQuestionImage, createQuestion } from "@/api/questions";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        finalImageUrl = await uploadQuestionImage(imageFile, userId);
      }
      
      const questionData: CreateQuestionDTO = {
        category: formData.category!,
        sub_category: formData.sub_category!,
        question_type: formData.question_type!,
        difficulty: formData.difficulty!,
        text: formData.text!,
        image_url: finalImageUrl,
        answers: formData.answers!,
        created_by: userId,
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
    
    return false;
  };

  return {
    isLoading,
    handleSubmit
  };
};
