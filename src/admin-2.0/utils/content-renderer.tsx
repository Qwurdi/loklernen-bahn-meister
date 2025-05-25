
import React from 'react';
import { StructuredContent } from '@/types/rich-text';

// Helper function to safely extract display text from question text
export const getDisplayText = (text: string | StructuredContent): string => {
  if (typeof text === 'string') {
    return text;
  }
  
  if (text && typeof text === 'object' && text.nodes) {
    // Extract text from structured content
    return text.nodes
      .map(node => {
        if (typeof node.content === 'string') {
          return node.content;
        } else if (Array.isArray(node.content)) {
          return node.content
            .filter(child => typeof child.content === 'string')
            .map(child => child.content)
            .join(' ');
        }
        return '';
      })
      .join('\n');
  }
  
  return 'Frage';
};

// Helper function to render content safely (alias for getDisplayText for backward compatibility)
export const renderContent = (text: string | StructuredContent): string => {
  return getDisplayText(text);
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
