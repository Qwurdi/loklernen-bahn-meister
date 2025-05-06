
import { useState, useEffect } from "react";
import { Answer, QuestionType } from "@/types/questions";
import { toast } from "sonner";

export const useQuestionAnswers = (
  initialAnswers: Answer[] = [{ text: "", isCorrect: true }],
  onAnswersChange?: (answers: Answer[]) => void
) => {
  // Ensure initialAnswers is valid or provide default
  const safeInitialAnswers = Array.isArray(initialAnswers) && initialAnswers.length > 0
    ? initialAnswers.map(answer => ({
        text: answer.text || "",
        isCorrect: typeof answer.isCorrect === 'boolean' ? answer.isCorrect : false
      }))
    : [{ text: "", isCorrect: true }];
  
  const [answers, setAnswers] = useState<Answer[]>(safeInitialAnswers);

  // Update answers when initialAnswers changes (for example after duplication)
  useEffect(() => {
    if (Array.isArray(initialAnswers) && initialAnswers.length > 0) {
      const safeAnswers = initialAnswers.map(answer => ({
        text: answer.text || "",
        isCorrect: typeof answer.isCorrect === 'boolean' ? answer.isCorrect : false
      }));
      setAnswers(safeAnswers);
    }
  }, [initialAnswers]);

  const updateAnswersWithCallback = (newAnswers: Answer[]) => {
    try {
      // Ensure newAnswers is an array before updating
      if (!Array.isArray(newAnswers)) {
        console.error("Invalid answers format:", newAnswers);
        toast.error("Fehler beim Aktualisieren der Antworten");
        return;
      }
      
      setAnswers(newAnswers);
      
      if (onAnswersChange) {
        onAnswersChange(newAnswers);
      }
    } catch (error) {
      console.error("Error updating answers:", error);
      toast.error("Fehler beim Aktualisieren der Antworten");
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    try {
      // Validate index
      if (index < 0 || index >= answers.length) {
        console.error("Invalid answer index:", index);
        toast.error("Ungültiger Antwortindex");
        return;
      }
      
      const newAnswers = [...answers];
      newAnswers[index] = { 
        ...newAnswers[index], 
        text: value 
      };
      
      updateAnswersWithCallback(newAnswers);
    } catch (error) {
      console.error("Error changing answer text:", error);
      toast.error("Fehler beim Ändern des Antworttexts");
    }
  };

  const toggleAnswerCorrectness = (index: number, questionType: QuestionType) => {
    try {
      // Validate index and questionType
      if (index < 0 || index >= answers.length) {
        console.error("Invalid answer index for toggle:", index);
        toast.error("Ungültiger Antwortindex");
        return;
      }
      
      if (!questionType || !["MC_single", "MC_multi", "open"].includes(questionType)) {
        console.error("Invalid question type:", questionType);
        toast.error("Ungültiger Fragetyp");
        return;
      }
      
      const newAnswers = [...answers];
      
      if (questionType === "MC_single") {
        newAnswers.forEach(answer => answer.isCorrect = false);
      }
      
      newAnswers[index] = { 
        ...newAnswers[index], 
        isCorrect: !newAnswers[index].isCorrect 
      };
      
      updateAnswersWithCallback(newAnswers);
    } catch (error) {
      console.error("Error toggling answer correctness:", error);
      toast.error("Fehler beim Ändern des Antwortstatus");
    }
  };
  
  const addAnswer = () => {
    try {
      const newAnswers = [...answers, { text: "", isCorrect: false }];
      updateAnswersWithCallback(newAnswers);
    } catch (error) {
      console.error("Error adding answer:", error);
      toast.error("Fehler beim Hinzufügen einer Antwort");
    }
  };
  
  const removeAnswer = (index: number) => {
    try {
      // Validate index
      if (index < 0 || index >= answers.length) {
        console.error("Invalid answer index for removal:", index);
        toast.error("Ungültiger Antwortindex");
        return;
      }
      
      const newAnswers = answers.filter((_, i) => i !== index);
      
      // Ensure there's always at least one answer
      if (newAnswers.length === 0) {
        newAnswers.push({ text: "", isCorrect: true });
      }
      
      updateAnswersWithCallback(newAnswers);
    } catch (error) {
      console.error("Error removing answer:", error);
      toast.error("Fehler beim Entfernen einer Antwort");
    }
  };

  return {
    answers,
    setAnswers: updateAnswersWithCallback,
    handleAnswerChange,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer
  };
};
