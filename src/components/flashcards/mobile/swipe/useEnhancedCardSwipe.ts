
import { useRef } from 'react';
import { SwipeProps } from './types';
import { useSwipeState } from './useSwipeState';
import { useAnimations } from './useAnimations';
import { useStyleCalculations } from './useStyleCalculations';
import { useTouchHandlers } from './useTouchHandlers';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useVisualFeedback } from '@/hooks/useVisualFeedback';
import { useEnhancedAnimations } from '@/hooks/useEnhancedAnimations';

export function useEnhancedCardSwipe({
  onSwipeLeft,
  onSwipeRight,
  onShowAnswer,
  isFlipped,
  isAnswered,
  disableSwipe
}: SwipeProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { swipeState, updateSwipeState, resetSwipeState } = useSwipeState();
  const { resetCardPosition, animateSwipe } = useAnimations(cardRef);
  const { getCardStyle, getCardClasses } = useStyleCalculations(isFlipped, disableSwipe);
  const haptic = useHapticFeedback();
  const visualFeedback = useVisualFeedback();
  const { animate, spring } = useEnhancedAnimations();

  // Enhanced handlers with haptic and visual feedback
  const enhancedHandlers = useTouchHandlers({
    swipeState,
    updateSwipeState,
    resetSwipeState,
    animateSwipe: (direction: 'left' | 'right') => {
      if (!cardRef.current) return;
      
      // Add haptic feedback based on direction
      if (direction === 'right') {
        haptic.success();
        visualFeedback.showFeedback(cardRef.current, { type: 'success', intensity: 'medium' });
      } else {
        haptic.error();
        visualFeedback.showFeedback(cardRef.current, { type: 'error', intensity: 'medium' });
      }
      
      // Enhanced spring animation
      const targetX = direction === 'right' ? window.innerWidth * 1.2 : -window.innerWidth * 1.2;
      spring(cardRef.current, { x: targetX, scale: 0.9 });
      
      animateSwipe(direction);
    },
    resetCardPosition: () => {
      if (!cardRef.current) return;
      
      haptic.light();
      spring(cardRef.current, { x: 0, scale: 1 });
      resetCardPosition();
    },
    onSwipeLeft,
    onSwipeRight,
    onShowAnswer: () => {
      haptic.medium();
      if (cardRef.current) {
        visualFeedback.showFeedback(cardRef.current, { type: 'info', intensity: 'subtle' });
      }
      onShowAnswer();
    },
    isFlipped,
    isAnswered,
    disableSwipe
  });

  // Enhanced card tap with micro-interaction
  const handleCardTap = () => {
    if (!isFlipped && cardRef.current) {
      haptic.selection();
      visualFeedback.pulseHighlight(cardRef.current);
      
      // Subtle bounce animation
      animate(cardRef.current, { scale: 1 }, { scale: 1.02 }, {
        duration: 150,
        onComplete: () => {
          if (cardRef.current) {
            animate(cardRef.current, { scale: 1.02 }, { scale: 1 }, { duration: 150 });
          }
        }
      });
      
      setTimeout(() => {
        onShowAnswer();
      }, 100);
    }
  };

  return {
    cardRef,
    swipeState,
    handlers: enhancedHandlers,
    getCardStyle: () => getCardStyle(swipeState),
    getCardClasses: () => getCardClasses(swipeState.swipeDirection),
    handleCardTap
  };
}
