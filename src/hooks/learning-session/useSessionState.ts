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
  
  // Additional properties needed by LearningSessionPage
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  correctCount: number;
  sessionCards: Flashcard[];
  sessionFinished: boolean;
  questionsLoading: boolean;
  pendingUpdatesCount: number;
  incorrectCardIdsInCurrentSession: number[];
  handleAnswer: (cardId: number, isCorrect: boolean) => void;
  handleComplete: () => void;
  handleRestart: () => void;
  handleRestartIncorrect: (cardIds: number[]) => void;
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
    error: null,
    
    // Initialize new properties
    currentIndex: 0,
    setCurrentIndex: () => {},
    correctCount: 0,
    sessionCards: [],
    sessionFinished: false,
    questionsLoading: true,
    pendingUpdatesCount: 0,
    incorrectCardIdsInCurrentSession: [],
    handleAnswer: () => {},
    handleComplete: () => {},
    handleRestart: () => {},
    handleRestartIncorrect: () => {}
  });

  useEffect(() => {
    // Update questions when they change from spaced repetition
    if (spaceRepetitionData.dueQuestions) {
      setState(prev => ({
        ...prev,
        questions: spaceRepetitionData.dueQuestions,
        sessionCards: spaceRepetitionData.dueQuestions, // Update sessionCards
        loading: spaceRepetitionData.loading,
        questionsLoading: spaceRepetitionData.loading, // Update questionsLoading
        error: spaceRepetitionData.error,
        incorrectCardIdsInCurrentSession: spaceRepetitionData.incorrectCardIdsInCurrentSession, // Update from spaceRepetitionData
        pendingUpdatesCount: spaceRepetitionData.pendingUpdatesCount // Update from spaceRepetitionData
      }));
    }
  }, [spaceRepetitionData.dueQuestions, spaceRepetitionData.loading, spaceRepetitionData.error, 
      spaceRepetitionData.incorrectCardIdsInCurrentSession, spaceRepetitionData.pendingUpdatesCount]);

  const startSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      sessionStarted: true,
      currentQuestionIndex: 0,
      currentIndex: 0, // Update currentIndex too
      correctAnswers: 0,
      correctCount: 0, // Update correctCount too
      totalAnswers: 0,
      sessionCompleted: false,
      sessionFinished: false // Update sessionFinished too
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
          sessionCompleted: true,
          sessionFinished: true // Update sessionFinished too
        };
      }
      
      // Otherwise, go to next question
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        currentIndex: prev.currentQuestionIndex + 1 // Update currentIndex too
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
        correctCount: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers, // Update correctCount too
        totalAnswers: prev.totalAnswers + 1,
        incorrectCardIds: newIncorrectCardIds
      };
    });
  }, [spaceRepetitionData]);

  const resetSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      currentIndex: 0, // Update currentIndex too
      sessionStarted: false,
      sessionCompleted: false,
      sessionFinished: false, // Update sessionFinished too
      correctAnswers: 0,
      correctCount: 0, // Update correctCount too
      totalAnswers: 0,
      incorrectCardIds: []
    }));
  }, []);

  // Set up functions needed by LearningSessionPage
  const setCurrentIndex = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      currentIndex: index
    }));
  }, []);

  const handleAnswer = useCallback((cardId: number, isCorrect: boolean) => {
    submitAnswer(cardId, isCorrect);
  }, [submitAnswer]);

  const handleComplete = useCallback(() => {
    setState(prev => ({
      ...prev,
      sessionCompleted: true,
      sessionFinished: true
    }));
  }, []);

  const handleRestart = useCallback(() => {
    resetSession();
  }, [resetSession]);

  const handleRestartIncorrect = useCallback((cardIds: number[]) => {
    // Implementation to restart with incorrect cards
    console.log('Restarting with incorrect cards:', cardIds);
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      currentIndex: 0,
      sessionCompleted: false,
      sessionFinished: false,
      correctAnswers: 0,
      correctCount: 0,
      totalAnswers: 0
    }));
  }, []);

  return {
    ...state,
    startSession,
    goToNextQuestion,
    submitAnswer,
    resetSession,
    setCurrentIndex,
    handleAnswer,
    handleComplete,
    handleRestart,
    handleRestartIncorrect
  };
}
