
import React from 'react';
import { StructuredContent } from '@/types/rich-text';
import { getTextValue, structuredToPlainText } from '@/types/rich-text';

// Helper function to safely extract display text from question text
export const getDisplayText = (text: string | StructuredContent): string => {
  return getTextValue(text);
};

// Helper function to render content safely (using existing utility)
export const renderContent = (text: string | StructuredContent): string => {
  return getTextValue(text);
};

// Helper function to truncate content safely
export const truncateContent = (text: string | StructuredContent, maxLength: number = 100): string => {
  const displayText = getTextValue(text);
  return displayText.length > maxLength 
    ? displayText.slice(0, maxLength) + '...' 
    : displayText;
};

// Component for rendering structured content
export const StructuredContentRenderer: React.FC<{ content: string | StructuredContent }> = ({ content }) => {
  const displayText = getTextValue(content);
  
  return <span>{displayText}</span>;
};
