
/**
 * Rich text content structure types for structured content storage
 */

export type TextNodeType = 'paragraph' | 'heading' | 'list-item' | 'list' | 'code' | 'image';

export interface Mark {
  type: 'bold' | 'italic' | 'link' | 'underline' | 'code';
  attrs?: Record<string, any>; // For links: { href: string }
}

export interface TextNode {
  type: TextNodeType;
  content?: string | TextNode[];
  marks?: Mark[];
  attrs?: Record<string, any>; // For headings: { level: 1 | 2 | 3 }
}

export interface StructuredContent {
  nodes: TextNode[];
  version: string;
}

/**
 * Helper function to check if content is structured
 */
export function isStructuredContent(content: any): content is StructuredContent {
  return content && 
    typeof content === 'object' && 
    Array.isArray(content.nodes) && 
    typeof content.version === 'string';
}

/**
 * Convert plain text to structured content
 */
export function plainTextToStructured(text: string): StructuredContent {
  return {
    nodes: text.split('\n').map(line => ({
      type: 'paragraph',
      content: line
    })),
    version: '1.0.0'
  };
}

/**
 * Convert structured content to plain text for display or string operations
 */
export function structuredToPlainText(content: StructuredContent): string {
  if (!content || !content.nodes) return '';
  
  return content.nodes
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

/**
 * Helper function to get text length for string or structured content
 */
export function getTextLength(content: string | StructuredContent): number {
  if (typeof content === 'string') {
    return content.length;
  }
  return structuredToPlainText(content).length;
}

/**
 * Helper function to get substring of content (works for both string and structured)
 */
export function getTextSubstring(content: string | StructuredContent, start: number, end: number): string {
  if (typeof content === 'string') {
    return content.substring(start, end);
  }
  return structuredToPlainText(content).substring(start, end);
}

/**
 * Helper function for string operations on either format
 */
export function getTextValue(content: string | StructuredContent): string {
  if (typeof content === 'string') {
    return content;
  }
  return structuredToPlainText(content);
}
