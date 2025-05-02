
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";

// Import the refactored section components
import HeroSection from "@/components/home/HeroSection";
import AccessTiersSection from "@/components/home/AccessTiersSection";
import LearningPathSection from "@/components/home/LearningPathSection";
import FeaturesSection from "@/components/home/FeaturesSection";

export default function Index() {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <AccessTiersSection />
        <LearningPathSection />
        <FeaturesSection />
      </main>
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
