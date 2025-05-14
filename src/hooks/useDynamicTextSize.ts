
import { useMemo } from 'react';
import { useFullscreen } from './useFullscreen';

// Configuration values for different text lengths
const TEXT_SIZE_THRESHOLDS = {
  question: {
    short: 40,   // Characters
    medium: 80,  // Characters
    long: 150    // Characters
  },
  answer: {
    short: 50,   // Characters
    medium: 100,  // Characters
    long: 200    // Characters
  }
};

// More aggressive thresholds for clean mode
const CLEAN_MODE_TEXT_SIZE_THRESHOLDS = {
  question: {
    short: 30,   // Characters
    medium: 60,  // Characters
    long: 120    // Characters
  },
  answer: {
    short: 40,   // Characters
    medium: 80,  // Characters
    long: 160    // Characters
  }
};

type TextType = 'question' | 'answer';

export function useDynamicTextSize(text: string, type: TextType = 'question') {
  const { isCleanMode } = useFullscreen();
  
  return useMemo(() => {
    // Select the appropriate thresholds based on mode
    const thresholds = isCleanMode 
      ? CLEAN_MODE_TEXT_SIZE_THRESHOLDS[type]
      : TEXT_SIZE_THRESHOLDS[type];
      
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
  }, [text, type, isCleanMode]);
}
