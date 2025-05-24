
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { LearningService, LearningSession, SessionOptions } from '@/services/LearningService';
import { Question } from '@/types/questions';
import { toast } from 'sonner';

export function useLearningSession(baseOptions: SessionOptions = {}) {
  const { user } = useAuth();
  const { regulationPreference } = useUserPreferences();
  
  const [session, setSession] = useState<LearningSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Create stable options object
  const stableOptions = useMemo(() => ({
    regulationFilter: regulationPreference,
    ...baseOptions
  }), [regulationPreference, baseOptions.category, baseOptions.subcategory, baseOptions.regulationFilter, baseOptions.practiceMode, baseOptions.boxNumber, baseOptions.batchSize]);

  // Initialize session
  const startSession = useCallback(async (sessionOptions?: SessionOptions) => {
    setLoading(true);
    setError(null);
    
    try {
      const finalOptions = {
        ...stableOptions,
        ...sessionOptions
      };
      
      console.log('Starting session with options:', finalOptions);
      
      const newSession = await LearningService.startSession(user?.id || null, finalOptions);
      setSession(newSession);
      setCurrentIndex(0);
      setSessionComplete(false);
      
      // Preload images for smooth experience
      await LearningService.preloadImages(newSession.questions);
      
      toast.success(`Lerneinheit mit ${newSession.questions.length} Karten gestartet`);
    } catch (err) {
      console.error('Failed to start session:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Starten der Lerneinheit');
      toast.error('Fehler beim Laden der Fragen');
    } finally {
      setLoading(false);
    }
  }, [user?.id, stableOptions]);

  // Submit answer
  const submitAnswer = useCallback(async (questionId: string, score: number) => {
    if (!session) return;
    
    try {
      await LearningService.submitAnswer(questionId, score);
      
      // Update local session state
      const updatedSession = LearningService.getCurrentSession();
      if (updatedSession) {
        setSession({ ...updatedSession });
      }
      
      // Provide haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(score >= 4 ? [10, 50, 10] : [20]);
      }
      
    } catch (err) {
      console.error('Failed to submit answer:', err);
      toast.error('Fehler beim Speichern der Antwort');
    }
  }, [session]);

  // Move to next question
  const nextQuestion = useCallback(() => {
    if (!session) return;
    
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeSession();
    }
  }, [session, currentIndex]);

  // Complete session
  const completeSession = useCallback(async () => {
    if (!session) return;
    
    setSessionComplete(true);
    
    // Sync answers if user is authenticated
    if (user?.id) {
      try {
        await LearningService.syncAnswers(user.id);
        toast.success('Fortschritt gespeichert!');
      } catch (err) {
        console.error('Failed to sync answers:', err);
        toast.error('Fehler beim Speichern des Fortschritts');
      }
    }
    
    LearningService.endSession();
  }, [session, user?.id]);

  // Reset session
  const resetSession = useCallback(() => {
    setSession(null);
    setCurrentIndex(0);
    setSessionComplete(false);
    setError(null);
    LearningService.endSession();
  }, []);

  // Current question
  const currentQuestion = session?.questions[currentIndex] || null;
  
  // Progress calculations
  const progress = session ? {
    current: currentIndex + 1,
    total: session.questions.length,
    percentage: Math.round(((currentIndex + 1) / session.questions.length) * 100),
    correctCount: session.correctCount,
    correctPercentage: session.answers.length > 0 
      ? Math.round((session.correctCount / session.answers.length) * 100)
      : 0
  } : null;

  return {
    // Session state
    session,
    loading,
    error,
    sessionComplete,
    
    // Current state
    currentQuestion,
    currentIndex,
    progress,
    
    // Actions
    startSession,
    submitAnswer,
    nextQuestion,
    completeSession,
    resetSession,
    
    // Computed values
    hasQuestions: session?.questions.length > 0,
    canMoveNext: session && currentIndex < session.questions.length - 1,
    isLastQuestion: session && currentIndex === session.questions.length - 1
  };
}
