
/**
 * Hook for handling the animation and styling logic for mobile card swipes
 */
import { RefObject } from "react";
import { SwipeState, SWIPE_THRESHOLD } from "./swipe-types";

export function useCardAnimation(cardRef: RefObject<HTMLDivElement>) {
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
  const getCardStyle = (swipeState: SwipeState) => {
    const { dragDelta, isDragging } = swipeState;
    
    if (dragDelta === 0) {
      return {
        transform: "none",
        transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease"
      };
    }
    
    // Calculate rotation based on drag distance, capped at MAX_ROTATION degrees
    const rotation = Math.min(Math.abs(dragDelta) * 0.08, 12) * (dragDelta > 0 ? 1 : -1);
    
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
    resetCardPosition,
    animateSwipe,
    getCardStyle,
    getCardClasses
  };
}
