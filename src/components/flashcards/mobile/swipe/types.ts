
// Type definitions for swipe functionality

export interface SwipeHandlerProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowAnswer?: () => void;
  isFlipped: boolean;
  isAnswered: boolean;
  disableSwipe?: boolean; // Prop to disable swipes (for MC questions)
}

export interface SwipeState {
  dragStartX: number | null;
  dragStartY: number | null;
  dragDelta: number;
  isDragging: boolean;
  swipeDirection: "left" | "right" | null;
}
