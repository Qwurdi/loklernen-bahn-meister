
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RichTextEditor } from '@/components/ui/rich-text/RichTextEditor';
import { StructuredContent } from '@/types/rich-text';

interface HintFieldProps {
  hint: string | StructuredContent | null | undefined;
  onChange: (value: string | StructuredContent) => void;
}

export const HintField: React.FC<HintFieldProps> = ({ hint, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Label htmlFor="hint" className="text-md font-medium">Hinweis für Lernende</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">
                Ein optionaler Hinweis, der den Lernenden gezeigt wird, wenn sie auf "Tipp anzeigen" klicken.
                <br />Falls kein Hinweis angegeben ist, wird ein automatischer Hinweis generiert.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <RichTextEditor
        value={hint || ''}
        onChange={onChange}
        placeholder="Geben Sie hier einen Hinweis ein, der den Lernenden helfen könnte..."
        minHeight="80px"
      />
    </div>
  );
};
