
import { ReactNode, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useMobileFullscreen } from "@/hooks/use-mobile-fullscreen";

interface SessionContainerProps {
  children: ReactNode;
  isMobile: boolean;
  fullHeight?: boolean;
}

export default function SessionContainer({ 
  children, 
  isMobile,
  fullHeight = false
}: SessionContainerProps) {
  // Use the mobile fullscreen hook only when fullHeight is true
  const { isFullscreenMobile, toggleFullscreen } = useMobileFullscreen(isMobile && fullHeight);
  
  // Enable fullscreen mode automatically when the component mounts if needed
  useEffect(() => {
    if (isMobile && fullHeight && !isFullscreenMobile) {
      toggleFullscreen();
    }
  }, [isMobile, fullHeight, isFullscreenMobile, toggleFullscreen]);
  
  return (
    <div className={`flex flex-col ${isMobile && fullHeight ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'} bg-white text-gray-800`}>
      <Navbar />
      
      {children}
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
