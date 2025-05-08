import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionCategory } from '@/types/questions';
import { SpacedRepetitionOptions, UserProgress, SpacedRepetitionResult } from './types';
import { transformQuestion } from './utils';
import {
  fetchUserProgress,
  fetchNewQuestions,
  fetchPracticeQuestions,
  fetchQuestionsByBox,
  updateUserProgress,
  updateUserStats
} from './services';

export function useSpacedRepetition(
  categoryIdentifiers: string | string[], // New parameter: can be a single ID/name or an array
  options: SpacedRepetitionOptions = {}
): SpacedRepetitionResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<{questionId: string, score: number}[]>([]);
  
  const regulationCategory = options.regulationCategory || "all";
  const boxNumber = options.boxNumber;
  const batchSize = options.batchSize || 15;

  const loadDueQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const identifiers = Array.isArray(categoryIdentifiers) ? categoryIdentifiers : (categoryIdentifiers ? [categoryIdentifiers] : []);

    // Handle practice mode: requires category identifiers.
    // If in practice mode and no identifiers are provided, skip loading questions.
    if (options.practiceMode && identifiers.length === 0) {
      console.warn("useSpacedRepetition: Practice mode selected but no category identifiers provided. Skipping question load.");
      setDueQuestions([]);
      setLoading(false);
      return;
    }

    // Log if fetching all due cards in normal mode (no categories specified).
    // For box mode, categoryIdentifiers are not the primary filter for fetching box questions,
    // so an empty identifiers array doesn't stop the process at this stage.
    // For normal mode (no practice, no box), if identifiers is empty, it signals to fetch all due cards.
    if (identifiers.length === 0 && !options.practiceMode && boxNumber === undefined) {
      console.log("useSpacedRepetition: No category identifiers provided for normal learning session. Will fetch all due cards for the user.");
    }
    // Note: The previous unconditional early exit for identifiers.length === 0 was removed to allow
    // fetching all due cards when no categories are specified in normal mode.
    // The service functions (fetchUserProgress, fetchNewQuestions) now handle empty identifiers.

    try {
      if (!user) {
        console.log(`Loading practice questions for guest user with categories=${identifiers.join(', ')}, regulation=${regulationCategory}, batchSize=${batchSize}`);
        const practiceQuestions = await fetchPracticeQuestions(
          identifiers,
          regulationCategory,
          batchSize
        );
        setDueQuestions(practiceQuestions);
      } else {
        console.log(`Loading questions for authenticated user: categories=${identifiers.join(', ')}, regulation=${regulationCategory}, practiceMode=${options.practiceMode}, boxNumber=${boxNumber}, batchSize=${batchSize}`);

        if (options.practiceMode) {
          const practiceQuestions = await fetchPracticeQuestions(
            identifiers,
            regulationCategory, 
            batchSize
          );
          setDueQuestions(practiceQuestions);
        } else if (boxNumber !== undefined) {
          const boxProgress = await fetchQuestionsByBox(user.id, boxNumber);
          const questionsFromBox = boxProgress
            .filter(p => p.questions) // Ensure questions exist
            .map(p => transformQuestion(p.questions));
          console.log(`Loaded ${questionsFromBox.length} questions from box ${boxNumber}`);
          setDueQuestions(questionsFromBox);
          setProgress(boxProgress);
        } else {
          const filteredProgressData = await fetchUserProgress(
            user.id, 
            identifiers,
            regulationCategory
          );
          const questionsWithProgress = filteredProgressData
            .filter(p => p.questions) // Ensure questions exist
            .map(p => transformQuestion(p.questions));
          console.log("Questions with progress:", questionsWithProgress.length);

          if (questionsWithProgress.length >= batchSize) {
            setDueQuestions(questionsWithProgress.slice(0, batchSize));
            setProgress(filteredProgressData);
          } else {
            const questionIdsWithProgress = filteredProgressData
              .filter(p => p.questions?.id)
              .map(p => p.question_id);
            console.log("Question IDs with progress:", questionIdsWithProgress.length);

            const neededNewQuestions = batchSize - questionsWithProgress.length;
            const newQuestions = await fetchNewQuestions(
              identifiers,
              regulationCategory, 
              questionIdsWithProgress, 
              neededNewQuestions // Fetch only the remaining number of questions needed
            );

            const allQuestions = [
              ...questionsWithProgress,
              ...newQuestions.map(transformQuestion)
            ].slice(0, batchSize); // Ensure total does not exceed batchSize
            
            console.log("Final questions count for session:", allQuestions.length);
            setDueQuestions(allQuestions);
            setProgress(filteredProgressData);
          }
        }
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error loading questions'));
      setDueQuestions([]); // Ensure dueQuestions is empty on error
    } finally {
      setLoading(false);
    }
  }, [user, categoryIdentifiers, options.practiceMode, regulationCategory, boxNumber, batchSize]);

  useEffect(() => {
    loadDueQuestions();
  }, [loadDueQuestions]);

  // New function - Submit answer without immediate reload
  const submitAnswer = async (questionId: string, score: number) => {
    if (!user) return;

    try {
      // Add to pending updates
      setPendingUpdates(prev => [...prev, {questionId, score}]);
      
      const currentProgress = progress.find(p => p.question_id === questionId);
      
      // Update progress in the background, don't await the result
      updateUserProgress(user.id, questionId, score, currentProgress)
        .catch(err => console.error('Background update error:', err));
      
      // Update stats in the background, don't await the result
      updateUserStats(user.id, score)
        .catch(err => console.error('Background stats update error:', err));
        
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error instanceof Error ? error : new Error('Unknown error submitting answer'));
    }
  };

  // Function to apply all pending updates and reload questions
  const applyPendingUpdates = async () => {
    if (!user || pendingUpdates.length === 0) return;
    
    setLoading(true);
    try {
      // Ensure all updates are complete
      for (const {questionId, score} of pendingUpdates) {
        const currentProgress = progress.find(p => p.question_id === questionId);
        await updateUserProgress(user.id, questionId, score, currentProgress);
      }
      
      // Clear pending updates
      setPendingUpdates([]);
      
      // Reload questions
      await loadDueQuestions();
    } catch (error) {
      console.error('Error applying updates:', error);
      setError(error instanceof Error ? error : new Error('Unknown error applying updates'));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    pendingUpdatesCount: pendingUpdates.length,
    applyPendingUpdates,
    reloadQuestions: loadDueQuestions
  };
}
