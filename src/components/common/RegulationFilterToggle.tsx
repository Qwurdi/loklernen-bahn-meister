
import React from 'react';
import { RegulationCategory } from '@/types/questions';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@radix-ui/react-tooltip";
import { RegulationFilterType } from '@/types/regulation';

interface RegulationFilterToggleProps {
  value: RegulationFilterType;
  onChange: (value: RegulationFilterType) => void;
  title?: string;
  showInfoTooltip?: boolean;
  variant?: "outline" | "default";
  size?: "default" | "sm" | "lg";
  className?: string;
  showAllOption?: boolean;
}

export const RegulationFilterToggle: React.FC<RegulationFilterToggleProps> = ({ 
  value, 
  onChange, 
  title = "Regelwerk",
  showInfoTooltip = true,
  variant = "outline",
  size = "default",
  className,
  showAllOption = false,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {title && (
        <div className="flex items-center justify-center gap-2 mb-1">
          <Label className="font-medium">{title}</Label>
          {showInfoTooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Wähle ob du DS 301 oder DV 301 lernen möchtest. 
                  Signale der Kategorie "beide" werden immer angezeigt.
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(val) => val && onChange(val as RegulationFilterType)}
        className="justify-center w-full"
        variant={variant}
      >
        {showAllOption && (
          <ToggleGroupItem value="all" className="flex-1" size={size}>Alle</ToggleGroupItem>
        )}
        <ToggleGroupItem value="DS 301" className="flex-1" size={size}>DS 301</ToggleGroupItem>
        <ToggleGroupItem value="DV 301" className="flex-1" size={size}>DV 301</ToggleGroupItem>
        {showAllOption && (
          <ToggleGroupItem value="both" className="flex-1" size={size}>Beide</ToggleGroupItem>
        )}
      </ToggleGroup>
    </div>
  );
}
