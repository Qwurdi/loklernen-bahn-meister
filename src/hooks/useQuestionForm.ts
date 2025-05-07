
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Answer, QuestionType } from "@/types/questions";
import { useQuestionImage } from "./questions/useQuestionImage";
import { useQuestionFormState } from "./questions/useQuestionFormState";
import { useQuestionAnswers } from "./questions/useQuestionAnswers";
import { useQuestionData } from "./questions/useQuestionData";
import { useQuestionSubmit } from "./questions/useQuestionSubmit";
import { useQuestionDuplicate } from "./questions/useQuestionDuplicate";
import { validateQuestionForm } from "./questions/useQuestionValidation";
import { toast } from "sonner";
import { StructuredContent } from "@/types/rich-text";

interface UseQuestionFormProps {
  id?: string;
  initialData?: Partial<any>;
}

export const useQuestionForm = ({ id, initialData }: UseQuestionFormProps = {}) => {
  const { user } = useAuth();
  const [errors, setErrors] = useState<string[]>([]);
  
  // Extract functionality into smaller hooks
  const { questions, questionsLoading, isEditMode, loadQuestionData } = useQuestionData(id);
  const { isLoading: isSubmitting, handleSubmit: submitQuestion } = useQuestionSubmit();
  const { isLoading: isDuplicating, handleDuplicate: duplicateQuestionFunc } = useQuestionDuplicate();
  
  const isLoading = isSubmitting || isDuplicating;
  
  // Image handling
  const {
    imageFile,
    imagePreview,
    handleImageChange,
    handlePastedImage,
    removeImage,
    setImagePreview
  } = useQuestionImage(initialData?.image_url);

  // Form state handling
  const {
    formData,
    setFormData,
    handleInputChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleDifficultyChange,
    handleRegulationCategoryChange,
    handleQuestionTypeChange,
    handleHintChange
  } = useQuestionFormState({ 
    initialData, 
    userId: user?.id || 'anonymous' 
  });

  // Answer management
  const handleAnswersChange = (newAnswers: Answer[]) => {
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const {
    answers,
    handleAnswerChange,
    toggleAnswerCorrectness,
    addAnswer,
    removeAnswer
  } = useQuestionAnswers(formData.answers || [], handleAnswersChange);
  
  // Form validation
  const validateForm = (): boolean => {
    const newErrors = validateQuestionForm(formData);
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Load question data for editing
  useEffect(() => {
    loadQuestionData(id!, questions, setFormData, setImagePreview);
  }, [isEditMode, id, questions]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    if (!validateForm()) {
      e.preventDefault();
      toast.error("Bitte korrigieren Sie die markierten Felder.");
      return;
    }
    
    return await submitQuestion(e, formData, imageFile, isEditMode, id, user?.id);
  };

  // Duplicate handler
  const handleDuplicate = async () => {
    await duplicateQuestionFunc(id!, questions);
  };

  // Handle toggling answer correctness with question type
  const toggleAnswerWithQuestionType = (index: number, questionType: QuestionType) => {
    toggleAnswerCorrectness(index, questionType);
  };

  // Handle rich text changes
  const handleRichTextChange = (value: string | StructuredContent) => {
    setFormData(prev => ({ ...prev, text: value }));
  };

  return {
    isEditMode,
    isLoading,
    formData,
    imagePreview,
    handleInputChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleDifficultyChange,
    handleRegulationCategoryChange,
    handleQuestionTypeChange,
    handleHintChange,
    handleRichTextChange,
    handleAnswerChange,
    handleImageChange,
    handlePastedImage,
    removeImage,
    toggleAnswerCorrectness: toggleAnswerWithQuestionType,
    addAnswer,
    removeAnswer,
    handleSubmit,
    handleDuplicate,
    setFormData,
    errors
  };
};
