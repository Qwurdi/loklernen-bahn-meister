
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function FlashcardEmptyState() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Keine Karten fällig</h2>
            <p className="mb-8">Du hast aktuell keine Karten zum Wiederholen. Schau später wieder vorbei!</p>
            <Link to="/karteikarten">
              <Button>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Zurück zur Übersicht
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
