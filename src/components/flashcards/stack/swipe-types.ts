
/**
 * Types related to card swiping functionality
 */

export interface SwipeHandlerProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
  dragThreshold?: number;
}

export interface DragState {
  startX: number | null;
  startY: number | null;
  dragDelta: number;
  isDragging: boolean;
}

export interface SwipeResult {
  cardRef: React.RefObject<HTMLDivElement>;
  dragState: DragState;
  swipeDirection: 'left' | 'right' | null;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}
