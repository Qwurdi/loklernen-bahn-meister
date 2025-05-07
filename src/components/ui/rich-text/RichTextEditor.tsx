
import React, { useState, useEffect } from 'react';
import { EditorProvider, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Heading2, Code, Link as LinkIcon, Underline as UnderlineIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Toolbar } from '@/components/ui/toolbar';
import { StructuredContent, Mark, TextNode } from '@/types/rich-text';

interface RichTextEditorProps {
  value: string | StructuredContent;
  onChange: (value: string | StructuredContent) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
  }),
];

// Convert TipTap content to our structured format
function tiptapToStructured(htmlContent: string): StructuredContent {
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
            content: listItems,
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
    nodes: nodes.length > 0 ? nodes : [{ type: 'paragraph', content: '' }],
    version: '1.0.0',
  };
}

// Helper function to process text elements and extract formatting marks
function processTextElement(element: HTMLElement, nodeType: TextNode['type'], attrs?: Record<string, any>): TextNode {
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
function hasFormattingElements(element: HTMLElement): boolean {
  return element.querySelector('strong, em, u, a, code') !== null;
}

// Extract formatting marks from an element
function extractMarksFromElement(element: HTMLElement): Mark[] {
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
function structuredToHtml(content: StructuredContent): string {
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
        const listItems = Array.isArray(node.content) 
          ? node.content.map(item => `<li>${formatTextWithMarks(item)}</li>`).join('')
          : '';
        return `<${listType}>${listItems}</${listType}>`;
      
      case 'code':
        return `<pre><code>${node.content}</code></pre>`;
      
      default:
        return '';
    }
  }).join('');
}

// Apply marks to text content
function formatTextWithMarks(node: TextNode): string {
  if (typeof node.content !== 'string') {
    return '';
  }
  
  let formattedText = node.content;
  
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

export function RichTextEditor({ 
  value, 
  onChange,
  placeholder = '',
  minHeight = '200px',
  className = '',
}: RichTextEditorProps) {
  // Convert the initial value to HTML for TipTap
  const initialContent = typeof value === 'string' 
    ? value 
    : structuredToHtml(value);

  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps: {
      attributes: {
        class: `focus:outline-none prose prose-sm max-w-none w-full ${className}`,
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Convert HTML to our structured format
      const structuredContent = tiptapToStructured(html);
      onChange(structuredContent);
    },
  });

  // Update editor content when the external value changes
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const newContent = typeof value === 'string' ? value : structuredToHtml(value);
      if (newContent !== editor.getHTML()) {
        editor.commands.setContent(newContent);
      }
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      <Toolbar className="border-b p-1 flex flex-wrap gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Toggle Heading"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Toggle Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Toggle Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Toggle Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Toggle Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Toggle Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('code')}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          aria-label="Toggle Code"
        >
          <Code className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          size="sm"
          pressed={editor.isActive('link')}
          onPressedChange={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('URL', previousUrl);
            
            if (url === null) {
              return;
            }
            
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
          aria-label="Toggle Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Toggle>
      </Toolbar>
      
      <EditorContent editor={editor} className="p-3" />
      
      {placeholder && !editor.getText() && (
        <div className="absolute top-[4.5rem] left-3 text-muted-foreground pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}
