
import { SwipeState, SwipeProps } from './types';

interface TouchHandlersDeps extends SwipeProps {
  swipeState: SwipeState;
  updateSwipeState: (updates: Partial<SwipeState>) => void;
  resetSwipeState: () => void;
  animateSwipe: (direction: 'left' | 'right') => void;
  resetCardPosition: () => void;
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
  isFlipped,
  isAnswered,
  disableSwipe
}: TouchHandlersDeps) {
  // Swipe distance threshold to trigger an action
  const SWIPE_THRESHOLD = 60;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default to disable scrolling
    e.preventDefault();
    
    // Skip if disabled
    if (isFlipped && disableSwipe) return;
    
    const touch = e.touches[0];
    updateSwipeState({
      dragStartX: touch.clientX,
      dragStartY: touch.clientY,
      isDragging: true,
      swipeDirection: null
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState.dragStartX || !swipeState.isDragging || (isFlipped && disableSwipe)) return;
    
    // Always prevent default to stop scrolling
    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeState.dragStartX;
    const deltaY = Math.abs(touch.clientY - (swipeState.dragStartY || 0));
    
    // Vertical deadzone of 20px - ignore swipes that are primarily vertical
    if (deltaY <= 20) {
      updateSwipeState({
        dragDelta: deltaX,
        swipeDirection: deltaX > 0 ? 'right' : (deltaX < 0 ? 'left' : null)
      });
      
      // Provide haptic feedback at threshold
      if (Math.abs(deltaX) > SWIPE_THRESHOLD / 2 && 
          Math.abs(deltaX) < SWIPE_THRESHOLD / 2 + 5 && 
          navigator.vibrate) {
        navigator.vibrate(5);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!swipeState.dragStartX || !swipeState.isDragging || (isFlipped && disableSwipe)) {
      resetSwipeState();
      return;
    }
    
    const { dragDelta } = swipeState;
    
    if (Math.abs(dragDelta) > SWIPE_THRESHOLD) {
      if (isFlipped) {
        // Only trigger actions when the card is flipped (answer side)
        if (dragDelta > 0) {
          // Swipe right - known
          updateSwipeState({ swipeDirection: 'right' });
          animateSwipe('right');
          
          // Add slight delay for animation
          setTimeout(() => {
            onSwipeRight();
          }, 300);
        } else {
          // Swipe left - not known
          updateSwipeState({ swipeDirection: 'left' });
          animateSwipe('left');
          
          // Add slight delay for animation
          setTimeout(() => {
            onSwipeLeft();
          }, 300);
        }
      } else {
        // If the card is not flipped (question side), show answer on any swipe
        onShowAnswer();
      }
    } else {
      // Reset position if swipe didn't reach threshold
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
