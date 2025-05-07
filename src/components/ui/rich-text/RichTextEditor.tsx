
import React, { useState, useEffect } from 'react';
import { EditorProvider, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Heading2, Code, Link as LinkIcon, Underline as UnderlineIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Toolbar } from '@/components/ui/toolbar';
import { StructuredContent } from '@/types/rich-text';

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
  // This is a simplified version - a real implementation would parse the HTML
  // and convert it to our structured format
  // For now, we're creating a simple paragraph-based structure
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const nodes: any[] = [];
  
  // Basic conversion of HTML elements to structured nodes
  Array.from(doc.body.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      
      switch (element.tagName.toLowerCase()) {
        case 'p':
          nodes.push({
            type: 'paragraph',
            content: element.textContent || '',
          });
          break;
        
        case 'h2':
        case 'h3':
          nodes.push({
            type: 'heading',
            content: element.textContent || '',
            attrs: {
              level: parseInt(element.tagName.charAt(1)),
            },
          });
          break;
        
        case 'ul':
        case 'ol':
          const listItems = Array.from(element.querySelectorAll('li')).map(li => ({
            type: 'list-item',
            content: li.textContent || '',
          }));
          
          nodes.push({
            type: 'list',
            content: listItems,
            attrs: {
              ordered: element.tagName.toLowerCase() === 'ol',
            },
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
    nodes,
    version: '1.0.0',
  };
}

// Convert our structured format to HTML for TipTap
function structuredToHtml(content: StructuredContent): string {
  if (!content || !content.nodes) return '';
  
  // Simple conversion of structured nodes to HTML
  return content.nodes.map(node => {
    switch (node.type) {
      case 'paragraph':
        return `<p>${node.content}</p>`;
      
      case 'heading':
        const level = node.attrs?.level || 2;
        return `<h${level}>${node.content}</h${level}>`;
      
      case 'list':
        const listType = node.attrs?.ordered ? 'ol' : 'ul';
        const listItems = Array.isArray(node.content) 
          ? node.content.map(item => `<li>${item.content}</li>`).join('')
          : '';
        return `<${listType}>${listItems}</${listType}>`;
      
      case 'code':
        return `<pre><code>${node.content}</code></pre>`;
      
      default:
        return '';
    }
  }).join('');
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
