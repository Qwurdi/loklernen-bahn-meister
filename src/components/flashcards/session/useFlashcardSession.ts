
import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { QuestionCategory } from "@/types/questions";
import { RegulationFilterType } from "@/types/regulation";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { toast } from "sonner";

export interface UseFlashcardSessionParams {
  category: QuestionCategory;
  subcategory?: string;
  isPracticeMode?: boolean;
}

export function useFlashcardSession({
  category,
  subcategory,
  isPracticeMode = true
}: UseFlashcardSessionParams) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const { regulationPreference } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get regulation filter from URL or default to user preference
  const regulationParam = (searchParams.get("regelwerk") as RegulationFilterType) || regulationPreference;
  
  // Pass the regulation preference to the hook
  const {
    loading,
    dueQuestions: questions,
    submitAnswer
  } = useSpacedRepetition(
    category, 
    subcategory, 
    { 
      practiceMode: isPracticeMode,
      regulationCategory: regulationParam
    }
  );
  
  // Update regulation filter when it changes
  const handleRegulationChange = useCallback((value: RegulationFilterType) => {
    setSearchParams(params => {
      params.set("regelwerk", value);
      return params;
    });
  }, [setSearchParams]);
  
  // Handle answer submission
  const handleAnswer = useCallback(async (questionId: string, score: number) => {
    if (user) {
      await submitAnswer(questionId, score);
    }

    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
  }, [user, submitAnswer]);
  
  // Handle session completion
  const handleComplete = useCallback(() => {
    setSessionFinished(true);
    toast.success("Gut gemacht! Du hast alle Karten dieser Kategorie bearbeitet!");
  }, []);
  
  return {
    loading,
    questions,
    currentIndex,
    setCurrentIndex,
    correctCount,
    sessionFinished,
    regulationParam,
    handleRegulationChange,
    handleAnswer,
    handleComplete,
  };
}
