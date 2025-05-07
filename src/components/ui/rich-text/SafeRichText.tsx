
import React from 'react';
import DOMPurify from 'dompurify';
import { StructuredContent, isStructuredContent } from '@/types/rich-text';
import { structuredToHtml } from './utils';

interface SafeRichTextProps {
  content: string | StructuredContent;
  className?: string;
}

export function SafeRichText({ content, className = '' }: SafeRichTextProps) {
  // If content is a string, sanitize it as HTML
  if (typeof content === 'string') {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      />
    );
  }

  // If content is structured, convert to HTML and sanitize
  if (isStructuredContent(content)) {
    const html = structuredToHtml(content);
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      />
    );
  }

  // Fallback for empty or invalid content
  return <div className={className} />;
}
