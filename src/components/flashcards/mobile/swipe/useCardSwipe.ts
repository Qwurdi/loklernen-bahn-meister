
import { useRef } from 'react';
import { SwipeProps } from './types';
import { useSwipeState } from './useSwipeState';
import { useAnimations } from './useAnimations';
import { useStyleCalculations } from './useStyleCalculations';
import { useTouchHandlers } from './useTouchHandlers';

export function useCardSwipe({
  onSwipeLeft,
  onSwipeRight,
  onShowAnswer,
  isFlipped,
  isAnswered,
  disableSwipe
}: SwipeProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { swipeState, updateSwipeState, resetSwipeState } = useSwipeState();
  const { resetCardPosition, animateSwipe } = useAnimations(cardRef);
  const { getCardStyle, getCardClasses } = useStyleCalculations(isFlipped, disableSwipe);

  const handlers = useTouchHandlers({
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
  });

  return {
    cardRef,
    swipeState,
    handlers,
    getCardStyle: () => getCardStyle(swipeState),
    getCardClasses: () => getCardClasses(swipeState.swipeDirection)
  };
}
