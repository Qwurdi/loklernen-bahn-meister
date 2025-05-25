
import { useCallback, useRef, useEffect } from 'react';

interface AnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  onComplete?: () => void;
}

interface SpringConfig {
  tension?: number;
  friction?: number;
  velocity?: number;
}

export function useEnhancedAnimations() {
  const animationRef = useRef<number>();

  const animate = useCallback((
    element: HTMLElement,
    from: Record<string, number>,
    to: Record<string, number>,
    config: AnimationConfig = {}
  ) => {
    const {
      duration = 300,
      easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      delay = 0,
      onComplete
    } = config;

    // Apply initial values
    Object.entries(from).forEach(([prop, value]) => {
      if (prop === 'x' || prop === 'y' || prop === 'z') {
        const current = element.style.transform || '';
        const newTransform = current.replace(/translate3d\([^)]*\)/, '') + 
          ` translate3d(${prop === 'x' ? value : 0}px, ${prop === 'y' ? value : 0}px, ${prop === 'z' ? value : 0}px)`;
        element.style.transform = newTransform.trim();
      } else if (prop === 'scale') {
        element.style.transform = `${element.style.transform || ''} scale(${value})`.trim();
      } else if (prop === 'opacity') {
        element.style.opacity = value.toString();
      }
    });

    // Set up transition
    element.style.transition = `all ${duration}ms ${easing}`;
    
    // Apply target values after delay
    setTimeout(() => {
      Object.entries(to).forEach(([prop, value]) => {
        if (prop === 'x' || prop === 'y' || prop === 'z') {
          const current = element.style.transform || '';
          const newTransform = current.replace(/translate3d\([^)]*\)/, '') + 
            ` translate3d(${prop === 'x' ? value : 0}px, ${prop === 'y' ? value : 0}px, ${prop === 'z' ? value : 0}px)`;
          element.style.transform = newTransform.trim();
        } else if (prop === 'scale') {
          element.style.transform = `${element.style.transform || ''} scale(${value})`.trim();
        } else if (prop === 'opacity') {
          element.style.opacity = value.toString();
        }
      });

      if (onComplete) {
        setTimeout(onComplete, duration);
      }
    }, delay);
  }, []);

  const spring = useCallback((
    element: HTMLElement,
    to: Record<string, number>,
    config: SpringConfig = {}
  ) => {
    const { tension = 300, friction = 20 } = config;
    
    // Simplified spring animation using CSS
    element.style.transition = `all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    
    Object.entries(to).forEach(([prop, value]) => {
      if (prop === 'x' || prop === 'y') {
        element.style.transform = `translate3d(${prop === 'x' ? value : 0}px, ${prop === 'y' ? value : 0}px, 0)`;
      } else if (prop === 'scale') {
        element.style.transform = `${element.style.transform || ''} scale(${value})`.trim();
      }
    });
  }, []);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    animate,
    spring,
    cleanup
  };
}
