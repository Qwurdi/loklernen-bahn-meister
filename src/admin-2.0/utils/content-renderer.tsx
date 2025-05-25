
import React from 'react';

// Type for structured content (matching the database schema)
export type StructuredContent = {
  type: 'structured';
  content: Array<{
    type: 'text' | 'image' | 'list';
    value: string;
    attributes?: Record<string, any>;
  }>;
};

// Helper function to safely extract display text from question text
export const getDisplayText = (text: string | StructuredContent): string => {
  if (typeof text === 'string') {
    return text;
  }
  
  if (text && typeof text === 'object' && text.type === 'structured' && text.content) {
    // Extract text from structured content
    return text.content
      .filter(item => item.type === 'text')
      .map(item => item.value)
      .join(' ');
  }
  
  return 'Frage';
};

// Helper function to truncate content safely
export const truncateContent = (text: string | StructuredContent, maxLength: number = 100): string => {
  const displayText = getDisplayText(text);
  return displayText.length > maxLength 
    ? displayText.slice(0, maxLength) + '...' 
    : displayText;
};

// Component for rendering structured content
export const StructuredContentRenderer: React.FC<{ content: string | StructuredContent }> = ({ content }) => {
  const displayText = getDisplayText(content);
  
  return <span>{displayText}</span>;
};
