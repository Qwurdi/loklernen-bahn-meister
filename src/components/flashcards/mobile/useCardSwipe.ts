
import { useRef } from "react";
import { SwipeHandlerProps, SWIPE_THRESHOLD } from "./swipe-types";
import { useTouchHandlers } from "./use-touch-handlers";
import { useCardAnimation } from "./use-card-animation";

export { SWIPE_THRESHOLD } from "./swipe-types";
export { VERTICAL_DEADZONE, MAX_ROTATION } from "./swipe-types";

export function useCardSwipe(props: SwipeHandlerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use touch handlers to manage swipe state and events
  const { swipeState, handlers } = useTouchHandlers(props, cardRef);
  
  // Get animation and styling utilities
  const { getCardStyle, getCardClasses } = useCardAnimation(cardRef);
  
  return {
    cardRef,
    swipeState,
    handlers,
    getCardStyle: () => getCardStyle(swipeState),
    getCardClasses: () => getCardClasses(swipeState.swipeDirection)
  };
}
