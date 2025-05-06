
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";

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
  return (
    <div className={`flex flex-col ${isMobile && fullHeight ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-white text-gray-800`}>
      <Navbar />
      
      {children}
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
