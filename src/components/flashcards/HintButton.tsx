
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Answer } from '@/types/questions';
import { SafeRichText } from '@/components/ui/rich-text/SafeRichText';
import { StructuredContent } from '@/types/rich-text';

interface HintButtonProps {
  hint?: string | StructuredContent | null;
  question: string | StructuredContent;
  answers?: Answer[];
}

export default function HintButton({ hint, question, answers }: HintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If no hint provided, don't show the button
  if (!hint) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground flex gap-2 hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-4 w-4" />
        <span className="text-xs">Hinweis anzeigen</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Hinweis</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mb-3">
            <p className="text-sm font-medium text-muted-foreground mb-1">Frage:</p>
            <div className="p-3 bg-gray-50 rounded-md">
              <SafeRichText content={question} />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">Hinweis:</p>
            <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
              <SafeRichText content={hint} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
