
import { useState, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SwipeHandlerProps, DragState, SwipeResult } from './swipe-types';
import { useHapticFeedback } from './use-haptic-feedback';
import { useDragHandlers } from './use-drag-handlers';

export default function useCardSwipe({
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  dragThreshold = 100
}: SwipeHandlerProps): SwipeResult {
  const [dragState, setDragState] = useState<DragState>({
    startX: null,
    startY: null,
    dragDelta: 0,
    isDragging: false
  });
  
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { triggerThresholdFeedback, triggerSwipeFeedback } = useHapticFeedback();
  
  // Use extracted drag handlers
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useDragHandlers({
    disabled,
    isMobile,
    dragState,
    setDragState,
    dragThreshold,
    setSwipeDirection,
    onSwipeLeft,
    onSwipeRight,
    triggerThresholdFeedback,
    triggerSwipeFeedback
  });
  
  return {
    cardRef,
    dragState,
    swipeDirection,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
}
