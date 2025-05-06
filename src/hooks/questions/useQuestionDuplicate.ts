
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Question } from "@/types/questions";
import { duplicateQuestion } from "@/api/questions";
import { useQueryClient } from "@tanstack/react-query";

export const useQuestionDuplicate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDuplicate = async (id: string, questions: Question[] | undefined) => {
    if (!id || !questions) {
      toast.error("Keine Frage zum Duplizieren gefunden.");
      return;
    }
    
    try {
      setIsLoading(true);
      toast.info("Dupliziere Frage...");
      
      const originalQuestion = questions.find(q => q.id === id);
      
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
    isLoading,
    handleDuplicate
  };
};
