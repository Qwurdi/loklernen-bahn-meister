
import { useState } from 'react';

interface PendingUpdate {
  questionId: string;
  score: number;
}

export function usePendingUpdates() {
  const [pendingUpdates, setPendingUpdates] = useState<PendingUpdate[]>([]);

  const addPendingUpdate = (questionId: string, score: number) => {
    setPendingUpdates(prev => [...prev, { questionId, score }]);
  };

  const clearPendingUpdates = () => {
    setPendingUpdates([]);
  };

  return {
    pendingUpdates,
    addPendingUpdate,
    clearPendingUpdates
  };
}
