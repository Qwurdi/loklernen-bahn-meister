
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
    if (!id) {
      toast.error("Keine Frage-ID zum Duplizieren angegeben.");
      return;
    }
    
    if (!questions || !Array.isArray(questions)) {
      toast.error("Fragen konnten nicht geladen werden.");
      return;
    }
    
    try {
      setIsLoading(true);
      toast.info("Dupliziere Frage...");
      
      const originalQuestion = questions.find(q => q.id === id);
      
      if (!originalQuestion) {
        throw new Error("Frage zum Duplizieren nicht gefunden.");
      }
      
      // Create safe copy of question to avoid reference issues
      const questionCopy = {
        ...originalQuestion,
        answers: originalQuestion.answers.map(a => ({ 
          text: a.text || "", 
          isCorrect: typeof a.isCorrect === 'boolean' ? a.isCorrect : false 
        }))
      };
      
      const duplicatedQuestion = await duplicateQuestion(questionCopy);
      
      // Invalidate cache to make sure the new question appears in the list
      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      
      toast.success("Frage erfolgreich dupliziert!");
      navigate(`/admin/questions/edit/${duplicatedQuestion.id}`);
    } catch (error) {
      console.error("Error duplicating question:", error);
      toast.error("Fehler beim Duplizieren der Frage: " + (error instanceof Error ? error.message : "Unbekannter Fehler"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDuplicate
  };
};
