
import { useState, useEffect } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCleanMode, setIsCleanMode] = useState(
    localStorage.getItem("flashcard-clean-mode") === "true"
  );

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      
      // If exiting fullscreen, also exit clean mode
      if (!document.fullscreenElement && isCleanMode) {
        setIsCleanMode(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isCleanMode]);

  // Save clean mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("flashcard-clean-mode", isCleanMode.toString());
  }, [isCleanMode]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const toggleCleanMode = () => {
    setIsCleanMode(prev => !prev);
  };

  return { isFullscreen, isCleanMode, toggleFullscreen, toggleCleanMode };
}
