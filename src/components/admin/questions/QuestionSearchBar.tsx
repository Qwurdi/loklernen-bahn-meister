
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3, Table as TableIcon } from "lucide-react";

interface QuestionSearchBarProps {
  searchQuery: string;
  viewMode: "grid" | "table";
  onSearchChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "table") => void;
}

export const QuestionSearchBar: React.FC<QuestionSearchBarProps> = ({
  searchQuery,
  viewMode,
  onSearchChange,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Suche nach Fragen, Kategorien..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
          title="Grid-Ansicht"
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewModeChange("table")}
          title="Tabellen-Ansicht"
        >
          <TableIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
