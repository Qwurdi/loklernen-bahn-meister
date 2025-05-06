
/**
 * Hook for providing haptic feedback during card interactions
 */

export function useHapticFeedback() {
  // Provide subtle haptic feedback at threshold points
  const triggerThresholdFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5); // subtle haptic feedback
    }
  };

  // Provide feedback for swipe completion
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
