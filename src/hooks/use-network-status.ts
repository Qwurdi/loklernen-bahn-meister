
import { useState, useEffect } from 'react';

/**
 * Hook that tracks online/offline status with enhanced detection
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    function updateOnlineStatus() {
      const online = navigator.onLine;
      if (!online && !wasOffline) {
        // First time going offline
        setWasOffline(true);
      }
      setIsOnline(online);
      setLastChecked(new Date());
    }

    // Check connectivity by attempting a tiny fetch to our own server
    const checkRealConnectivity = async () => {
      try {
        // Try to fetch a tiny resource with cache busting
        await fetch('/manifest.json?_nc=' + new Date().getTime(), { 
          method: 'HEAD',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!isOnline) {
          console.log('Network check: Connection restored');
          setIsOnline(true);
        }
      } catch (error) {
        if (isOnline) {
          console.log('Network check: No connectivity despite browser reporting online');
          setIsOnline(false);
          setWasOffline(true);
        }
      } finally {
        setLastChecked(new Date());
      }
    };

    // Listen for browser's online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial check
    updateOnlineStatus();

    // Set up periodic connectivity checks
    const intervalId = setInterval(checkRealConnectivity, 30000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(intervalId);
    };
  }, [isOnline, wasOffline]);

  return { isOnline, wasOffline, lastChecked };
}
