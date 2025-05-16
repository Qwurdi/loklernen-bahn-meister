
import { useState } from "react";
import { SwipeState } from "./types";

// Hook for managing swipe state
export function useSwipeState() {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    dragStartX: null,
    dragStartY: null,
    dragDelta: 0,
    isDragging: false,
    swipeDirection: null
  });
  
  const resetSwipeState = () => {
    setSwipeState({
      dragStartX: null,
      dragStartY: null,
      dragDelta: 0,
      isDragging: false,
      swipeDirection: null
    });
  };
  
  const updateSwipeState = (updates: Partial<SwipeState>) => {
    setSwipeState(prev => ({
      ...prev,
      ...updates
    }));
  };

  return {
    swipeState,
    updateSwipeState,
    resetSwipeState
  };
}
