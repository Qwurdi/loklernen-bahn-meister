
import { useState, useRef } from 'react';

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
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    // Prevent default to disable scrolling
    e.preventDefault();
    
    const touch = e.touches[0];
    setDragState({
      startX: touch.clientX,
      startY: touch.clientY,
      dragDelta: 0,
      isDragging: true
    });
  };
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !dragState.startX || !dragState.isDragging) return;
    
    // Always prevent default to stop scrolling
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragState.startX;
    const deltaY = Math.abs(touch.clientY - (dragState.startY || 0));
    
    // Vertical deadzone of 40px - ignore swipes that are primarily vertical
    if (deltaY <= 40) {
      setDragState(prev => ({
        ...prev,
        dragDelta: deltaX
      }));
      
      setSwipeDirection(deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : null);
      
      // Provide haptic feedback at threshold
      if (Math.abs(deltaX) > dragThreshold / 2 && 
          Math.abs(deltaX) < dragThreshold / 2 + 5 && 
          navigator.vibrate) {
        navigator.vibrate(5);
      }
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    if (disabled || !dragState.startX || !dragState.isDragging) return;
    
    const { dragDelta } = dragState;
    
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
    
    // Reset drag state
    setDragState({
      startX: null,
      startY: null,
      dragDelta: 0,
      isDragging: false
    });
  };

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
