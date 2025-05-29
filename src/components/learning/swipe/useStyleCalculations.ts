
import { useCallback } from 'react';
import { SwipeState } from './types';

export function useStyleCalculations(isFlipped: boolean, disableSwipe: boolean) {
  const getCardStyle = useCallback((swipeState: SwipeState) => {
    if (!isFlipped || disableSwipe || !swipeState.isDragging) {
      return {};
    }

    const { dragDelta } = swipeState;
    const rotation = dragDelta * 0.1;
    const opacity = Math.max(0.8, 1 - Math.abs(dragDelta) * 0.002);

    return {
      transform: `translateX(${dragDelta}px) rotate(${rotation}deg)`,
      opacity,
      transition: swipeState.isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
    };
  }, [isFlipped, disableSwipe]);

  const getCardClasses = useCallback((swipeDirection: 'left' | 'right' | null) => {
    let classes = 'transition-transform';
    
    if (swipeDirection === 'left') {
      classes += ' border-red-200 shadow-red-100';
    } else if (swipeDirection === 'right') {
      classes += ' border-green-200 shadow-green-100';
    }
    
    return classes;
  }, []);

  return {
    getCardStyle,
    getCardClasses
  };
}
