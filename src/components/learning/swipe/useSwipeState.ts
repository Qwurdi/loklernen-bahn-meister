
import { useState, useCallback } from 'react';
import { SwipeState } from './types';

export function useSwipeState() {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    dragDelta: 0,
    isDragging: false,
    swipeDirection: null
  });

  const updateSwipeState = useCallback((updates: Partial<SwipeState>) => {
    setSwipeState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSwipeState = useCallback(() => {
    setSwipeState({
      dragDelta: 0,
      isDragging: false,
      swipeDirection: null
    });
  }, []);

  return {
    swipeState,
    updateSwipeState,
    resetSwipeState
  };
}
