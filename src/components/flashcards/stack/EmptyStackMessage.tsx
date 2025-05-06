
import React from 'react';
import { Button } from '@/components/ui/button';
import { Box, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStackMessageProps {
  isCompleted?: boolean;
}

export default function EmptyStackMessage({ isCompleted = false }: EmptyStackMessageProps) {
  const navigate = useNavigate();

  // Return to cards page
  const handleBackToCards = () => {
    navigate('/karteikarten');
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
        <div className="bg-green-100 rounded-full p-4 mb-4">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Gut gemacht!</h2>
        <p className="text-gray-600 mb-6">
          Du hast alle Karten in dieser Sitzung bearbeitet.
        </p>
        <Button onClick={handleBackToCards} className="bg-loklernen-ultramarine">
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
      <div className="bg-blue-100 rounded-full p-4 mb-4">
        <Box size={48} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold mb-2">Keine Karten verfügbar</h2>
      <p className="text-gray-600 mb-6">
        Es wurden keine Karten für diese Kategorie gefunden. Bitte wähle eine andere Kategorie aus.
      </p>
      <Button onClick={handleBackToCards} className="bg-loklernen-ultramarine">
        Zurück zur Übersicht
      </Button>
    </div>
  );
}
