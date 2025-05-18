
import { useEffect, useState } from 'react';
import { StructuredContent } from "@/types/rich-text";

type TextContent = string | StructuredContent;

const getTextLength = (content: TextContent): number => {
  if (typeof content === 'string') {
    return content.length;
  }
  
  // For StructuredContent, we'll use a simple approximation
  // This could be improved with a more sophisticated parsing
  if (content && Array.isArray(content)) {
    return content.reduce((total, item) => {
      if (typeof item === 'string') {
        return total + item.length;
      } else if (item.text) {
        return total + item.text.length;
      }
      return total;
    }, 0);
  }
  
  return 0;
};

export function useDynamicTextSize(
  content: TextContent,
  type: 'question' | 'answer' = 'question'
): string {
  const [textSizeClass, setTextSizeClass] = useState('text-base');
  
  useEffect(() => {
    const length = getTextLength(content);
    
    if (type === 'question') {
      if (length > 300) {
        setTextSizeClass('text-sm');
      } else if (length > 150) {
        setTextSizeClass('text-base');
      } else if (length > 80) {
        setTextSizeClass('text-lg');
      } else {
        setTextSizeClass('text-xl');
      }
    } else {
      // For answers
      if (length > 200) {
        setTextSizeClass('text-sm');
      } else if (length > 100) {
        setTextSizeClass('text-base');
      } else {
        setTextSizeClass('text-lg');
      }
    }
  }, [content, type]);
  
  return textSizeClass;
}
