
import React, { useState } from 'react';
import { bold, italic, list, link } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const handleBold = () => {
    document.execCommand('bold', false);
  };

  const handleItalic = () => {
    document.execCommand('italic', false);
  };

  const handleList = () => {
    document.execCommand('insertUnorderedList', false);
  };
  
  const handleLink = () => {
    const url = prompt('Link URL eingeben:', 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  return (
    <div className={cn(
      "flex flex-col rounded-md border",
      error ? "border-red-500" : isFocused ? "border-loklernen-ultramarine ring-2 ring-loklernen-ultramarine/20" : "border-input", 
      className
    )}>
      <div className="flex items-center gap-1 border-b bg-muted/50 px-2 py-1">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={handleBold}
        >
          <bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={handleItalic}
        >
          <italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={handleList}
        >
          <list className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={handleLink}
        >
          <link className="h-4 w-4" />
        </Button>
      </div>
      <div
        className={cn(
          "w-full rounded-b-md p-3 outline-none",
          "overflow-auto"
        )}
        style={{ minHeight }}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        placeholder={placeholder}
        data-placeholder={!value ? placeholder : undefined}
      />
    </div>
  );
}
