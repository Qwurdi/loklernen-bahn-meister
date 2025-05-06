
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";

interface SessionCompletedViewProps {
  correctCount: number;
  totalQuestions: number;
}

export default function SessionCompletedView({
  correctCount,
  totalQuestions
}: SessionCompletedViewProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 container py-12 flex flex-col items-center justify-center">
        <div className="p-6 max-w-md text-center bg-gray-900 rounded-xl shadow-lg border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Kategorie abgeschlossen!</h2>
          <p className="text-gray-300 mb-6">
            Du hast {correctCount} von {totalQuestions} Karten richtig beantwortet.
            ({percentage}%)
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
}
