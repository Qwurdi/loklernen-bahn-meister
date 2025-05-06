
import { useCallback } from 'react';
import { DragState } from './swipe-types';

interface DragHandlerProps {
  disabled: boolean;
  isMobile: boolean;
  dragState: DragState;
  setDragState: React.Dispatch<React.SetStateAction<DragState>>;
  dragThreshold: number;
  setSwipeDirection: React.Dispatch<React.SetStateAction<'left' | 'right' | null>>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  triggerThresholdFeedback: () => void;
  triggerSwipeFeedback: () => void;
}

export function useDragHandlers({
  disabled,
  isMobile,
  dragState,
  setDragState,
  dragThreshold,
  setSwipeDirection,
  onSwipeLeft,
  onSwipeRight,
  triggerThresholdFeedback,
  triggerSwipeFeedback
}: DragHandlerProps) {
  
  // Handle touch start event
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
  }, [disabled, isMobile, setDragState]);
  
  // Handle touch move event
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
            Math.abs(deltaX) < dragThreshold / 2 + 5) {
          triggerThresholdFeedback();
        }
        
        return {
          ...prevState,
          dragDelta: deltaX
        };
      }
      
      return prevState;
    });
  }, [disabled, isMobile, dragThreshold, setDragState, setSwipeDirection, triggerThresholdFeedback]);
  
  // Handle touch end event
  const handleTouchEnd = useCallback(() => {
    if (disabled || !isMobile) return;
    
    setDragState(prevState => {
      if (!prevState.startX || !prevState.isDragging) {
        return prevState;
      }
      
      const { dragDelta } = prevState;
      
      if (dragDelta > dragThreshold) {
        // Swipe right - known
        triggerSwipeFeedback();
        onSwipeRight?.();
      } else if (dragDelta < -dragThreshold) {
        // Swipe left - not known
        triggerSwipeFeedback();
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
  }, [disabled, isMobile, dragThreshold, onSwipeRight, onSwipeLeft, setDragState, setSwipeDirection, triggerSwipeFeedback]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
