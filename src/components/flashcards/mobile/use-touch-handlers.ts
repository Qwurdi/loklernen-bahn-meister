
/**
 * Hook for handling touch events for mobile card interactions
 */
import { RefObject, useState } from "react";
import { SwipeState, SwipeHandlerProps, SWIPE_THRESHOLD, VERTICAL_DEADZONE } from "./swipe-types";
import { useHapticFeedback } from "./use-haptic-feedback";
import { useCardAnimation } from "./use-card-animation";

export function useTouchHandlers({
  onSwipeLeft,
  onSwipeRight,
  onShowAnswer,
  isFlipped,
  isAnswered
}: SwipeHandlerProps, cardRef: RefObject<HTMLDivElement>) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    dragStartX: null,
    dragStartY: null,
    dragDelta: 0,
    isDragging: false,
    swipeDirection: null
  });

  const { triggerThresholdFeedback, triggerSwipeFeedback } = useHapticFeedback();
  const { resetCardPosition, animateSwipe } = useCardAnimation(cardRef);
  
  // Touch handling for swipe gestures with improved mechanics
  const handleTouchStart = (e: React.TouchEvent) => {
    // Immediately prevent default to stop scrolling
    e.preventDefault();
    
    // Always capture start position, even if not flipped
    setSwipeState(prev => ({
      ...prev,
      dragStartX: e.touches[0].clientX,
      dragStartY: e.touches[0].clientY,
      isDragging: true,
      swipeDirection: null
    }));
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
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
      setSwipeState(prev => ({
        ...prev,
        dragDelta: deltaX,
        swipeDirection: deltaX > 0 ? "right" : "left"
      }));
      
      // Provide haptic feedback at threshold points
      if (Math.abs(deltaX) > SWIPE_THRESHOLD / 2 && 
          Math.abs(deltaX) < SWIPE_THRESHOLD / 2 + 5) {
        triggerThresholdFeedback();
      }
    }
  };
  
  const handleTouchEnd = () => {
    const { dragStartX, dragDelta } = swipeState;
    
    if (dragStartX === null || isAnswered) return;
    
    // Only process swipe actions if card is flipped (looking at answer)
    if (isFlipped) {
      const threshold = SWIPE_THRESHOLD;
      
      if (dragDelta > threshold) {
        // Swipe right = known, add animation before callback
        setSwipeState(prev => ({ ...prev, swipeDirection: "right" }));
        animateSwipe("right");
        triggerSwipeFeedback();
        setTimeout(() => onSwipeRight(), 300);
      } else if (dragDelta < -threshold) {
        // Swipe left = not known, add animation before callback
        setSwipeState(prev => ({ ...prev, swipeDirection: "left" }));
        animateSwipe("left");
        triggerSwipeFeedback();
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
    handlers: {
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    }
  };
}
