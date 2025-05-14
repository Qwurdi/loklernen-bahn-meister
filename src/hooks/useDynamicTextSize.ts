
import { useMemo } from 'react';

// Configuration values for different text lengths
const TEXT_SIZE_THRESHOLDS = {
  question: {
    short: 50,   // Characters
    medium: 100,  // Characters
    long: 200    // Characters
  },
  answer: {
    short: 60,   // Characters
    medium: 120,  // Characters
    long: 250    // Characters
  }
};

type TextType = 'question' | 'answer';

export function useDynamicTextSize(text: string, type: TextType = 'question') {
  return useMemo(() => {
    const thresholds = TEXT_SIZE_THRESHOLDS[type];
    const textLength = text.length;
    
    if (textLength > thresholds.long) {
      return 'text-xs'; // Very small for very long texts
    } else if (textLength > thresholds.medium) {
      return 'text-sm'; // Small for medium-length texts
    } else if (textLength > thresholds.short) {
      return 'text-base'; // Normal for short texts
    } else {
      return 'text-lg'; // Large for very short texts
    }
  }, [text, type]);
}
