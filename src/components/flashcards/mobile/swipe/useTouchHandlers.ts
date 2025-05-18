
import { SWIPE_THRESHOLD } from "./constants";
import { SwipeState } from "./types";

interface TouchHandlerOptions {
  swipeState: SwipeState;
  updateSwipeState: (updates: Partial<SwipeState>) => void;
  resetSwipeState: () => void;
  animateSwipe: (direction: "left" | "right") => void;
  resetCardPosition: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowAnswer: () => void;
  isFlipped: boolean;
  isAnswered: boolean;
  disableSwipe: boolean;
}

export function useTouchHandlers(options: TouchHandlerOptions) {
  const {
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
  } = options;
  
  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    // If already answered or disabled, ignore
    if (isAnswered || (isFlipped && disableSwipe)) return;
    
    const touch = e.touches[0];
    updateSwipeState({
      dragStartX: touch.clientX,
      dragStartY: touch.clientY,
      isDragging: true
    });
    
    // Prevent default only for horizontal drags to avoid scroll blocking
    e.preventDefault();
  };
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    const { dragStartX, dragStartY } = swipeState;
    
    // If no drag start or already answered or disabled, ignore
    if (dragStartX === null || dragStartY === null || isAnswered || (isFlipped && disableSwipe)) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartX;
    const deltaY = touch.clientY - dragStartY;
    
    // If this is primarily a vertical drag, let the browser handle it (scrolling)
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
      return;
    }
    
    // Prevent default to stop browser behaviors like scrolling
    e.preventDefault();
    
    // If not flipped, only allow drag to show answer by tapping, no full swipes
    if (!isFlipped) {
      return;
    }
    
    // Update drag delta for visual feedback
    updateSwipeState({
      dragDelta: deltaX,
      swipeDirection: deltaX > 0 ? "right" : deltaX < 0 ? "left" : null
    });
    
    // Calculate percentage for haptic feedback thresholds
    const thresholdPercentage = Math.abs(deltaX) / SWIPE_THRESHOLD;
    
    // Provide haptic feedback at 25%, 50%, 75% of threshold
    if (navigator.vibrate) {
      if (thresholdPercentage > 0.25 && thresholdPercentage < 0.27) {
        navigator.vibrate(5);
      } else if (thresholdPercentage > 0.5 && thresholdPercentage < 0.52) {
        navigator.vibrate(5);
      } else if (thresholdPercentage > 0.75 && thresholdPercentage < 0.77) {
        navigator.vibrate(10);
      }
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    const { dragStartX, dragDelta } = swipeState;
    
    // If no drag start or already answered or disabled, ignore
    if (dragStartX === null || isAnswered || (isFlipped && disableSwipe)) {
      resetSwipeState();
      return;
    }
    
    // If card is not flipped, handle tap to show answer
    if (!isFlipped) {
      // If it's a small drag/tap, show the answer
      if (Math.abs(dragDelta) < 20) {
        onShowAnswer();
      }
      resetCardPosition();
      resetSwipeState();
      return;
    }
    
    // Determine if swipe was significant enough
    if (dragDelta > SWIPE_THRESHOLD) {
      // Swipe right - mark as known
      animateSwipe("right");
      
      // Vibrate to indicate success
      if (navigator.vibrate) {
        navigator.vibrate([10, 30, 10]);
      }
      
      // Trigger action after animation
      setTimeout(() => {
        onSwipeRight();
        resetSwipeState();
      }, 300);
    } else if (dragDelta < -SWIPE_THRESHOLD) {
      // Swipe left - mark as not known
      animateSwipe("left");
      
      // Vibrate to indicate "not known"
      if (navigator.vibrate) {
        navigator.vibrate([10, 30, 10]);
      }
      
      // Trigger action after animation
      setTimeout(() => {
        onSwipeLeft();
        resetSwipeState();
      }, 300);
    } else {
      // Not enough to trigger action, reset position
      resetCardPosition();
      resetSwipeState();
    }
  };
  
  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
