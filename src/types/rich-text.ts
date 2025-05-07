
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
