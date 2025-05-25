
import React, { useRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useVisualFeedback } from '@/hooks/useVisualFeedback';
import { useEnhancedAnimations } from '@/hooks/useEnhancedAnimations';

interface EnhancedButtonProps extends ButtonProps {
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'error';
  visualFeedback?: boolean;
  springAnimation?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    children, 
    onClick, 
    hapticType = 'light',
    visualFeedback = true,
    springAnimation = true,
    className,
    ...props 
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const haptic = useHapticFeedback();
    const feedback = useVisualFeedback();
    const { animate } = useEnhancedAnimations();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      // Haptic feedback
      haptic[hapticType]();

      // Visual feedback
      if (visualFeedback) {
        const feedbackType = hapticType === 'success' ? 'success' : 
                           hapticType === 'error' ? 'error' : 'neutral';
        feedback.showFeedback(button, { type: feedbackType, intensity: 'subtle' });
      }

      // Spring animation
      if (springAnimation) {
        animate(button, { scale: 1 }, { scale: 0.95 }, {
          duration: 100,
          onComplete: () => {
            animate(button, { scale: 0.95 }, { scale: 1 }, { duration: 150 });
          }
        });
      }

      // Call original onClick after micro-interaction
      setTimeout(() => {
        onClick?.(e);
      }, 50);
    };

    return (
      <Button
        ref={ref || buttonRef}
        onClick={handleClick}
        className={`relative overflow-hidden ${className || ''}`}
        {...props}
      >
        <div className="feedback-overlay absolute inset-0 opacity-0 transition-opacity duration-200 pointer-events-none" />
        {children}
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';
