
import React from 'react';
import { StructuredContent, getTextValue } from '@/types/rich-text';

/**
 * Safely render StructuredContent or string as ReactNode
 */
export const renderContent = (content: string | StructuredContent | undefined | null): React.ReactNode => {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  }
  
  // For now, convert structured content to plain text
  // In Phase 3, we'll implement full rich text rendering
  return getTextValue(content);
};

/**
 * Get plain text from any content type for display purposes
 */
export const getDisplayText = (content: string | StructuredContent | undefined | null): string => {
  if (!content) return '';
  
  if (typeof content === 'string') {
    return content;
  }
  
  return getTextValue(content);
};

/**
 * Truncate content for preview display
 */
export const truncateContent = (content: string | StructuredContent | undefined | null, maxLength: number = 60): string => {
  const text = getDisplayText(content);
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
