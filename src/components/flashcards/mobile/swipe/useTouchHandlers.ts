
import { useCallback } from "react";
import { VERTICAL_DEADZONE, SWIPE_THRESHOLD } from "./constants";
import { SwipeState } from "./types";

interface TouchHandlerParams {
  swipeState: SwipeState;
  updateSwipeState: (updates: Partial<SwipeState>) => void;
  resetSwipeState: () => void;
  animateSwipe: (direction: "left" | "right") => void;
  resetCardPosition: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowAnswer?: () => void;
  isFlipped: boolean;
  isAnswered: boolean;
  disableSwipe: boolean;
}

// Hook for handling touch interactions
export function useTouchHandlers({
  swipeState,
  updateSwipeState,
  resetSwipeState,
  animateSwipe,
  resetCardPosition,
  onSwipeLeft,
  onSwipeRight,
  onShowAnswer,
  isFlipped,
  isAnswered,
  disableSwipe
}: TouchHandlerParams) {
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Don't capture if swipe is disabled and card is flipped
    if (disableSwipe && isFlipped) return;
    
    // Immediately prevent default to stop scrolling
    e.preventDefault();
    
    // Always capture start position, even if not flipped
    updateSwipeState({
      dragStartX: e.touches[0].clientX,
      dragStartY: e.touches[0].clientY,
      isDragging: true,
      swipeDirection: null
    });
  }, [disableSwipe, isFlipped, updateSwipeState]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Don't handle move if swipe is disabled and card is flipped
    if (disableSwipe && isFlipped) return;
    
    // Always prevent default for touch move on cards
    e.preventDefault();
    
    const { dragStartX, dragStartY } = swipeState;
    
    if (dragStartX === null || isAnswered) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - dragStartX;
    const deltaY = Math.abs(currentY - (dragStartY || 0));
    
    // Allow swiping regardless of card side (flip status)
    if (deltaY <= VERTICAL_DEADZONE) {
      updateSwipeState({
        dragDelta: deltaX,
        swipeDirection: deltaX > 0 ? "right" : "left"
      });
      
      // Provide haptic feedback at threshold points
      if (Math.abs(deltaX) > SWIPE_THRESHOLD / 2 && 
          Math.abs(deltaX) < SWIPE_THRESHOLD / 2 + 5 && 
          navigator.vibrate) {
        navigator.vibrate(5); // subtle haptic feedback
      }
    }
  }, [disableSwipe, isFlipped, isAnswered, swipeState, updateSwipeState]);
  
  const handleTouchEnd = useCallback(() => {
    // Don't handle end if swipe is disabled and card is flipped
    if (disableSwipe && isFlipped) return;
    
    const { dragStartX, dragDelta } = swipeState;
    
    if (dragStartX === null || isAnswered) return;
    
    // Only process swipe actions if card is flipped (looking at answer)
    if (isFlipped) {
      const threshold = SWIPE_THRESHOLD;
      
      if (dragDelta > threshold) {
        // Swipe right = known, add animation before callback
        updateSwipeState({ swipeDirection: "right" });
        animateSwipe("right");
        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        setTimeout(() => onSwipeRight(), 300);
      } else if (dragDelta < -threshold) {
        // Swipe left = not known, add animation before callback
        updateSwipeState({ swipeDirection: "left" });
        animateSwipe("left");
        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        setTimeout(() => onSwipeLeft(), 300);
      } else {
        // Return to center with spring effect
        resetCardPosition();
      }
    } else if (Math.abs(dragDelta) > SWIPE_THRESHOLD && !isFlipped && onShowAnswer) {
      // If swiping significantly on question side, show answer
      onShowAnswer();
    } else {
      // Return to center
      resetCardPosition();
    }
    
    // Reset touch tracking variables
    resetSwipeState();
  }, [
    disableSwipe, 
    isFlipped, 
    isAnswered, 
    swipeState, 
    updateSwipeState, 
    resetSwipeState, 
    animateSwipe, 
    resetCardPosition, 
    onSwipeRight, 
    onSwipeLeft, 
    onShowAnswer
  ]);
  
  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
