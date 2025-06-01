
export interface RichTextContent {
  type: 'text' | 'paragraph' | 'heading';
  content?: string;
  children?: RichTextContent[];
}

export interface StructuredContent {
  type: string;
  content?: any;
  children?: StructuredContent[];
}

export interface TextNode {
  type: 'text';
  text: string;
  marks?: Mark[];
}

export interface Mark {
  type: string;
  attrs?: Record<string, any>;
}

export function getTextValue(content: any): string {
  if (typeof content === 'string') {
    return content;
  }
  
  if (typeof content === 'object' && content !== null) {
    if (content.content) {
      return content.content;
    }
    
    if (content.children && Array.isArray(content.children)) {
      return content.children
        .map((child: any) => getTextValue(child))
        .join(' ');
    }
  }
  
  return '';
}

export function isStructuredContent(content: any): content is StructuredContent {
  return typeof content === 'object' && 
         content !== null && 
         typeof content.type === 'string';
}

export function getTextLength(content: string | StructuredContent): number {
  if (typeof content === 'string') {
    return content.length;
  }
  
  if (isStructuredContent(content)) {
    return getTextValue(content).length;
  }
  
  return 0;
}

export function getTextSubstring(content: string | StructuredContent, start: number, end?: number): string {
  const text = typeof content === 'string' ? content : getTextValue(content);
  return text.substring(start, end);
}

export function plainTextToStructured(text: string): StructuredContent {
  return {
    type: 'paragraph',
    content: text
  };
}
