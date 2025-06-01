
import { StructuredContent, TextNode, Mark } from '@/types/rich-text';

// Convert TipTap content to our structured format
export function tiptapToStructured(htmlContent: string): StructuredContent {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const nodes: TextNode[] = [];
  
  // Process each top-level element
  Array.from(doc.body.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      
      switch (element.tagName.toLowerCase()) {
        case 'p':
          nodes.push(processTextElement(element, 'paragraph'));
          break;
        
        case 'h2':
        case 'h3':
          nodes.push(processTextElement(element, 'heading', {
            level: parseInt(element.tagName.charAt(1))
          }));
          break;
        
        case 'ul':
        case 'ol':
          const listType = element.tagName.toLowerCase() === 'ol' ? 'ol' : 'ul';
          const listItems = Array.from(element.querySelectorAll('li')).map(li => 
            processTextElement(li, 'list-item')
          );
          
          nodes.push({
            type: 'list',
            content: listItems.map(item => item.content).join(''),
            attrs: {
              ordered: listType === 'ol'
            }
          });
          break;
        
        case 'pre':
          nodes.push({
            type: 'code',
            content: element.textContent || '',
          });
          break;
      }
    }
  });
  
  return {
    type: 'document',
    nodes: nodes.length > 0 ? nodes : [{ type: 'paragraph', content: '' }],
    version: '1.0.0',
  };
}

// Helper function to process text elements and extract formatting marks
export function processTextElement(element: HTMLElement, nodeType: TextNode['type'], attrs?: Record<string, any>): TextNode {
  // If the element has no child elements with formatting, return simple text node
  if (!hasFormattingElements(element)) {
    return {
      type: nodeType,
      content: element.textContent || '',
      ...(attrs && { attrs })
    };
  }
  
  // Process element with formatting marks
  const textContent = element.textContent || '';
  const marks = extractMarksFromElement(element);
  
  return {
    type: nodeType,
    content: textContent,
    marks: marks.length > 0 ? marks : undefined,
    ...(attrs && { attrs })
  };
}

// Check if an element contains any formatting elements
export function hasFormattingElements(element: HTMLElement): boolean {
  return element.querySelector('strong, em, u, a, code') !== null;
}

// Extract formatting marks from an element
export function extractMarksFromElement(element: HTMLElement): Mark[] {
  const marks: Mark[] = [];
  
  // Check for bold formatting
  if (element.querySelector('strong') || element.closest('strong')) {
    marks.push({ type: 'bold' });
  }
  
  // Check for italic formatting
  if (element.querySelector('em') || element.closest('em')) {
    marks.push({ type: 'italic' });
  }
  
  // Check for underline formatting
  if (element.querySelector('u') || element.closest('u')) {
    marks.push({ type: 'underline' });
  }
  
  // Check for code formatting
  if (element.querySelector('code') || element.closest('code')) {
    marks.push({ type: 'code' });
  }
  
  // Check for links
  const linkEl = element.querySelector('a') || element.closest('a');
  if (linkEl) {
    const href = linkEl instanceof HTMLAnchorElement ? linkEl.getAttribute('href') : null;
    if (href) {
      marks.push({ 
        type: 'link',
        attrs: { href }
      });
    }
  }
  
  return marks;
}

// Convert our structured format to HTML for TipTap
export function structuredToHtml(content: StructuredContent): string {
  if (!content || !content.nodes) return '';
  
  // Simple conversion of structured nodes to HTML
  return content.nodes.map(node => {
    switch (node.type) {
      case 'paragraph':
        return `<p>${formatTextWithMarks(node)}</p>`;
      
      case 'heading':
        const level = node.attrs?.level || 2;
        return `<h${level}>${formatTextWithMarks(node)}</h${level}>`;
      
      case 'list':
        const listType = node.attrs?.ordered ? 'ol' : 'ul';
        const listItems = node.content || '';
        return `<${listType}><li>${listItems}</li></${listType}>`;
      
      case 'code':
        return `<pre><code>${node.content}</code></pre>`;
      
      default:
        return '';
    }
  }).join('');
}

// Apply marks to text content
export function formatTextWithMarks(node: TextNode): string {
  const textContent = node.content || node.text || '';
  
  let formattedText = textContent;
  
  // Apply marks if they exist
  if (node.marks && node.marks.length > 0) {
    node.marks.forEach(mark => {
      switch (mark.type) {
        case 'bold':
          formattedText = `<strong>${formattedText}</strong>`;
          break;
        case 'italic':
          formattedText = `<em>${formattedText}</em>`;
          break;
        case 'underline':
          formattedText = `<u>${formattedText}</u>`;
          break;
        case 'code':
          formattedText = `<code>${formattedText}</code>`;
          break;
        case 'link':
          if (mark.attrs?.href) {
            formattedText = `<a href="${mark.attrs.href}">${formattedText}</a>`;
          }
          break;
      }
    });
  }
  
  return formattedText;
}
