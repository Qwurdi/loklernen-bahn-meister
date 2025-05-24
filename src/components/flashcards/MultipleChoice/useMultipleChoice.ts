
import { useState } from "react";
import { Question } from "@/types/questions";

export function useMultipleChoice(question: Question) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const isSingleChoice = question.question_type === 'MC_single';
  
  // Calculate correct answer indices for validation
  const correctAnswerIndices = question.answers
    .map((answer, index) => answer.isCorrect ? index : -1)
    .filter(index => index !== -1);
  
  const handleSingleChoiceChange = (value: string) => {
    const index = parseInt(value, 10);
    setSelectedAnswers([index]);
  };
  
  const handleMultiChoiceChange = (index: number, checked: boolean) => {
    setSelectedAnswers(prev => 
      checked 
        ? [...prev, index] 
        : prev.filter(i => i !== index)
    );
  };
  
  const handleSubmit = () => {
    if (selectedAnswers.length === 0) return;
    
    // For single choice, check if the selected answer is correct
    if (isSingleChoice) {
      const selectedIsCorrect = question.answers[selectedAnswers[0]]?.isCorrect || false;
      setIsCorrect(selectedIsCorrect);
      setSubmitted(true);
      return;
    }
    
    // For multiple choice, all correct answers must be selected and no incorrect ones
    const allCorrectSelected = correctAnswerIndices.every(index => 
      selectedAnswers.includes(index)
    );
    
    const noIncorrectSelected = selectedAnswers.every(index => 
      question.answers[index]?.isCorrect
    );
    
    const isFullyCorrect = allCorrectSelected && noIncorrectSelected;
    setIsCorrect(isFullyCorrect);
    setSubmitted(true);
  };

  return {
    selectedAnswers,
    submitted,
    isCorrect,
    handleSingleChoiceChange,
    handleMultiChoiceChange,
    handleSubmit,
  };
}
