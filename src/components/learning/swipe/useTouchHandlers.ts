
import { useCallback } from 'react';
import { SwipeState, TouchPosition } from './types';

interface UseTouchHandlersProps {
  swipeState: SwipeState;
  updateSwipeState: (updates: Partial<SwipeState>) => void;
  resetSwipeState: () => void;
  animateSwipe: (direction: 'left' | 'right') => void;
  resetCardPosition: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowAnswer: () => void;
  onTap?: () => void;
  isFlipped: boolean;
  isAnswered: boolean;
  disableSwipe?: boolean;
}

export function useTouchHandlers({
  swipeState,
  updateSwipeState,
  resetSwipeState,
  animateSwipe,
  resetCardPosition,
  onSwipeLeft,
  onSwipeRight,
  onShowAnswer,
  onTap,
  isFlipped,
  isAnswered,
  disableSwipe = false
}: UseTouchHandlersProps) {
  const SWIPE_THRESHOLD = 100;
  const VELOCITY_THRESHOLD = 0.5;

  let startTouch: TouchPosition | null = null;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disableSwipe) return;
    
    const touch = e.touches[0];
    startTouch = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    updateSwipeState({ isDragging: true });
  }, [disableSwipe, updateSwipeState]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startTouch || disableSwipe || !swipeState.isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = touch.clientY - startTouch.y;
    
    // Prevent vertical scrolling if horizontal swipe is detected
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
    
    const direction = deltaX > 0 ? 'right' : 'left';
    
    updateSwipeState({
      dragDelta: deltaX,
      swipeDirection: Math.abs(deltaX) > 20 ? direction : null
    });
  }, [startTouch, disableSwipe, swipeState.isDragging, updateSwipeState]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!startTouch || disableSwipe) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = touch.clientY - startTouch.y;
    const deltaTime = Date.now() - startTouch.time;
    const velocity = Math.abs(deltaX) / deltaTime;
    
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const exceedsThreshold = Math.abs(deltaX) > SWIPE_THRESHOLD;
    const isFastSwipe = velocity > VELOCITY_THRESHOLD;
    
    if (isHorizontalSwipe && (exceedsThreshold || isFastSwipe)) {
      if (deltaX > 0) {
        animateSwipe('right');
        setTimeout(() => {
          onSwipeRight();
          resetSwipeState();
          resetCardPosition();
        }, 300);
      } else {
        animateSwipe('left');
        setTimeout(() => {
          onSwipeLeft();
          resetSwipeState();
          resetCardPosition();
        }, 300);
      }
    } else {
      // Reset position if swipe wasn't strong enough
      resetSwipeState();
      resetCardPosition();
    }
    
    startTouch = null;
  }, [startTouch, disableSwipe, animateSwipe, onSwipeLeft, onSwipeRight, resetSwipeState, resetCardPosition]);

  const handleCardTap = useCallback(() => {
    if (!isFlipped && !disableSwipe) {
      onShowAnswer();
    } else if (onTap) {
      onTap();
    }
  }, [isFlipped, disableSwipe, onShowAnswer, onTap]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleCardTap
  };
}
