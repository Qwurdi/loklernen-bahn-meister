
import { useRef, useCallback } from 'react';

interface UseCardSwipeProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap: () => void;
  disabled?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export function useCardSwipe({ onSwipeLeft, onSwipeRight, onTap, disabled = false }: UseCardSwipeProps) {
  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchEnd.current = null;
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchStart.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [disabled]);

  const handleTouchEnd = useCallback(() => {
    if (disabled || !touchStart.current) return;

    const start = touchStart.current;
    const end = touchEnd.current;

    // Reset references
    touchStart.current = null;
    touchEnd.current = null;

    // If no movement, treat as tap
    if (!end) {
      onTap();
      return;
    }

    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const deltaTime = end.time - start.time;

    // Check if it's a tap (small movement, quick time)
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance < 10 && deltaTime < 300) {
      onTap();
      return;
    }

    // Check for horizontal swipe
    const minSwipeDistance = 50;
    const maxVerticalRatio = 0.5; // Max vertical movement relative to horizontal

    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < Math.abs(deltaX) * maxVerticalRatio) {
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }

      if (deltaX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
  }, [disabled, onSwipeLeft, onSwipeRight, onTap]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
}
