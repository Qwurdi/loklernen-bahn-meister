
import React from 'react';
import DOMPurify from 'dompurify';
import { StructuredContent, TextNode, isStructuredContent } from '@/types/rich-text';

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

  // If content is structured, render it as React components
  if (isStructuredContent(content)) {
    return (
      <div className={className}>
        {content.nodes.map((node, index) => renderNode(node, index))}
      </div>
    );
  }

  // Fallback for empty or invalid content
  return <div className={className} />;
}

// Helper function to render a node
function renderNode(node: TextNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'paragraph':
      return (
        <p key={index} className="mb-2">
          {typeof node.content === 'string' 
            ? renderTextWithMarks(node.content, node.marks || [])
            : Array.isArray(node.content)
              ? node.content.map((child, childIndex) => renderNode(child, childIndex))
              : null}
        </p>
      );
    
    case 'heading':
      const level = node.attrs?.level || 2;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      
      return (
        <HeadingTag key={index} className="font-bold mt-4 mb-2">
          {typeof node.content === 'string'
            ? renderTextWithMarks(node.content, node.marks || [])
            : null}
        </HeadingTag>
      );
    
    case 'list':
      const ListTag = node.attrs?.ordered ? 'ol' : 'ul';
      
      return (
        <ListTag key={index} className="ml-4 mb-2 list-disc">
          {Array.isArray(node.content)
            ? node.content.map((item, itemIndex) => renderNode(item, itemIndex))
            : null}
        </ListTag>
      );
    
    case 'list-item':
      return (
        <li key={index}>
          {typeof node.content === 'string'
            ? renderTextWithMarks(node.content, node.marks || [])
            : Array.isArray(node.content)
              ? node.content.map((child, childIndex) => renderNode(child, childIndex))
              : null}
        </li>
      );
    
    case 'code':
      return (
        <pre key={index} className="bg-gray-100 p-2 rounded overflow-x-auto mb-2">
          <code>
            {typeof node.content === 'string' ? node.content : null}
          </code>
        </pre>
      );
    
    case 'image':
      return node.attrs?.src ? (
        <div key={index} className="my-2">
          <img 
            src={node.attrs.src} 
            alt={node.attrs?.alt || ''} 
            className="max-w-full rounded"
          />
        </div>
      ) : null;
    
    default:
      return null;
  }
}

// Helper function to apply marks to text
function renderTextWithMarks(text: string, marks: TextNode['marks'] = []): React.ReactNode {
  if (!marks || marks.length === 0) {
    return text;
  }

  return marks.reduce((content, mark) => {
    switch (mark.type) {
      case 'bold':
        return <strong>{content}</strong>;
      
      case 'italic':
        return <em>{content}</em>;
      
      case 'underline':
        return <span className="underline">{content}</span>;
      
      case 'code':
        return <code className="bg-gray-100 px-1 rounded">{content}</code>;
      
      case 'link':
        return mark.attrs?.href ? (
          <a href={mark.attrs.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {content}
          </a>
        ) : content;
      
      default:
        return content;
    }
  }, <>{text}</>);
}
