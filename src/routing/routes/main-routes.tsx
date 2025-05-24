
import React from "react";
import { Route } from "react-router-dom";

// Import pages
import HomePage from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import CardsPage from "@/pages/CardsPage";
import SignalePage from "@/pages/SignalePage";
import BetriebsdienstPage from "@/pages/BetriebsdienstPage";
import FlashcardPage from "@/pages/FlashcardPage";
import LearningSessionPage from "@/pages/LearningSessionPage";
import MobileFlashcardPage from "@/components/flashcards/mobile/MobileFlashcardPage";
import { useIsMobile } from "@/hooks/use-mobile";

// Placeholder components
const AboutPage = () => <div>About Page</div>;
const PrivacyPage = () => <div>Privacy Policy</div>;
const ImprintPage = () => <div>Imprint</div>;

// Flashcard route component that conditionally renders based on device
export const FlashcardRoute = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileFlashcardPage /> : <FlashcardPage />;
};

// Main application routes
export const mainRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/imprint" element={<ImprintPage />} />
    <Route path="/karteikarten" element={<CardsPage />} />
    <Route path="/karteikarten/signale" element={<SignalePage />} />
    <Route path="/karteikarten/betriebsdienst" element={<BetriebsdienstPage />} />
    <Route path="/karteikarten/lernen" element={<FlashcardRoute />} />
    <Route path="/karteikarten/box/:boxIndex" element={<LearningSessionPage />} />
    <Route path="*" element={<NotFound />} />
  </>
);
