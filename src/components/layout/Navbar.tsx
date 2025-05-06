
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DesktopNavigation from "./navbar/DesktopNavigation";
import DesktopAuthButtons from "./navbar/DesktopAuthButtons";
import Logo from "./navbar/Logo";
import BackButton from "./navbar/BackButton";
import NetworkStatusIndicator from "@/components/common/NetworkStatusIndicator";
import { useNetworkStatus } from "@/hooks/use-network-status";

export default function Navbar() {
  const navigate = useNavigate();
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showNetworkStatus, setShowNetworkStatus] = useState(false);

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
            <BackButton />
          </div>
          <div className="mr-4">
            <Logo />
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-between sm:space-x-4 md:justify-end">
            <div className="hidden md:flex">
              <DesktopNavigation />
            </div>
            <div className="flex items-center gap-2">
              {showNetworkStatus && (
                <NetworkStatusIndicator className="hidden md:flex" />
              )}
              <DesktopAuthButtons />
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
