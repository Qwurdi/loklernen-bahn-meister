
import { useRef, useState, RefObject } from "react";

// Constants
const SWIPE_THRESHOLD = 100;
const MAX_ROTATION = 15;

// Types
export interface SwipeState {
  dragStartX: number | null;
  dragStartY: number | null;
  dragDelta: number;
  isDragging: boolean;
  swipeDirection: "left" | "right" | null;
}

export interface SwipeHandlerProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowAnswer: () => void;
  isFlipped: boolean;
  isAnswered: boolean;
  disableSwipe?: boolean;
}

/**
 * A hook that provides swipe functionality for mobile flashcards
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onShowAnswer,
  isFlipped,
  isAnswered,
  disableSwipe = false
}: SwipeHandlerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Swipe state
  const [swipeState, setSwipeState] = useState<SwipeState>({
    dragStartX: null,
    dragStartY: null,
    dragDelta: 0,
    isDragging: false,
    swipeDirection: null
  });
  
  // Reset swipe state
  const resetSwipeState = () => {
    setSwipeState({
      dragStartX: null,
      dragStartY: null,
      dragDelta: 0,
      isDragging: false,
      swipeDirection: null
    });
  };
  
  // Update swipe state
  const updateSwipeState = (updates: Partial<SwipeState>) => {
    setSwipeState(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Reset card position with animation
  const resetCardPosition = () => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    cardRef.current.style.transform = "translateX(0) rotate(0deg)";
    
    // Reset bg color after animation
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.backgroundColor = "";
      }
    }, 300);
  };

  // Animate card flying away
  const animateSwipe = (direction: "left" | "right") => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out";
    cardRef.current.style.transform = `translateX(${direction === "right" ? 150 : -150}%) rotate(${direction === "right" ? 15 : -15}deg)`;
    cardRef.current.style.opacity = "0.8";
  };

  // Calculate card styles during drag
  const getCardStyle = () => {
    const { dragDelta, isDragging } = swipeState;
    
    // No dragging allowed if card is flipped and swipe is disabled (for MC questions)
    if (disableSwipe && isFlipped) {
      return {
        transform: "none",
        transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease"
      };
    }
    
    if (dragDelta === 0) {
      return {
        transform: "none",
        transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease"
      };
    }
    
    // Calculate rotation based on drag distance, capped at MAX_ROTATION degrees
    const rotation = Math.min(Math.abs(dragDelta) * 0.08, MAX_ROTATION) * (dragDelta > 0 ? 1 : -1);
    
    // Calculate background color based on drag direction and distance
    const dragPercentage = Math.min(Math.abs(dragDelta) / SWIPE_THRESHOLD, 1); 
    const backgroundColor = dragDelta > 0 
      ? `rgba(209, 250, 229, ${dragPercentage * 0.7})` 
      : `rgba(254, 226, 226, ${dragPercentage * 0.7})`;
    
    return {
      transform: `translateX(${dragDelta * 1.1}px) rotate(${rotation}deg)`,
      backgroundColor,
      transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease"
    };
  };

  // Get appropriate card classes
  const getCardClasses = () => {
    return `relative p-4 min-h-[100%] flex flex-col bg-white rounded-xl shadow-md touch-none card-with-inertia ${
      swipeState.swipeDirection === "right" ? "animate-swipe-right" : 
      swipeState.swipeDirection === "left" ? "animate-swipe-left" : ""
    }`;
  };

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
    
    // Provide haptic feedback at thresholds
    if (navigator.vibrate) {
      const thresholdPercentage = Math.abs(deltaX) / SWIPE_THRESHOLD;
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
    cardRef,
    swipeState,
    handlers: {
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    },
    getCardStyle,
    getCardClasses
  };
}
