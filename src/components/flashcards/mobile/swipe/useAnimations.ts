
import { MutableRefObject } from 'react';

export function useAnimations(cardRef: MutableRefObject<HTMLDivElement | null>) {
  const resetCardPosition = () => {
    if (!cardRef.current) return;

    cardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    cardRef.current.style.transform = 'translateX(0) rotate(0deg)';

    // Reset background color with slight delay
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.backgroundColor = '';
      }
    }, 300);
  };

  const animateSwipe = (direction: 'left' | 'right') => {
    if (!cardRef.current) return;

    const xTranslate = direction === 'right' ? '150%' : '-150%';
    const rotation = direction === 'right' ? '15deg' : '-15deg';

    cardRef.current.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out';
    cardRef.current.style.transform = `translateX(${xTranslate}) rotate(${rotation})`;
    cardRef.current.style.opacity = '0.8';
  };

  return {
    resetCardPosition,
    animateSwipe
  };
}
