
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
    ...initialData
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (category: QuestionCategory) => {
    const defaultSubCategory = category === "Signale" 
      ? "Haupt- und Vorsignale"
      : "Grundlagen Bahnbetrieb";
      
    setFormData(prev => ({ 
      ...prev, 
      category,
      sub_category: defaultSubCategory,
      question_type: category === "Signale" ? "open" : prev.question_type
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

  return {
    formData,
    setFormData,
    handleInputChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleDifficultyChange,
    handleRegulationCategoryChange
  };
};
