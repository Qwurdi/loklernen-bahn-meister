
export interface SwipeState {
  dragStartX: number | null;
  dragStartY: number | null;
  dragDelta: number;
  isDragging: boolean;
  swipeDirection: 'left' | 'right' | null;
}

export interface SwipeProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowAnswer: () => void;
  isFlipped: boolean;
  isAnswered: boolean;
  disableSwipe: boolean;
}
