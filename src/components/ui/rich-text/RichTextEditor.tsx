
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StructuredContent } from '@/types/rich-text';
import { EditorToolbar } from './EditorToolbar';
import { extensions } from './editorConfig';
import { tiptapToStructured, structuredToHtml } from './utils';

interface RichTextEditorProps {
  value: string | StructuredContent;
  onChange: (value: string | StructuredContent) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
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
      <EditorToolbar editor={editor} />
      
      <EditorContent editor={editor} className="p-3" />
      
      {placeholder && !editor.getText() && (
        <div className="absolute top-[4.5rem] left-3 text-muted-foreground pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  );
}
