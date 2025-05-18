
import { useRef } from "react";
import { SwipeHandlerProps } from "./types";
import { useSwipeState } from "./useSwipeState";
import { useAnimations } from "./useAnimations";
import { useStyleCalculations } from "./useStyleCalculations";
import { useTouchHandlers } from "./useTouchHandlers";

// Main hook that composes all the swipe functionality
export function useCardSwipe({
  onSwipeLeft,
  onSwipeRight,
  onShowAnswer,
  isFlipped,
  isAnswered,
  disableSwipe = false
}: SwipeHandlerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { swipeState, updateSwipeState, resetSwipeState } = useSwipeState();
  const { resetCardPosition, animateSwipe } = useAnimations(cardRef);
  const { getCardStyle, getCardClasses } = useStyleCalculations(disableSwipe, isFlipped);
  
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
    disableSwipe: disableSwipe || false
  });

  return {
    cardRef,
    swipeState,
    handlers,
    getCardStyle: () => getCardStyle(swipeState),
    getCardClasses: () => getCardClasses(swipeState.swipeDirection)
  };
}
