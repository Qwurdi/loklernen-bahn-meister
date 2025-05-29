
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";

interface FlashcardSessionCompleteProps {
  correctCount: number;
  totalQuestions: number;
  isMobile: boolean;
}

const FlashcardSessionComplete: React.FC<FlashcardSessionCompleteProps> = ({ 
  correctCount, 
  totalQuestions,
  isMobile 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 container py-12 flex flex-col items-center justify-center">
        <div className="p-6 max-w-md text-center bg-gray-900 rounded-xl shadow-lg border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Kategorie abgeschlossen!</h2>
          <p className="text-gray-300 mb-6">
            Du hast {correctCount} von {totalQuestions} Karten richtig beantwortet.
            ({totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0}%)
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/karteikarten')}
              className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
            >
              Zurück zur Übersicht
            </Button>
          </div>
        </div>
      </main>
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default FlashcardSessionComplete;
