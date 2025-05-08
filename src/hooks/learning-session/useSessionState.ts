import { useState, useCallback, useEffect } from "react";
import { Flashcard, SpacedRepetitionResult } from "@/hooks/spaced-repetition/types";
import { toast } from "sonner";

export interface SessionState {
  questions: Flashcard[];
  currentQuestionIndex: number;
  sessionStarted: boolean;
  sessionCompleted: boolean;
  correctAnswers: number;
  totalAnswers: number;
  incorrectCardIds: number[];
  loading: boolean;
  error: Error | null;
}

interface UseSessionStateProps {
  spaceRepetitionData: SpacedRepetitionResult;
  practiceMode?: boolean;
}

export function useSessionState({
  spaceRepetitionData,
  practiceMode = false
}: UseSessionStateProps) {
  const [state, setState] = useState<SessionState>({
    questions: [],
    currentQuestionIndex: 0,
    sessionStarted: false,
    sessionCompleted: false,
    correctAnswers: 0,
    totalAnswers: 0,
    incorrectCardIds: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    // Update questions when they change from spaced repetition
    if (spaceRepetitionData.dueQuestions) {
      setState(prev => ({
        ...prev,
        questions: spaceRepetitionData.dueQuestions,
        loading: spaceRepetitionData.loading,
        error: spaceRepetitionData.error
      }));
    }
  }, [spaceRepetitionData.dueQuestions, spaceRepetitionData.loading, spaceRepetitionData.error]);

  const startSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      sessionStarted: true,
      currentQuestionIndex: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      sessionCompleted: false
    }));
  }, []);

  const goToNextQuestion = useCallback(() => {
    setState(prev => {
      const isLastQuestion = prev.currentQuestionIndex >= prev.questions.length - 1;
      
      // If last question, mark session as completed
      if (isLastQuestion) {
        // Show completion toast if not in practice mode
        if (!practiceMode) {
          toast("Lerneinheit abgeschlossen!", {
            description: `${prev.correctAnswers} von ${prev.totalAnswers} Fragen richtig beantwortet.`
          });
        }
        
        return {
          ...prev,
          sessionCompleted: true
        };
      }
      
      // Otherwise, go to next question
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      };
    });
  }, [practiceMode]);

  const submitAnswer = useCallback((cardId: number, isCorrect: boolean) => {
    // Submit answer through spaced repetition hook
    spaceRepetitionData.submitAnswer(cardId, isCorrect);
    
    // Update local state
    setState(prev => {
      const newIncorrectCardIds = isCorrect 
        ? prev.incorrectCardIds 
        : [...prev.incorrectCardIds, cardId];
      
      return {
        ...prev,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        totalAnswers: prev.totalAnswers + 1,
        incorrectCardIds: newIncorrectCardIds
      };
    });
  }, [spaceRepetitionData]);

  const resetSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      sessionStarted: false,
      sessionCompleted: false,
      correctAnswers: 0,
      totalAnswers: 0,
      incorrectCardIds: []
    }));
  }, []);

  return {
    ...state,
    startSession,
    goToNextQuestion,
    submitAnswer,
    resetSession
  };
}
