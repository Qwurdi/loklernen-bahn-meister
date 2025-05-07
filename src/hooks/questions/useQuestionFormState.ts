
import { useState } from "react";
import { QuestionCategory, QuestionType, RegulationCategory } from "@/types/questions";
import { StructuredContent, plainTextToStructured } from "@/types/rich-text";

interface UseQuestionFormStateProps {
  initialData?: Partial<{
    category: QuestionCategory;
    sub_category: string;
    question_type: QuestionType;
    difficulty: number;
    text: string | StructuredContent;
    regulation_category: RegulationCategory;
    hint?: string | null;
    answers: { text: string | StructuredContent; isCorrect: boolean }[];
  }>;
  userId: string;
}

export const useQuestionFormState = ({ initialData, userId }: UseQuestionFormStateProps) => {
  const [formData, setFormData] = useState({
    category: initialData?.category || "Signale",
    sub_category: initialData?.sub_category || "",
    question_type: initialData?.question_type || "open",
    difficulty: initialData?.difficulty || 1,
    text: initialData?.text || "",
    regulation_category: initialData?.regulation_category || "both",
    hint: initialData?.hint || null,
    answers: initialData?.answers || [{ text: "", isCorrect: true }],
    created_by: userId
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: QuestionCategory) => {
    setFormData(prev => {
      const questionType = category === "Signale" ? "open" : prev.question_type;
      
      let answers = prev.answers;
      if (category === "Signale" && questionType === "open" && (!answers || answers.length === 0)) {
        answers = [{ text: "", isCorrect: true }];
      }
      
      return {
        ...prev,
        category,
        question_type: questionType,
        answers,
      };
    });
  };

  const handleSubCategoryChange = (sub_category: string) => {
    setFormData(prev => ({ ...prev, sub_category }));
  };

  const handleQuestionTypeChange = (question_type: QuestionType) => {
    setFormData(prev => {
      // Convert existing answers to appropriate format
      const answers = question_type === "open"
        ? [{ text: prev.answers?.[0]?.text || "", isCorrect: true }]
        : prev.answers?.map(answer => ({
            ...answer,
            isCorrect: question_type === "MC_single" ? answer === prev.answers[0] : answer.isCorrect
          })) || [{ text: "", isCorrect: true }, { text: "", isCorrect: false }];
      
      return { ...prev, question_type, answers };
    });
  };

  const handleDifficultyChange = (difficulty: number) => {
    setFormData(prev => ({ ...prev, difficulty }));
  };

  const handleRegulationCategoryChange = (regulation_category: RegulationCategory) => {
    setFormData(prev => ({ ...prev, regulation_category }));
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
    handleQuestionTypeChange,
    handleDifficultyChange,
    handleRegulationCategoryChange,
    handleHintChange
  };
};
