
import { MAX_ROTATION, SWIPE_THRESHOLD } from "./constants";
import { SwipeState } from "./types";

// Hook for calculating styles based on swipe state
export function useStyleCalculations(disableSwipe: boolean, isFlipped: boolean) {
  
  // Calculate card styles during drag
  const getCardStyle = (swipeState: SwipeState) => {
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
  const getCardClasses = (swipeDirection: "left" | "right" | null) => {
    return `relative p-4 min-h-[calc(100vh-230px)] flex flex-col bg-white rounded-xl shadow-md touch-none card-with-inertia ${
      swipeDirection === "right" ? "animate-swipe-right" : 
      swipeDirection === "left" ? "animate-swipe-left" : ""
    }`;
  };
  
  return {
    getCardStyle,
    getCardClasses
  };
}
