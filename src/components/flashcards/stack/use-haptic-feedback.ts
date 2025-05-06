
/**
 * Hook for providing haptic feedback during swipe interactions
 */

export function useHapticFeedback() {
  const triggerThresholdFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5); // subtle haptic feedback
    }
  };
  
  const triggerSwipeFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate([10, 30, 10]); // pattern for swipe completion
    }
  };
  
  return {
    triggerThresholdFeedback,
    triggerSwipeFeedback
  };
}
