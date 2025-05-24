
import { useState } from 'react';
import { Question } from '@/types/questions';
import { UserProgress } from './types';

export function useLoadingState() {
  const [loading, setLoading] = useState(true);
  const [dueQuestions, setDueQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [error, setError] = useState<Error | null>(null);

  return {
    loading,
    setLoading,
    dueQuestions,
    setDueQuestions,
    progress,
    setProgress,
    error,
    setError
  };
}
