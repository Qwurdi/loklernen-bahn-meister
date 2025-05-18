
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { SafeRichText } from "@/components/ui/rich-text/SafeRichText";
import { StructuredContent } from "@/types/rich-text";

interface HintButtonProps {
  hint?: string;
  question: string | StructuredContent;
  answers: any;
  minimal?: boolean;
}

export default function HintButton({ hint, minimal = false, question, answers }: HintButtonProps) {
  const [open, setOpen] = useState(false);
  
  // Return null if no hint is provided
  if (!hint) return null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`${minimal ? 'py-1 px-2 h-auto text-xs' : 'py-2 px-3'} flex items-center gap-2 hover:bg-amber-50`}
        >
          <HelpCircle className={minimal ? "w-4 h-4" : "w-5 h-5"} /> 
          {minimal ? "Tipp" : "Tipp anzeigen"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2">Hilfestellung</DialogTitle>
        </DialogHeader>
        <div className="mt-3 prose">
          <div className="text-gray-600 mb-4">
            <SafeRichText content={hint} />
          </div>
          
          <DialogClose asChild>
            <Button className="mt-4 w-full">
              Verstanden
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
