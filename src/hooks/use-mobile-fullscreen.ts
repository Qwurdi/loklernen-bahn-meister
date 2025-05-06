
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Hook to manage fullscreen mobile mode without causing flickering
 * Centralizes all DOM manipulations to prevent conflicts
 */
export function useMobileFullscreen(enabled = true) {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Only apply these changes on mobile devices when enabled
    if (!isMobile || !enabled) return;
    
    // Store original styles to restore them later
    const originalBodyStyle = document.body.style.overflow;
    const originalHtmlClasses = [...document.documentElement.classList];
    
    // Apply fullscreen styles once
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('overflow-hidden', 'fixed', 'inset-0', 'h-full', 'w-full');
    
    // Cleanup function to restore original styles
    return () => {
      document.body.style.overflow = originalBodyStyle;
      
      // Remove only the classes we added
      document.documentElement.classList.remove(
        'overflow-hidden', 
        'fixed', 
        'inset-0', 
        'h-full', 
        'w-full'
      );
    };
  }, [isMobile, enabled]); // Only re-run if mobile status or enabled flag changes

  return { isFullscreenMobile: isMobile && enabled };
}
