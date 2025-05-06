
import { useMemo } from 'react';

/**
 * Calculate an appropriate text size class based on content length
 * to ensure text fits within its container
 */
export function useDynamicTextSize(content: string, type: 'question' | 'answer' = 'question'): string {
  return useMemo(() => {
    if (!content) return 'text-base';
    
    const textLength = content.length;
    
    // Different thresholds based on content type
    if (type === 'question') {
      if (textLength > 200) return 'text-sm leading-snug';
      if (textLength > 120) return 'text-base leading-snug';
      if (textLength > 80) return 'text-lg leading-snug';
      return 'text-xl leading-snug';
    } else {
      // Answer text typically needs to be more compact
      if (textLength > 300) return 'text-xs leading-tight';
      if (textLength > 200) return 'text-sm leading-tight';
      if (textLength > 100) return 'text-base leading-snug';
      return 'text-lg leading-snug';
    }
  }, [content, type]);
}
