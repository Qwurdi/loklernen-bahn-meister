
/**
 * Types related to mobile card swipe functionality
 */

export interface SwipeHandlerProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onShowAnswer?: () => void;
  isFlipped: boolean;
  isAnswered: boolean;
}

export interface SwipeState {
  dragStartX: number | null;
  dragStartY: number | null;
  dragDelta: number;
  isDragging: boolean;
  swipeDirection: "left" | "right" | null;
}

// Constants for swipe thresholds and behavior
export const SWIPE_THRESHOLD = 60; // Lower threshold for easier swiping
export const VERTICAL_DEADZONE = 40; // Increased deadzone to prevent accidental scroll
export const MAX_ROTATION = 12; // Maximum rotation in degrees
