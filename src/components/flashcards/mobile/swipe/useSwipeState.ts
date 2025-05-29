
import { useState } from 'react';
import { SwipeState } from './types';

export function useSwipeState() {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    dragStartX: null,
    dragStartY: null,
    dragDelta: 0,
    isDragging: false,
    swipeDirection: null
  });

  const updateSwipeState = (updates: Partial<SwipeState>) => {
    setSwipeState(prev => ({ ...prev, ...updates }));
  };

  const resetSwipeState = () => {
    setSwipeState({
      dragStartX: null,
      dragStartY: null,
      dragDelta: 0,
      isDragging: false,
      swipeDirection: null
    });
  };

  return {
    swipeState,
    updateSwipeState,
    resetSwipeState
  };
}
