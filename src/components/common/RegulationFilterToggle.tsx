
import React from 'react';
import { RegulationCategory } from '@/types/questions';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RegulationFilterToggleProps {
  value: RegulationCategory | "all";
  onChange: (value: RegulationCategory | "all") => void;
}

export const RegulationFilterToggle: React.FC<RegulationFilterToggleProps> = ({ value, onChange }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <Label>Regelwerk</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Wähle ob du DS 301, DV 301 oder beide Regelwerke lernen möchtest.
                Signale der Kategorie "beide" werden immer angezeigt.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => val && onChange(val as RegulationCategory | "all")}
        className="justify-center w-full"
        variant="outline"
      >
        <ToggleGroupItem value="DS 301" className="flex-1">DS 301</ToggleGroupItem>
        <ToggleGroupItem value="DV 301" className="flex-1">DV 301</ToggleGroupItem>
        <ToggleGroupItem value="all" className="flex-1">Alle</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
