
import { SwipeState } from './types';

export function useStyleCalculations(isFlipped: boolean, disableSwipe: boolean) {
  // Calculate styles based on swipe state
  const getCardStyle = (swipeState: SwipeState = { 
    dragStartX: null, 
    dragStartY: null, 
    dragDelta: 0, 
    isDragging: false, 
    swipeDirection: null 
  }) => {
    // If card is flipped and swipe is disabled, don't allow dragging
    if (isFlipped && disableSwipe) {
      return {
        transform: 'none',
        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease'
      };
    }

    // If not dragging or no drag delta, return default style
    if (!swipeState.isDragging || swipeState.dragDelta === 0) {
      return {
        transform: 'none',
        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease'
      };
    }

    // Calculate rotation based on drag distance (limited to +/- 10deg)
    const dragPercentage = Math.min(Math.abs(swipeState.dragDelta) / 200, 1);
    const rotationAngle = (swipeState.dragDelta > 0 ? 1 : -1) * Math.min(10 * dragPercentage, 10);
    
    // Calculate transform with slight resistance (drag less than actual finger movement)
    const translateX = swipeState.dragDelta * 1.1;
    
    // Set background color based on swipe direction
    const opacity = Math.min(0.2, Math.abs(swipeState.dragDelta) / 400);
    let backgroundColor: string;
    
    if (swipeState.dragDelta > 0) {
      // Right swipe - known - green tint
      backgroundColor = `rgba(209, 250, 229, ${opacity})`;
    } else {
      // Left swipe - not known - red tint
      backgroundColor = `rgba(254, 226, 226, ${opacity})`;
    }

    return {
      transform: `translateX(${translateX}px) rotate(${rotationAngle}deg)`,
      backgroundColor,
      transition: 'none'
    };
  };

  // Add animation classes based on swipe direction
  const getCardClasses = (direction: 'left' | 'right' | null = null) => {
    if (direction === 'right') {
      return 'card animate-swipe-right';
    } else if (direction === 'left') {
      return 'card animate-swipe-left';
    }
    return 'card';
  };

  return {
    getCardStyle,
    getCardClasses
  };
}
