
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
  category: QuestionCategory, 
  subcategory?: string,
  options: SpacedRepetitionOptions = {}
): SpacedRepetitionResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  // Default to 'all' if regulationCategory is not provided
  const regulationCategory = options.regulationCategory || "all";
  const boxNumber = options.boxNumber;
  
  // Maximum number of questions to load at once
  const batchSize = 50;
  
  // Move loadDueQuestions to useCallback to avoid recreation on every render
  const loadDueQuestions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setDueQuestions([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log(`Loading questions with category=${category}, subcategory=${subcategory}, regulation=${regulationCategory}, practice=${options.practiceMode}`);

      // Handle practice mode differently - just load questions without checking if they're due
      if (options.practiceMode) {
        const practiceQuestions = await fetchPracticeQuestions(
          category, 
          subcategory, 
          regulationCategory, 
          batchSize
        );
        setDueQuestions(practiceQuestions);
        setLoading(false);
        return;
      }
      
      // If a specific box is requested, only fetch questions from that box
      if (boxNumber !== undefined) {
        const boxProgress = await fetchQuestionsByBox(user.id, boxNumber);
        
        // Transform the questions from the box data
        const questionsFromBox = boxProgress
          .filter(p => p.questions) // Ensure questions exist
          .map(p => transformQuestion(p.questions));
          
        console.log(`Loaded ${questionsFromBox.length} questions from box ${boxNumber}`);
        
        setDueQuestions(questionsFromBox);
        setProgress(boxProgress);
        setLoading(false);
        return;
      }
      
      // Regular spaced repetition mode
      const filteredProgressData = await fetchUserProgress(user.id, category, subcategory, regulationCategory);
      
      // Transform the questions from the progress data
      const questionsWithProgress = filteredProgressData
        .filter(p => p.questions) // Ensure questions exist
        .map(p => transformQuestion(p.questions));
        
      console.log("Questions with progress:", questionsWithProgress.length);

      // If we have enough questions with progress, no need to fetch new ones
      if (questionsWithProgress.length >= batchSize) {
        setDueQuestions(questionsWithProgress.slice(0, batchSize));
        setProgress(filteredProgressData);
        setLoading(false);
        return;
      }

      // Otherwise, fetch new questions (those without progress)
      // Get the IDs of questions that already have progress
      const questionIdsWithProgress = filteredProgressData
        .filter(p => p.questions?.id)
        .map(p => p.question_id);
        
      console.log("Question IDs with progress:", questionIdsWithProgress.length);

      const newQuestions = await fetchNewQuestions(
        category, 
        subcategory, 
        regulationCategory, 
        questionIdsWithProgress, 
        batchSize
      );

      // Combine progress questions and new questions, and limit to batch size
      const allQuestions = [
        ...questionsWithProgress,
        ...newQuestions.map(transformQuestion)
      ].slice(0, batchSize);
      
      console.log("Final questions count:", allQuestions.length);
      setDueQuestions(allQuestions);
      setProgress(filteredProgressData);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError(error instanceof Error ? error : new Error('Unknown error loading questions'));
    } finally {
      setLoading(false);
    }
  }, [user, category, subcategory, options.practiceMode, regulationCategory, boxNumber]);

  useEffect(() => {
    loadDueQuestions();
  }, [loadDueQuestions]);

  const submitAnswer = async (questionId: string, score: number) => {
    if (!user) return;

    try {
      const currentProgress = progress.find(p => p.question_id === questionId);
      
      // Update or create progress for this question
      await updateUserProgress(user.id, questionId, score, currentProgress);
      
      // Update user statistics
      await updateUserStats(user.id, score);

      // Reload questions to update the list
      await loadDueQuestions();
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error instanceof Error ? error : new Error('Unknown error submitting answer'));
    }
  };

  return {
    loading,
    error,
    dueQuestions,
    progress,
    submitAnswer,
    reloadQuestions: loadDueQuestions
  };
}
