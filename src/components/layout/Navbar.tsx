
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DesktopNavigation from "./navbar/DesktopNavigation";
import DesktopAuthButtons from "./navbar/DesktopAuthButtons";
import Logo from "./navbar/Logo";
import BackButton from "./navbar/BackButton";
import NetworkStatusIndicator from "@/components/common/NetworkStatusIndicator";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { defaultNavItems, getPreviousPath } from "./navbar/NavbarUtils";

export default function Navbar() {
  const location = useLocation();
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showNetworkStatus, setShowNetworkStatus] = useState(false);
  const previousPath = getPreviousPath(location.pathname);
  
  // Function to check if a path is active
  const isActive = (path: string) => {
    // Check if the current path starts with the given path
    // but make an exception for root path to avoid matching everything
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Show network status indicator when network status changes
  useEffect(() => {
    if (!isOnline || wasOffline) {
      setShowNetworkStatus(true);
      // Hide after some time if we're back online
      if (isOnline) {
        const timer = setTimeout(() => {
          setShowNetworkStatus(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOnline, wasOffline]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-14 items-center">
          <div className="mr-4">
            <BackButton previousPath={previousPath} />
          </div>
          <div className="mr-4">
            <Logo />
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-between sm:space-x-4 md:justify-end">
            <div className="hidden md:flex">
              <DesktopNavigation navItems={defaultNavItems} isActive={isActive} />
            </div>
            <div className="flex items-center gap-2">
              {showNetworkStatus && (
                <NetworkStatusIndicator className="hidden md:flex" />
              )}
              <DesktopAuthButtons isActive={isActive} />
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile network status indicator that appears at the top */}
      {(!isOnline || wasOffline) && (
        <div className="md:hidden sticky top-14 z-30 w-full border-b">
          <NetworkStatusIndicator className="w-full rounded-none py-1 px-4" />
        </div>
      )}
    </>
  );
}
