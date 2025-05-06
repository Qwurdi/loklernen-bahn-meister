
import { useState, useEffect } from "react";
import { Question } from "@/types/questions";
import { useQuestions } from "@/hooks/useQuestions";

export const useQuestionData = (id?: string, initialData?: any) => {
  const { data: questions, isLoading: questionsLoading } = useQuestions();
  const isEditMode = Boolean(id);
  
  const loadQuestionData = (id: string, questions: Question[] | undefined, setFormData: Function, setImagePreview: Function) => {
    if (isEditMode && id && questions) {
      const questionToEdit = questions.find(q => q.id === id);
      if (questionToEdit) {
        console.log("Loading question data:", questionToEdit);
        
        // Format HTML content if needed
        const formattedText = questionToEdit.text;
        
        setFormData((prev: any) => ({
          ...prev,
          id: questionToEdit.id,
          category: questionToEdit.category,
          sub_category: questionToEdit.sub_category,
          question_type: questionToEdit.question_type,
          difficulty: questionToEdit.difficulty,
          text: formattedText,
          image_url: questionToEdit.image_url,
          answers: questionToEdit.answers,
          created_by: questionToEdit.created_by,
          regulation_category: questionToEdit.regulation_category || "both"
        }));
        
        if (questionToEdit.image_url) {
          setImagePreview(questionToEdit.image_url);
        }
      }
    }
  };
  
  return {
    questions,
    questionsLoading,
    isEditMode,
    loadQuestionData
  };
};
