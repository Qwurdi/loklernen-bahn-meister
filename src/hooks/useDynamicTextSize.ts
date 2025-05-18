
import { useEffect, useState } from 'react';
import { StructuredContent, getTextLength as getRichTextLength } from "@/types/rich-text";

export type TextContent = string | StructuredContent;

export function useDynamicTextSize(
  content: TextContent,
  type: 'question' | 'answer' = 'question'
): string {
  const [textSizeClass, setTextSizeClass] = useState('text-base');
  
  useEffect(() => {
    let length: number;
    
    if (typeof content === 'string') {
      length = content.length;
    } else {
      // Use the utility function for structured content
      length = getRichTextLength(content);
    }
    
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
