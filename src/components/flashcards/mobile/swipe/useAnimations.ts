
import { RefObject } from "react";

// Hook for handling card animations
export function useAnimations(cardRef: RefObject<HTMLDivElement>) {
  
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
  
  return {
    resetCardPosition,
    animateSwipe
  };
}
