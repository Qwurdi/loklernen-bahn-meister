
import React from 'react';
import { Label } from "@/components/ui/label";
import { RegulationCategory } from '@/types/questions';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface RegulationCategorySelectorProps {
  value: RegulationCategory | undefined;
  onChange: (value: RegulationCategory) => void;
  disabled?: boolean;
}

export const RegulationCategorySelector = ({ 
  value = "both", 
  onChange,
  disabled = false
}: RegulationCategorySelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="regulation_category">Regelwerk</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              Legt fest, in welchem Regelwerk dieses Signal vorkommt. Dies erlaubt Lernenden, 
              nur die für ihre Strecken relevanten Signale zu lernen.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => val && onChange(val as RegulationCategory)}
        disabled={disabled}
        className="justify-start"
      >
        <ToggleGroupItem value="DS 301" className="px-3">DS 301</ToggleGroupItem>
        <ToggleGroupItem value="DV 301" className="px-3">DV 301</ToggleGroupItem>
        <ToggleGroupItem value="both" className="px-3">Beide</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
