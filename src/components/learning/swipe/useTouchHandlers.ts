
import { useRef, useCallback } from 'react';
import { SwipeState, TouchPosition } from './types';

interface TouchHandlersProps {
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
  disableSwipe: boolean;
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
  disableSwipe
}: TouchHandlersProps) {
  const touchStart = useRef<TouchPosition | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disableSwipe || isAnswered) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    updateSwipeState({ isDragging: true });
  }, [disableSwipe, isAnswered, updateSwipeState]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disableSwipe || isAnswered || !touchStart.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    
    // Only horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) * 2) {
      const direction = deltaX > 0 ? 'right' : 'left';
      updateSwipeState({ 
        dragDelta: deltaX,
        swipeDirection: Math.abs(deltaX) > 50 ? direction : null
      });
    }
  }, [disableSwipe, isAnswered, updateSwipeState]);

  const handleTouchEnd = useCallback(() => {
    if (disableSwipe || isAnswered || !touchStart.current) return;

    const { dragDelta } = swipeState;
    const swipeThreshold = 100;

    if (Math.abs(dragDelta) > swipeThreshold) {
      // Trigger swipe action
      if (dragDelta > 0) {
        animateSwipe('right');
        setTimeout(() => {
          onSwipeRight();
          resetSwipeState();
        }, 300);
      } else {
        animateSwipe('left');
        setTimeout(() => {
          onSwipeLeft();
          resetSwipeState();
        }, 300);
      }
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([10, 50, 10]);
      }
    } else {
      // Reset position
      resetCardPosition();
      resetSwipeState();
      
      // If it's a tap and card is not flipped, show answer
      if (!isFlipped && Math.abs(dragDelta) < 10) {
        if (onTap) {
          onTap();
        } else {
          onShowAnswer();
        }
      }
    }

    touchStart.current = null;
  }, [disableSwipe, isAnswered, swipeState, animateSwipe, onSwipeRight, onSwipeLeft, resetSwipeState, resetCardPosition, isFlipped, onShowAnswer, onTap]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
