
import { useRef } from 'react';
import { useSwipeState } from '@/components/learning/swipe/useSwipeState';
import { useAnimations } from '@/components/learning/swipe/useAnimations';
import { useStyleCalculations } from '@/components/learning/swipe/useStyleCalculations';
import { useTouchHandlers } from '@/components/learning/swipe/useTouchHandlers';

interface UseEnhancedCardSwipeProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowAnswer: () => void;
  isFlipped: boolean;
  isAnswered: boolean;
  disableSwipe?: boolean;
}

export function useEnhancedCardSwipe({
  onSwipeLeft,
  onSwipeRight,
  onShowAnswer,
  isFlipped,
  isAnswered,
  disableSwipe = false
}: UseEnhancedCardSwipeProps) {
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
    getCardClasses: () => getCardClasses(swipeState.swipeDirection),
    handleCardTap: handlers.handleCardTap
  };
}
