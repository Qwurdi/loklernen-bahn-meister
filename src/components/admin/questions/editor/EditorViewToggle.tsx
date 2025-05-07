
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutList, Rows3 } from 'lucide-react';

interface EditorViewToggleProps {
  view: 'tabs' | 'single';
  onChange: (view: 'tabs' | 'single') => void;
}

export const EditorViewToggle: React.FC<EditorViewToggleProps> = ({ view, onChange }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm text-muted-foreground">Anzeigemodus:</span>
      <ToggleGroup type="single" value={view} onValueChange={(value) => value && onChange(value as 'tabs' | 'single')}>
        <ToggleGroupItem value="tabs" aria-label="Tabs Ansicht" className="px-3 py-1">
          <LayoutList className="h-4 w-4 mr-2" />
          <span className="text-sm">Tabs</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="single" aria-label="Einseiten Ansicht" className="px-3 py-1">
          <Rows3 className="h-4 w-4 mr-2" />
          <span className="text-sm">Alle Inhalte</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
