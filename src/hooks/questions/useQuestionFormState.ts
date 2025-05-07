import { useState } from "react";
import { QuestionCategory, QuestionType, CreateQuestionDTO, RegulationCategory } from "@/types/questions";

interface UseQuestionFormStateProps {
  initialData?: Partial<CreateQuestionDTO>;
  userId: string;
}

export const useQuestionFormState = ({ initialData, userId }: UseQuestionFormStateProps) => {
  const [formData, setFormData] = useState<Partial<CreateQuestionDTO>>({
    category: "Signale" as QuestionCategory,
    sub_category: "Haupt- und Vorsignale",
    question_type: "open" as QuestionType,
    difficulty: 1,
    text: "",
    image_url: null,
    answers: [{ text: "", isCorrect: true }],
    created_by: userId,
    regulation_category: "both" as RegulationCategory,
    hint: "",
    ...initialData
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (category: QuestionCategory) => {
    // Set appropriate defaults based on category  
    const defaultSubCategory = category === "Signale" 
      ? "Haupt- und Vorsignale"
      : "Grundlagen Bahnbetrieb";
    
    // When changing category, set appropriate question type
    const defaultQuestionType = category === "Signale" 
      ? "open" 
      : "MC_single";
    
    // When changing category, reset answers to sensible defaults
    let defaultAnswers;
    if (category === "Signale") {
      // For signal questions, just one answer that's correct
      defaultAnswers = [{ text: "", isCorrect: true }];
    } else {
      // For Betriebsdienst questions with MC_single, set up multiple options with one correct
      defaultAnswers = [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
      ];
    }
      
    setFormData(prev => ({ 
      ...prev, 
      category,
      sub_category: defaultSubCategory,
      question_type: defaultQuestionType,
      answers: defaultAnswers
    }));
  };
  
  const handleSubCategoryChange = (subCategory: string) => {
    setFormData(prev => ({ ...prev, sub_category: subCategory }));
  };
  
  const handleDifficultyChange = (newDifficulty: number) => {
    setFormData(prev => ({ ...prev, difficulty: newDifficulty }));
  };

  const handleRegulationCategoryChange = (regulationCategory: RegulationCategory) => {
    setFormData(prev => ({ ...prev, regulation_category: regulationCategory }));
  };
  
  const handleQuestionTypeChange = (questionType: QuestionType) => {
    console.log("Changing question type to:", questionType);
    
    // Adjust answers based on question type change
    let updatedAnswers = [...(formData.answers || [])];
    
    if (questionType === "MC_single" && updatedAnswers.length > 0) {
      // For MC_single, ensure only one answer is marked correct
      const hasCorrect = updatedAnswers.some(a => a.isCorrect);
      
      if (!hasCorrect && updatedAnswers.length > 0) {
        updatedAnswers[0].isCorrect = true;
      } else if (updatedAnswers.filter(a => a.isCorrect).length > 1) {
        // If multiple answers are marked correct, keep only the first one correct
        const firstCorrectIndex = updatedAnswers.findIndex(a => a.isCorrect);
        updatedAnswers = updatedAnswers.map((a, idx) => ({
          ...a,
          isCorrect: idx === firstCorrectIndex
        }));
      }
      
      // Ensure we have at least 2 answers for MC questions
      if (updatedAnswers.length < 2) {
        updatedAnswers.push({ text: "", isCorrect: false });
      }
    } else if (questionType === "MC_multi") {
      // Ensure we have at least 2 answers for MC questions
      if (updatedAnswers.length < 2) {
        updatedAnswers.push({ text: "", isCorrect: false });
      }
    } else if (questionType === "open") {
      // For open questions, only one answer that's correct
      updatedAnswers = [{ text: updatedAnswers[0]?.text || "", isCorrect: true }];
    }
    
    setFormData(prev => ({ 
      ...prev, 
      question_type: questionType,
      answers: updatedAnswers
    }));
  };

  const handleHintChange = (hint: string) => {
    setFormData(prev => ({ ...prev, hint }));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleDifficultyChange,
    handleRegulationCategoryChange,
    handleQuestionTypeChange,
    handleHintChange
  };
};
