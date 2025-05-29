
export interface RichTextContent {
  type: 'text' | 'paragraph' | 'heading';
  content?: string;
  children?: RichTextContent[];
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
