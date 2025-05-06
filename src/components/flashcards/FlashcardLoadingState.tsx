
import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FlashcardLoadingState() {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex justify-center items-center h-60">
            <div className="text-center">
              <div className="mb-6">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-loklernen-ultramarine border-loklernen-ultramarine border-opacity-30 mx-auto"></div>
              </div>
              <p className="text-white text-lg">Lade Karteikarten...</p>
              <p className="text-gray-400 text-sm mt-2">Das kann einen Moment dauern.</p>
            </div>
          </div>
        </div>
      </main>
      {isMobile ? <BottomNavigation /> : <Footer />}
    </div>
  );
}
