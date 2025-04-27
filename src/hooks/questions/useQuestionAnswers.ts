
import { useState } from "react";
import { Answer, QuestionType } from "@/types/questions";

export const useQuestionAnswers = (
  initialAnswers: Answer[] = [{ text: "", isCorrect: true }],
  onAnswersChange?: (answers: Answer[]) => void
) => {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  const updateAnswersWithCallback = (newAnswers: Answer[]) => {
    setAnswers(newAnswers);
    onAnswersChange?.(newAnswers);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], text: value };
    updateAnswersWithCallback(newAnswers);
  };

  const toggleAnswerCorrectness = (index: number, questionType: QuestionType) => {
    const newAnswers = [...answers];
    
    if (questionType === "MC_single") {
      newAnswers.forEach(answer => answer.isCorrect = false);
    }
    
    newAnswers[index] = { 
      ...newAnswers[index], 
      isCorrect: !newAnswers[index].isCorrect 
    };
    
    updateAnswersWithCallback(newAnswers);
  };
  
  const addAnswer = () => {
    updateAnswersWithCallback([...answers, { text: "", isCorrect: false }]);
  };
  
  const removeAnswer = (index: number) => {
    updateAnswersWithCallback(answers.filter((_, i) => i !== index));
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
