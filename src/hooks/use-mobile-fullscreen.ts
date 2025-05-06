
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to manage fullscreen functionality for mobile devices
 * with improved error handling and memory leak prevention
 */
export function useMobileFullscreen(enableOnMount: boolean = false) {
  const [isFullscreenMobile, setIsFullscreenMobile] = useState(false);
  const isMounted = useRef(true);
  
  // Track if we already have fullscreen enabled
  const fullscreenActive = useRef(false);

  // Clean function to safely update state
  const safeSetState = useCallback((value: boolean) => {
    if (isMounted.current) {
      setIsFullscreenMobile(value);
    }
  }, []);
  
  // Function to toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    try {
      if (!document.fullscreenElement && !fullscreenActive.current) {
        // If not in fullscreen mode, enter fullscreen
        const docEl = document.documentElement;
        
        const requestFullscreen = 
          docEl.requestFullscreen || 
          (docEl as any).webkitRequestFullscreen || 
          (docEl as any).mozRequestFullScreen || 
          (docEl as any).msRequestFullscreen;
        
        if (requestFullscreen) {
          requestFullscreen.call(docEl)
            .then(() => {
              fullscreenActive.current = true;
              safeSetState(true);
              console.log('Fullscreen mode enabled');
            })
            .catch((err: any) => {
              console.error('Error attempting to enable fullscreen:', err);
              // Try to recover
              fullscreenActive.current = false;
              safeSetState(false);
            });
        }
      } else if (document.fullscreenElement || fullscreenActive.current) {
        // If in fullscreen mode, exit fullscreen
        const exitFullscreen = 
          document.exitFullscreen || 
          (document as any).webkitExitFullscreen || 
          (document as any).mozCancelFullScreen || 
          (document as any).msExitFullscreen;
          
        if (exitFullscreen) {
          exitFullscreen.call(document)
            .then(() => {
              fullscreenActive.current = false;
              safeSetState(false);
              console.log('Fullscreen mode disabled');
            })
            .catch((err: any) => {
              console.error('Error attempting to exit fullscreen:', err);
              // Try to recover state
              fullscreenActive.current = true;
              safeSetState(true);
            });
        }
      }
    } catch (error) {
      console.error('Fullscreen API error:', error);
    }
  }, [safeSetState]);
  
  // Listen for fullscreen change events
  useEffect(() => {
    function handleFullscreenChange() {
      const isFullscreen = !!document.fullscreenElement;
      fullscreenActive.current = isFullscreen;
      safeSetState(isFullscreen);
    }
    
    // Add event listeners for all browser variants
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // Enable fullscreen on mount if requested
    if (enableOnMount && !fullscreenActive.current) {
      toggleFullscreen();
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted.current = false;
      
      // Remove all event listeners
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      
      // If component unmounts while in fullscreen, exit fullscreen
      if (document.fullscreenElement || fullscreenActive.current) {
        try {
          const exitFullscreen = 
            document.exitFullscreen || 
            (document as any).webkitExitFullscreen || 
            (document as any).mozCancelFullScreen || 
            (document as any).msExitFullscreen;
            
          if (exitFullscreen) {
            exitFullscreen.call(document).catch(err => {
              console.error('Error exiting fullscreen on unmount:', err);
            });
          }
        } catch (e) {
          console.error('Error when trying to exit fullscreen on unmount:', e);
        }
      }
    };
  }, [enableOnMount, toggleFullscreen, safeSetState]);
  
  return {
    isFullscreenMobile,
    toggleFullscreen
  };
}
