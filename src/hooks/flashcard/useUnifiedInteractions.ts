
import { useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { InteractionMode } from '@/types/flashcard';

interface UseUnifiedInteractionsProps {
  mode: InteractionMode;
  enabled: boolean;
  canFlip: boolean;
  canAnswer: boolean;
  onFlip: () => void;
  onAnswer: (score: number) => void;
  onNext?: () => void;
}

export function useUnifiedInteractions({
  mode,
  enabled,
  canFlip,
  canAnswer,
  onFlip,
  onAnswer,
  onNext
}: UseUnifiedInteractionsProps) {
  const isMobile = useIsMobile();

  // Keyboard interactions
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled || isMobile) return;

    switch (event.key) {
      case ' ':
      case 'Enter':
        if (canFlip) {
          event.preventDefault();
          onFlip();
        }
        break;
      case 'ArrowLeft':
      case 'n':
      case 'N':
        if (canAnswer) {
          event.preventDefault();
          onAnswer(1);
        }
        break;
      case 'ArrowRight':
      case 'y':
      case 'Y':
        if (canAnswer) {
          event.preventDefault();
          onAnswer(5);
        }
        break;
      case 'Escape':
        if (onNext) {
          event.preventDefault();
          onNext();
        }
        break;
    }
  }, [enabled, isMobile, canFlip, canAnswer, onFlip, onAnswer, onNext]);

  useEffect(() => {
    if (mode === 'keyboard' || mode === 'tap') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [mode, handleKeyPress]);

  return {
    keyboardEnabled: (mode === 'keyboard' || mode === 'tap') && !isMobile,
    swipeEnabled: mode === 'swipe' && isMobile,
    tapEnabled: mode === 'tap',
    buttonsEnabled: mode === 'buttons'
  };
}
