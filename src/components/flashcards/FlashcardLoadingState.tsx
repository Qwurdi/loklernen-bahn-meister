
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function FlashcardLoadingState() {
  const isMobile = useIsMobile();
  const [showBackButton, setShowBackButton] = useState(false);
  
  // Show back button after 5 seconds in case loading gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBackButton(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-6">
          {showBackButton && (
            <div className="flex justify-start mb-4">
              <Link to="/karteikarten">
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Zurück
                </Button>
              </Link>
            </div>
          )}
          
          <div className="flex justify-center items-center h-60">
            <div className="text-center">
              <div className="mb-6">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-loklernen-ultramarine border-loklernen-ultramarine border-opacity-30 mx-auto"></div>
              </div>
              <p className="text-white text-lg">Lade Karteikarten...</p>
              <p className="text-gray-400 text-sm mt-2">Das kann einen Moment dauern.</p>
              
              {showBackButton && (
                <p className="text-gray-300 text-xs mt-6">
                  Falls das Laden zu lange dauert, klicke auf "Zurück" und versuche es später erneut.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      {isMobile ? <BottomNavigation /> : <Footer />}
    </div>
  );
}
