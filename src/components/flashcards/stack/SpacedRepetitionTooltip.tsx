
import React from "react";
import { BadgeCheck, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SpacedRepetitionTooltipProps {
  children: React.ReactNode;
  message?: string;
}

export default function SpacedRepetitionTooltip({
  children,
  message = "Mit Anmeldung: Dein Lernfortschritt wird mit unserem Spaced-Repetition-System optimiert.",
}: SpacedRepetitionTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-black border border-loklernen-ultramarine text-white p-3 max-w-xs shadow-lg"
        >
          <div className="flex gap-2">
            <Info className="h-5 w-5 text-loklernen-ultramarine shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm">{message}</p>
              <div className="flex items-center justify-end gap-1">
                <BadgeCheck className="h-4 w-4 text-loklernen-ultramarine" />
                <span className="text-xs text-gray-400">Spaced Repetition</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
