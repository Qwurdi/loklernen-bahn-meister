
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { RegulationFilterType } from "@/types/regulation";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";

interface FlashcardHeaderProps {
  subcategory?: string;
  isPracticeMode: boolean;
  regulationFilter: RegulationFilterType;
  onRegulationChange: (value: RegulationFilterType) => void;
}

export default function FlashcardHeader({ 
  subcategory, 
  isPracticeMode, 
  regulationFilter, 
  onRegulationChange 
}: FlashcardHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link to="/karteikarten">
            <Button variant="ghost" size="sm" className={isMobile ? "px-2" : ""}>
              <ChevronLeft className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Zurück</span>}
            </Button>
          </Link>
          {!isMobile && <h1 className="text-xl font-semibold ml-2">{subcategory}</h1>}
        </div>
        {!isMobile && (
          <div className="flex items-center gap-4">
            <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
              {isPracticeMode ? "Übungsmodus" : "Wiederholungsmodus"}
            </span>
          </div>
        )}
      </div>
      
      {isMobile && <h1 className="text-lg font-semibold mb-4">{subcategory}</h1>}
      
      {/* Regulation filter */}
      <div className="mb-4">
        <RegulationFilterToggle
          value={regulationFilter}
          onChange={onRegulationChange}
          variant="outline"
          size="sm"
          className="mb-4"
        />
      </div>
    </>
  );
}
