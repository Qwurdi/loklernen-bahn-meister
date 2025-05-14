
import React from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, Eye, EyeOff } from "lucide-react";
import { useFullscreen } from "@/hooks/useFullscreen";

interface FullscreenToggleProps {
  className?: string;
}

export default function FullscreenToggle({ className = "" }: FullscreenToggleProps) {
  const { isFullscreen, isCleanMode, toggleFullscreen, toggleCleanMode } = useFullscreen();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white hover:bg-gray-800"
        onClick={toggleCleanMode}
        title={isCleanMode ? "Standardansicht anzeigen" : "UI-Elemente ausblenden"}
      >
        {isCleanMode ? <EyeOff size={20} /> : <Eye size={20} />}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white hover:bg-gray-800"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Vollbildmodus beenden" : "Vollbildmodus starten"}
      >
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </Button>
    </div>
  );
}
