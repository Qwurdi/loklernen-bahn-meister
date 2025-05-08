
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress, SpacedRepetitionResult, SessionType, Flashcard } from './types';
import { transformQuestionToFlashcard } from './utils';
import {
  fetchUserProgress,
  updateUserProgress,
  updateUserStats,
  fetchSpecificCardsForSR,
  fetchDueCardsForSR,
  fetchCategoryCardsForSR,
  fetchAllCardsForSR,
} from './services';

export function useSpacedRepetition(
  userId: string | undefined,
  options: SpacedRepetitionOptions = {},
  initialCardIdsToLoad?: number[]
): SpacedRepetitionResult {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Flashcard[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<{questionId: string, score: number}[]>([]);
  const [incorrectCardIdsInCurrentSession, setIncorrectCardIdsInCurrentSession] = useState<number[]>([]);
  const [currentSessionType, setCurrentSessionType] = useState<SessionType | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(undefined);
  const [currentRegulation, setCurrentRegulation] = useState<string | undefined>(options.regulationCategory);

  // batchSize aus Optionen oder Standardwert
  const batchSize = options.batchSize || 15;

  const loadInitialCards = useCallback(async (cardIds?: number[]) => {
    setLoading(true);
    setError(null);
    let fetchedCards: Flashcard[] = [];
    let fetchedProgress: UserProgress[] = [];
    try {
      if (cardIds && cardIds.length > 0) {
        fetchedCards = await fetchSpecificCardsForSR(cardIds, currentRegulation);
        if (userId) {
          fetchedProgress = await fetchUserProgress(userId, [], currentRegulation);
        }
      } else if (currentSessionType) {
        if (userId && currentSessionType === 'due') {
          fetchedCards = await fetchDueCardsForSR(userId, currentRegulation, { ...options, batchSize });
          fetchedProgress = await fetchUserProgress(userId, [], currentRegulation);
        } else if (currentSessionType === 'category' && currentCategory) {
          fetchedCards = await fetchCategoryCardsForSR(currentCategory, userId, currentRegulation, { ...options, batchSize });
          if (userId) {
            fetchedProgress = await fetchUserProgress(userId, [], currentRegulation);
          }
        } else if (userId && currentSessionType === 'all') {
          fetchedCards = await fetchAllCardsForSR(userId, currentRegulation, { ...options, batchSize });
          fetchedProgress = await fetchUserProgress(userId, [], currentRegulation);
        } else if (currentSessionType === 'guest' && currentCategory) {
          fetchedCards = await fetchCategoryCardsForSR(currentCategory, undefined, currentRegulation, { ...options, batchSize });
        }
      }
      setDueQuestions(fetchedCards);
      setProgress(fetchedProgress);
    } catch (err) {
      console.error('Error loading initial cards:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading cards'));
      setDueQuestions([]);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  }, [userId, currentSessionType, currentCategory, currentRegulation, options, batchSize]);

  useEffect(() => {
    if (initialCardIdsToLoad && initialCardIdsToLoad.length > 0) {
      // Session-Typ setzen, falls Karten direkt geladen werden
      setCurrentSessionType('specific_ids');
      loadInitialCards(initialCardIdsToLoad);
    } else if (currentSessionType) {
      loadInitialCards();
    } else {
      setLoading(false);
      setDueQuestions([]);
    }
  }, [loadInitialCards, initialCardIdsToLoad, currentSessionType]);

  const startNewSession = useCallback(
    async (type: SessionType, category?: string, regulation?: string, cardIdsToLoad?: number[]) => {
      setLoading(true);
      setError(null);
      setIncorrectCardIdsInCurrentSession([]);
      
      setCurrentSessionType(type);
      setCurrentCategory(category);
      setCurrentRegulation(regulation);

      if (cardIdsToLoad && cardIdsToLoad.length > 0) {
        await loadInitialCards(cardIdsToLoad);
      } else {
        // loadInitialCards wird durch den useEffect oben aufgerufen
        await loadInitialCards();
      }
    },
    [loadInitialCards] 
  );

  const submitAnswer = useCallback(
    async (cardId: number, isCorrect: boolean) => {
      if (!userId && currentSessionType !== 'guest') {
        console.warn("submitAnswer called without userId for a non-guest session.");
        return; 
      }

      if (!isCorrect) {
        setIncorrectCardIdsInCurrentSession(prev => [...new Set([...prev, cardId])]);
      }
      
      if (userId) {
        try {
          const questionIdStr = cardId.toString();
          setPendingUpdates(prev => [...prev, { questionId: questionIdStr, score: isCorrect ? 5 : 1 }]);
          const currentProgressItem = progress.find(p => p.question_id === questionIdStr);
          // Führen Sie Updates im Hintergrund aus
          updateUserProgress(userId, questionIdStr, isCorrect ? 5 : 1, currentProgressItem)
            .catch(err => console.error('Background update error:', err));
          updateUserStats(userId, isCorrect ? 5 : 1)
            .catch(err => console.error('Background stats update error:', err));
        } catch (error) {
          console.error('Error submitting answer:', error);
        }
      }
    },
    [userId, progress, currentSessionType]
  );

  const applyPendingUpdates = useCallback(async () => {
    if (!userId || pendingUpdates.length === 0) return;
    
    setLoading(true);
    try {
      for (const {questionId, score} of pendingUpdates) {
        const currentProgressItem = progress.find(p => p.question_id === questionId);
        await updateUserProgress(userId, questionId, score, currentProgressItem);
      }
      setPendingUpdates([]);
      // Nach dem Anwenden von Updates, die Karten neu laden
      await loadInitialCards(); 
    } catch (error) {
      console.error('Error applying updates:', error);
      setError(error instanceof Error ? error : new Error('Unknown error applying updates'));
    } finally {
      setLoading(false);
    }
  }, [userId, pendingUpdates, progress, loadInitialCards]);

  const reloadQuestions = useCallback(async () => {
    if (currentSessionType === 'specific_ids' && initialCardIdsToLoad && initialCardIdsToLoad.length > 0) {
      await loadInitialCards(initialCardIdsToLoad);
    } else if (currentSessionType) {
      await loadInitialCards();
    }
    return Promise.resolve();
  }, [loadInitialCards, currentSessionType, initialCardIdsToLoad]);


  return {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount: pendingUpdates.length,
    applyPendingUpdates,
    reloadQuestions,
    startNewSession,
    incorrectCardIdsInCurrentSession,
  };
}
