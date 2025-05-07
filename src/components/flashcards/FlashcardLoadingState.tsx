
import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function FlashcardLoadingState() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex justify-center items-center h-60">
            <div className="text-center">
              <div 
                className="mb-4 h-12 w-12 rounded-full border-4 border-loklernen-ultramarine border-t-transparent mx-auto"
                style={{ animation: 'spinner-rotation 1s linear infinite' }}
              />
              <p className="text-white">Lade Karteikarten...</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style jsx global>{`
        @keyframes spinner-rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
