
import { useState, useRef } from "react";

interface SwipeHandlerProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowAnswer?: () => void;
  isFlipped: boolean;
  isAnswered: boolean;
  disableSwipe?: boolean; // New prop to disable swipes (for MC questions)
}

interface SwipeState {
  dragStartX: number | null;
  dragStartY: number | null;
  dragDelta: number;
  isDragging: boolean;
  swipeDirection: "left" | "right" | null;
}

export const SWIPE_THRESHOLD = 60; // Lower threshold for easier swiping
export const VERTICAL_DEADZONE = 40; // Increased deadzone to prevent accidental scroll
export const MAX_ROTATION = 12; // Maximum rotation in degrees

export function useCardSwipe({
  onSwipeLeft,
  onSwipeRight,
  onShowAnswer,
  isFlipped,
  isAnswered,
  disableSwipe = false // Default to false for backward compatibility
}: SwipeHandlerProps) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    dragStartX: null,
    dragStartY: null,
    dragDelta: 0,
    isDragging: false,
    swipeDirection: null
  });
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Touch handling for swipe gestures with improved mechanics
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't capture if swipe is disabled and card is flipped
    if (disableSwipe && isFlipped) return;
    
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
      setSwipeState(prev => ({
        ...prev,
        dragDelta: deltaX,
        swipeDirection: deltaX > 0 ? "right" : "left"
      }));
      
      // Provide haptic feedback at threshold points
      if (Math.abs(deltaX) > SWIPE_THRESHOLD / 2 && 
          Math.abs(deltaX) < SWIPE_THRESHOLD / 2 + 5 && 
          navigator.vibrate) {
        navigator.vibrate(5); // subtle haptic feedback
      }
    }
  };
  
  const handleTouchEnd = () => {
    // Don't handle end if swipe is disabled and card is flipped
    if (disableSwipe && isFlipped) return;
    
    const { dragStartX, dragDelta } = swipeState;
    
    if (dragStartX === null || isAnswered) return;
    
    // Only process swipe actions if card is flipped (looking at answer)
    if (isFlipped) {
      const threshold = SWIPE_THRESHOLD;
      
      if (dragDelta > threshold) {
        // Swipe right = known, add animation before callback
        setSwipeState(prev => ({ ...prev, swipeDirection: "right" }));
        animateSwipe("right");
        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        setTimeout(() => onSwipeRight(), 300);
      } else if (dragDelta < -threshold) {
        // Swipe left = not known, add animation before callback
        setSwipeState(prev => ({ ...prev, swipeDirection: "left" }));
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
    setSwipeState({
      dragStartX: null,
      dragStartY: null,
      dragDelta: 0,
      isDragging: false,
      swipeDirection: null
    });
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

  // Function to animate card flying away
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
    const { swipeDirection } = swipeState;
    
    return `relative p-4 min-h-[calc(100vh-230px)] flex flex-col bg-white rounded-xl shadow-md touch-none card-with-inertia ${
      swipeDirection === "right" ? "animate-swipe-right" : 
      swipeDirection === "left" ? "animate-swipe-left" : ""
    }`;
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
