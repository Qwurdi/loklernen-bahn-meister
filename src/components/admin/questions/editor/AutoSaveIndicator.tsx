
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface AutoSaveIndicatorProps {
  lastSaved: Date | null;
  isDirty: boolean;
  onSave: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  lastSaved,
  isDirty,
  onSave,
  isLoading
}) => {
  if (!lastSaved) return null;
  
  return (
    <div className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
      <span>Letzter automatischer Speicherstand: {lastSaved.toLocaleTimeString()}</span>
      {isDirty && (
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 text-xs py-0 px-2 flex items-center gap-1"
          onClick={(e) => onSave(e)}
          disabled={isLoading}
        >
          <Save className="h-3 w-3" />
          Jetzt speichern
        </Button>
      )}
    </div>
  );
};
