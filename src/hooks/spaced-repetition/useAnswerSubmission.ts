
import { useState } from 'react';
import { UserProgress } from './types';
import { updateUserProgress, updateUserStats } from './services';

export function useAnswerSubmission(user: any, progress: UserProgress[]) {
  const [pendingUpdates, setPendingUpdates] = useState<{questionId: string, score: number}[]>([]);

  // Submit answer without immediate reload
  const submitAnswer = async (questionId: string, score: number) => {
    if (!user) return;

    try {
      setPendingUpdates(prev => [...prev, {questionId, score}]);
      
      const currentProgress = progress.find(p => p.question_id === questionId);
      
      updateUserProgress(user.id, questionId, score, currentProgress)
        .catch(err => console.error('Background update error:', err));
      
      updateUserStats(user.id, score)
        .catch(err => console.error('Background stats update error:', err));
        
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  };

  const applyPendingUpdates = async (loadDueQuestions: () => Promise<void>) => {
    if (!user || pendingUpdates.length === 0) return;
    
    try {
      for (const {questionId, score} of pendingUpdates) {
        const currentProgress = progress.find(p => p.question_id === questionId);
        await updateUserProgress(user.id, questionId, score, currentProgress);
      }
      
      setPendingUpdates([]);
      await loadDueQuestions();
    } catch (error) {
      console.error('Error applying updates:', error);
      throw error;
    }
  };

  return {
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount: pendingUpdates.length
  };
}
