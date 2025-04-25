
// No changes needed to this file, but for reference:
import { useState } from "react";
import { Answer, QuestionType } from "@/types/questions";

export const useQuestionAnswers = (initialAnswers: Answer[] = [{ text: "", isCorrect: true }]) => {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], text: value };
    setAnswers(newAnswers);
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
    
    setAnswers(newAnswers);
  };
  
  const addAnswer = () => {
    setAnswers([...answers, { text: "", isCorrect: false }]);
  };
  
  const removeAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  return {
    answers,
    setAnswers,
    handleAnswerChange,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer
  };
};
