
import { useState, useEffect, useMemo } from 'react';

// Define breakpoints for consistency throughout the app
export const BREAKPOINTS = {
  sm: 640,   // Small devices
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (desktops)
  xl: 1280,  // Extra large devices
};

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Initialize match state
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    // Create event listener for changes
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    // Cleanup listener on unmount
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Custom hooks for specific breakpoints
export const useIsMobile = (): boolean => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
};

export const useIsTablet = (): boolean => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
};

export const useIsDesktop = (): boolean => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
};

// Hook for detecting motion preferences
export const usePrefersReducedMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

export default useIsMobile;
