
import { useCallback } from 'react';

interface HapticPattern {
  light: number[];
  medium: number[];
  heavy: number[];
  success: number[];
  error: number[];
  selection: number[];
}

const HAPTIC_PATTERNS: HapticPattern = {
  light: [10],
  medium: [20],
  heavy: [50],
  success: [10, 20, 10],
  error: [20, 10, 20, 10, 20],
  selection: [5]
};

export function useHapticFeedback() {
  const vibrate = useCallback((pattern: keyof HapticPattern) => {
    if (!navigator.vibrate) return;
    
    try {
      navigator.vibrate(HAPTIC_PATTERNS[pattern]);
    } catch (error) {
      console.debug('Haptic feedback not supported');
    }
  }, []);

  const vibrateCustom = useCallback((duration: number | number[]) => {
    if (!navigator.vibrate) return;
    
    try {
      navigator.vibrate(duration);
    } catch (error) {
      console.debug('Haptic feedback not supported');
    }
  }, []);

  return {
    light: () => vibrate('light'),
    medium: () => vibrate('medium'),
    heavy: () => vibrate('heavy'),
    success: () => vibrate('success'),
    error: () => vibrate('error'),
    selection: () => vibrate('selection'),
    custom: vibrateCustom
  };
}
