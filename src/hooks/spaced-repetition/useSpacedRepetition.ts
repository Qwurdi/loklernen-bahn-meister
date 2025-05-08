import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress, SpacedRepetitionResult, SessionType, Flashcard } from './types';
import { transformQuestionToFlashcard } from './utils'; // transformQuestionToFlashcard behalten
import {
  fetchUserProgress, // Wird intern von den neuen Service-Funktionen verwendet
  fetchNewQuestions, // Wird intern von den neuen Service-Funktionen verwendet
  fetchPracticeQuestions, // Wird intern von den neuen Service-Funktionen verwendet
  // fetchQuestionsByBox, // Wird derzeit nicht direkt im Hook verwendet, aber in Services
  updateUserProgress,
  updateUserStats,
  fetchSpecificCardsForSR, // Korrekter Import für das Laden spezifischer Karten
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
  const [currentCategory, setCurrentCategory] = useState<QuestionCategory | undefined>(undefined); // Geändert zu QuestionCategory
  const [currentRegulation, setCurrentRegulation] = useState<string | undefined>(options.regulationCategory);

  // batchSize aus Optionen oder Standardwert
  const batchSize = options.batchSize || 15; // Sicherstellen, dass batchSize hier definiert ist

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
          fetchedProgress = await fetchUserProgress(userId);
        } else if (currentSessionType === 'category' && currentCategory) {
          fetchedCards = await fetchCategoryCardsForSR(currentCategory, userId, currentRegulation, { ...options, batchSize });
          if (userId) {
            fetchedProgress = await fetchUserProgress(userId);
          }
        } else if (userId && currentSessionType === 'all') {
          fetchedCards = await fetchAllCardsForSR(userId, currentRegulation, { ...options, batchSize });
          fetchedProgress = await fetchUserProgress(userId);
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
  }, [userId, currentSessionType, currentCategory, currentRegulation, options, batchSize]); // options und batchSize als Abhängigkeit hinzugefügt

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
  }, [loadInitialCards, initialCardIdsToLoad, currentSessionType]); // currentSessionType als Abhängigkeit beibehalten

  const startNewSession = useCallback(
    async (type: SessionType, category?: QuestionCategory, regulation?: string, cardIdsToLoad?: number[]) => { // category zu QuestionCategory
      setLoading(true);
      setError(null);
      setIncorrectCardIdsInCurrentSession([]);
      
      setCurrentSessionType(type);
      setCurrentCategory(category);
      setCurrentRegulation(regulation);

      if (cardIdsToLoad && cardIdsToLoad.length > 0) {
        await loadInitialCards(cardIdsToLoad);
      } else {
        // loadInitialCards wird durch den useEffect oben aufgerufen, wenn sich currentSessionType etc. ändern
        // oder hier direkt, um sicherzustellen, dass es nach dem Setzen der States ausgeführt wird.
        await loadInitialCards();
      }
      // setLoading(false); // Wird in loadInitialCards gehandhabt
    },
    [loadInitialCards] 
  );

  const submitAnswer = useCallback( // Umbenannt von userAnswer zu submitAnswer
    async (cardId: number, isCorrect: boolean) => {
      if (!userId && currentSessionType !== 'guest') { // Gastmodus erlaubt Antworten ohne userId
        console.warn("submitAnswer called without userId for a non-guest session.");
        return; 
      }

      if (!isCorrect) {
        setIncorrectCardIdsInCurrentSession(prev => [...new Set([...prev, cardId])]);
      }
      
      if (userId) { // Nur Updates für eingeloggte Benutzer
        try {
          const questionIdStr = cardId.toString();
          setPendingUpdates(prev => [...prev, { questionId: questionIdStr, score: isCorrect ? 5 : 1 }]);
          const currentProgressItem = progress.find(p => p.question_id === questionIdStr);
          // Führen Sie Updates im Hintergrund aus, ohne darauf zu warten, um die UI nicht zu blockieren
          updateUserProgress(userId, questionIdStr, isCorrect ? 5 : 1, currentProgressItem)
            .catch(err => console.error('Background update error:', err)); // Fehler nur loggen
          updateUserStats(userId, isCorrect ? 5 : 1)
            .catch(err => console.error('Background stats update error:', err)); // Fehler nur loggen
        } catch (error) {
          // Sollte nicht hierher kommen, da die Promises oben gefangen werden
          console.error('Error submitting answer:', error);
          // setError(error instanceof Error ? error : new Error('Unknown error submitting answer'));
        }
      }
    },
    [userId, progress, currentSessionType] // currentSessionType hinzugefügt
  );

  const applyPendingUpdates = async () => {
    if (!userId || pendingUpdates.length === 0) return;
    
    setLoading(true);
    try {
      for (const {questionId, score} of pendingUpdates) {
        const currentProgressItem = progress.find(p => p.question_id === questionId);
        await updateUserProgress(userId, questionId, score, currentProgressItem);
      }
      setPendingUpdates([]);
      // Nach dem Anwenden von Updates, die Karten neu laden, um den Fortschritt widerzuspiegeln
      await loadInitialCards(); 
    } catch (error) {
      console.error('Error applying updates:', error);
      setError(error instanceof Error ? error : new Error('Unknown error applying updates'));
    } finally {
      setLoading(false);
    }
  };

  const reloadQuestions = useCallback(() => {
    if (currentSessionType === 'specific_ids' && initialCardIdsToLoad && initialCardIdsToLoad.length > 0) {
      loadInitialCards(initialCardIdsToLoad);
    } else if (currentSessionType) {
      loadInitialCards();
    }
    // Wenn kein Session-Typ oder keine IDs, passiert nichts, was korrekt ist.
  }, [loadInitialCards, currentSessionType, initialCardIdsToLoad]);


  return {
    loading,
    error,
    dueQuestions,
    progress, // Beachten Sie, dass 'progress' hier nicht aktualisiert wird. Muss ggf. angepasst werden.
    submitAnswer,
    pendingUpdatesCount: pendingUpdates.length,
    applyPendingUpdates,
    reloadQuestions,
    startNewSession,
    incorrectCardIdsInCurrentSession,
  };
}

// WICHTIG: Die Logik für das Laden und Aktualisieren von `progress` (UserProgress[])
// muss überprüft und ggf. angepasst werden. Aktuell wird `progress` initial nicht geladen
// und in `submitAnswer` nur für `updateUserProgress` verwendet.
// Wenn `progress` für die UI benötigt wird, muss es z.B. in `loadInitialCards`
// oder einer separaten Funktion geladen werden.
