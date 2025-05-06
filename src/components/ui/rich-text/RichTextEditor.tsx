import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Link, Eraser, Undo, Redo, AlignLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  error?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Geben Sie hier Text ein...",
  className,
  minHeight = "200px",
  error = false
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<{
    bold: boolean;
    italic: boolean;
    list: boolean;
    link: boolean;
  }>({
    bold: false,
    italic: false,
    list: false,
    link: false
  });

  // Update the editorRef content when value changes
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Check for active formats
  const checkActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      list: document.queryCommandState('insertUnorderedList'),
      link: document.queryCommandValue('createLink') !== ''
    });
  };

  // Handle text commands with proper selection preservation
  const handleCommand = (command: string, value?: string) => {
    // Make sure the editor is focused
    editorRef.current?.focus();
    
    // Execute the command
    document.execCommand(command, false, value);
    
    // Update the content
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      checkActiveFormats();
    }
  };

  // Specific command handlers
  const handleBold = () => handleCommand('bold');
  const handleItalic = () => handleCommand('italic');
  const handleList = () => handleCommand('insertUnorderedList');
  const handleUndo = () => handleCommand('undo');
  const handleRedo = () => handleCommand('redo');
  
  const handleLink = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const url = prompt('Link URL eingeben:', 'https://');
      if (url) {
        handleCommand('createLink', url);
      }
    } else {
      alert('Bitte Text markieren, um einen Link zu erstellen.');
    }
  };

  // Remove formatting from selection or entire content
  const handleRemoveFormat = () => {
    const selection = window.getSelection();
    
    // If there's a selection, only remove formatting from the selected text
    if (selection && selection.toString().length > 0) {
      handleCommand('removeFormat');
    } else {
      // If no selection, focus and select all text
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('selectAll', false);
        handleCommand('removeFormat');
        // Deselect after formatting is removed
        selection?.removeAllRanges();
      }
    }
  };

  // Clean pasted content to remove unwanted formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    // Get clipboard data
    const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');
    
    // If we have HTML, clean it before inserting
    if (html) {
      // Create temporary element to sanitize HTML
      const temp = document.createElement('div');
      temp.innerHTML = html;
      
      // Remove specific tags that might cause issues
      const unwantedTags = temp.querySelectorAll('style, script, meta, link');
      unwantedTags.forEach(el => el.remove());
      
      // Clean attributes from remaining elements
      const allElements = temp.querySelectorAll('*');
      allElements.forEach(el => {
        // Keep only specific safe attributes
        const safeAttributes = ['href', 'target', 'rel'];
        const attributes = Array.from(el.attributes);
        attributes.forEach(attr => {
          if (!safeAttributes.includes(attr.name)) {
            el.removeAttribute(attr.name);
          }
        });
        
        // Ensure links open in new tab
        if (el.tagName === 'A') {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      });
      
      // Insert the cleaned HTML
      document.execCommand('insertHTML', false, temp.innerHTML);
    } else {
      // Insert plain text
      document.execCommand('insertText', false, text);
    }
    
    // Update the value
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={cn(
      "flex flex-col rounded-md border",
      error ? "border-red-500" : isFocused ? "border-loklernen-ultramarine ring-2 ring-loklernen-ultramarine/20" : "border-input", 
      className
    )}>
      <div className="flex items-center gap-1 border-b bg-muted/50 px-2 py-1 flex-wrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant={activeFormats.bold ? "secondary" : "ghost"} 
              size="icon" 
              onClick={handleBold}
              aria-label="Fett"
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fett</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant={activeFormats.italic ? "secondary" : "ghost"} 
              size="icon" 
              onClick={handleItalic}
              aria-label="Kursiv"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Kursiv</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant={activeFormats.list ? "secondary" : "ghost"}
              size="icon" 
              onClick={handleList}
              aria-label="Liste"
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Liste</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant={activeFormats.link ? "secondary" : "ghost"}
              size="icon" 
              onClick={handleLink}
              aria-label="Link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Link</TooltipContent>
        </Tooltip>
        
        <div className="h-4 w-px bg-border mx-1" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={handleRemoveFormat}
              aria-label="Formatierung entfernen"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Formatierung entfernen</TooltipContent>
        </Tooltip>
        
        <div className="h-4 w-px bg-border mx-1" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={handleUndo}
              aria-label="Rückgängig"
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rückgängig</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={handleRedo}
              aria-label="Wiederherstellen"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Wiederherstellen</TooltipContent>
        </Tooltip>
      </div>
      <div
        ref={editorRef}
        className={cn(
          "w-full rounded-b-md p-3 outline-none",
          "overflow-auto"
        )}
        style={{ minHeight }}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onFocus={() => {
          setIsFocused(true);
          checkActiveFormats();
        }}
        onBlur={() => setIsFocused(false)}
        onKeyUp={checkActiveFormats}
        onMouseUp={checkActiveFormats}
        onPaste={handlePaste}
        data-placeholder={!value ? placeholder : undefined}
      />
    </div>
  );
}
