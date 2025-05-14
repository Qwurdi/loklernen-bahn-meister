
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { RegulationFilterType } from "@/types/regulation";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import FullscreenToggle from "./FullscreenToggle";
import { useFullscreen } from "@/hooks/useFullscreen";

interface FlashcardHeaderProps {
  subcategory?: string;
  isPracticeMode: boolean;
  onRegulationChange: (value: RegulationFilterType) => void;
}

export default function FlashcardHeader({ 
  subcategory, 
  isPracticeMode,
  onRegulationChange 
}: FlashcardHeaderProps) {
  const isMobile = useIsMobile();
  const { isCleanMode } = useFullscreen();
  const { regulationPreference } = useUserPreferences();
  
  // For clean mode with minimal UI
  if (isCleanMode && isMobile) {
    return (
      <div className="flex items-center justify-between pb-1">
        <Link to="/karteikarten">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 text-white hover:bg-gray-800"
            title="Zurück"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        
        <span className="text-xs text-gray-400 truncate max-w-[150px]">{subcategory}</span>
        
        <FullscreenToggle />
      </div>
    );
  }
  
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Link to="/karteikarten">
            <Button variant="ghost" size="sm" className={`${isMobile ? "px-2" : ""} text-white hover:bg-gray-800`}>
              <ChevronLeft className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Zurück</span>}
            </Button>
          </Link>
          {!isMobile && <h1 className="text-xl font-semibold ml-2 text-white">{subcategory}</h1>}
        </div>
        
        <div className="flex items-center gap-2">
          {!isMobile && (
            <span className="text-sm px-2 py-1 rounded bg-blue-900/40 text-blue-200 border border-blue-800/50">
              {isPracticeMode ? "Übungsmodus" : "Wiederholungsmodus"}
            </span>
          )}
          <FullscreenToggle />
        </div>
      </div>
      
      {isMobile && !isCleanMode && <h1 className="text-lg font-semibold mb-3 text-white">{subcategory}</h1>}
      
      {/* Regulation filter - condensed in mobile */}
      {!isCleanMode && (
        <div className={`${isMobile ? 'mb-2' : 'mb-4'}`}>
          <RegulationFilterToggle
            value={regulationPreference}
            onChange={onRegulationChange}
            variant="outline"
            size="sm"
            className="border-gray-700 bg-gray-800/50 text-gray-200"
          />
        </div>
      )}
    </>
  );
}
