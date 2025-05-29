
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { spacedRepetitionService } from '@/services/SpacedRepetitionService';
import { SessionOptions, SessionQuestion, SessionProgress, SpacedRepetitionHook } from '@/types/spaced-repetition';

export function useSpacedRepetition(initialOptions: SessionOptions = {}): SpacedRepetitionHook {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<SessionQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Calculate progress
  const progress: SessionProgress = useMemo(() => ({
    totalQuestions: questions.length,
    currentQuestion: answeredQuestions + 1,
    correctAnswers,
    answeredQuestions,
    percentage: questions.length > 0 ? Math.round((answeredQuestions / questions.length) * 100) : 0
  }), [questions.length, answeredQuestions, correctAnswers]);

  // Load questions
  const loadQuestions = useCallback(async (options: SessionOptions) => {
    setLoading(true);
    setError(null);
    
    try {
      const sessionQuestions = await spacedRepetitionService.loadSessionQuestions(
        user?.id || null, 
        { ...initialOptions, ...options }
      );
      
      setQuestions(sessionQuestions);
      setAnsweredQuestions(0);
      setCorrectAnswers(0);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err instanceof Error ? err : new Error('Fehler beim Laden der Fragen'));
    } finally {
      setLoading(false);
    }
  }, [user?.id, initialOptions]);

  // Submit answer
  const submitAnswer = useCallback(async (questionId: string, score: number) => {
    try {
      await spacedRepetitionService.submitAnswer(user?.id || null, questionId, score);
      
      // Update local state
      setAnsweredQuestions(prev => prev + 1);
      if (score >= 4) {
        setCorrectAnswers(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError(err instanceof Error ? err : new Error('Fehler beim Speichern der Antwort'));
      throw err; // Re-throw so components can handle it
    }
  }, [user?.id]);

  // Reset state
  const reset = useCallback(() => {
    setQuestions([]);
    setLoading(false);
    setError(null);
    setAnsweredQuestions(0);
    setCorrectAnswers(0);
  }, []);

  return {
    questions,
    loading,
    error,
    progress,
    submitAnswer,
    loadQuestions,
    reset
  };
}
