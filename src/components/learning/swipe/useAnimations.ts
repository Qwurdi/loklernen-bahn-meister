
import { useCallback } from 'react';

export function useAnimations(cardRef: React.RefObject<HTMLDivElement>) {
  const resetCardPosition = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0px) rotate(0deg)';
      cardRef.current.style.transition = 'transform 0.3s ease-out';
    }
  }, [cardRef]);

  const animateSwipe = useCallback((direction: 'left' | 'right') => {
    if (cardRef.current) {
      const translateX = direction === 'left' ? -100 : 100;
      const rotate = direction === 'left' ? -10 : 10;
      
      cardRef.current.style.transform = `translateX(${translateX}vw) rotate(${rotate}deg)`;
      cardRef.current.style.transition = 'transform 0.3s ease-out';
    }
  }, [cardRef]);

  return {
    resetCardPosition,
    animateSwipe
  };
}
