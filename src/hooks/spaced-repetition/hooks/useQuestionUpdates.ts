
import { useState } from 'react';
import { toast } from 'sonner';
import { updateUserProgress, updateUserStats } from '../services';

export function useQuestionUpdates(userId?: string) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitAnswer = async (
    questionId: string, 
    score: number, 
    currentProgress?: any
  ) => {
    if (!userId) return;
    
    setUpdating(true);
    setError(null);
    
    try {
      // Update progress and stats simultaneously
      await Promise.all([
        updateUserProgress(userId, questionId, score, currentProgress),
        updateUserStats(userId, score)
      ]);
      
      return true;
    } catch (err) {
      console.error('Error submitting answer:', err);
      const resultError = err instanceof Error ? err : new Error('Unknown error submitting answer');
      setError(resultError);
      toast.error("Fehler beim Speichern der Antwort.");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    submitAnswer,
    updating,
    error
  };
}
