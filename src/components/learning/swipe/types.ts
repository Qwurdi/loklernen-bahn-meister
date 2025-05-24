
export interface SwipeState {
  dragDelta: number;
  isDragging: boolean;
  swipeDirection: 'left' | 'right' | null;
}

export interface SwipeProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap: () => void;
  disabled?: boolean;
}

export interface TouchPosition {
  x: number;
  y: number;
  time: number;
}
