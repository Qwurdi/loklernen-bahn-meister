
import { useState, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeHandlerProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
  dragThreshold?: number;
}

interface DragState {
  startX: number | null;
  startY: number | null;
  dragDelta: number;
  isDragging: boolean;
}

export default function useCardSwipe({
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  dragThreshold = 100
}: SwipeHandlerProps) {
  const [dragState, setDragState] = useState<DragState>({
    startX: null,
    startY: null,
    dragDelta: 0,
    isDragging: false
  });
  
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Memoize touch handlers to prevent unnecessary recreation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || !isMobile) return;
    
    // Prevent default to disable scrolling
    e.preventDefault();
    
    const touch = e.touches[0];
    setDragState({
      startX: touch.clientX,
      startY: touch.clientY,
      dragDelta: 0,
      isDragging: true
    });
  }, [disabled, isMobile]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !isMobile) return;
    
    setDragState(prevState => {
      if (!prevState.startX || !prevState.isDragging) {
        return prevState;
      }
      
      // Always prevent default to stop scrolling
      e.preventDefault();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - prevState.startX;
      const deltaY = Math.abs(touch.clientY - (prevState.startY || 0));
      
      // Vertical deadzone of 40px - ignore swipes that are primarily vertical
      if (deltaY <= 40) {
        setSwipeDirection(deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : null);
        
        // Provide haptic feedback at threshold
        if (Math.abs(deltaX) > dragThreshold / 2 && 
            Math.abs(deltaX) < dragThreshold / 2 + 5 && 
            navigator.vibrate) {
          navigator.vibrate(5);
        }
        
        return {
          ...prevState,
          dragDelta: deltaX
        };
      }
      
      return prevState;
    });
  }, [disabled, isMobile, dragThreshold]);
  
  const handleTouchEnd = useCallback(() => {
    if (disabled || !isMobile) return;
    
    setDragState(prevState => {
      if (!prevState.startX || !prevState.isDragging) {
        return prevState;
      }
      
      const { dragDelta } = prevState;
      
      if (dragDelta > dragThreshold) {
        // Swipe right - known
        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        onSwipeRight?.();
      } else if (dragDelta < -dragThreshold) {
        // Swipe left - not known
        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        onSwipeLeft?.();
      } else {
        // Reset to center position - no action
        setSwipeDirection(null);
      }
      
      return {
        startX: null,
        startY: null,
        dragDelta: 0,
        isDragging: false
      };
    });
  }, [disabled, isMobile, dragThreshold, onSwipeRight, onSwipeLeft]);

  return {
    cardRef,
    dragState,
    swipeDirection,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
}
