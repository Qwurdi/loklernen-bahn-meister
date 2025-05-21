
import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MinimalistLoader from "@/components/common/MinimalistLoader";
import '@/styles/animations.css';
import { useMediaQuery } from '@/hooks/use-mobile';

interface FlashcardLoadingStateProps {
  message?: string;
}

export default function FlashcardLoadingState({ message = "Lade Karteikarten..." }: FlashcardLoadingStateProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex justify-center items-center h-60">
            {prefersReducedMotion ? (
              <div className="text-center">
                <div 
                  className="mb-4 h-12 w-12 rounded-full border-2 border-loklernen-ultramarine border-t-transparent mx-auto spinner-rotate"
                />
                <p className="text-white">{message}</p>
              </div>
            ) : (
              <MinimalistLoader message={message} size="lg" />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
