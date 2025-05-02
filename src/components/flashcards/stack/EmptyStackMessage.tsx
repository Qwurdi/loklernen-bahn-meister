
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyStackMessageProps {
  isCompleted?: boolean;
}

export default function EmptyStackMessage({ isCompleted = false }: EmptyStackMessageProps) {
  const navigate = useNavigate();
  
  const handleResetLesson = () => {
    // Navigate to the same page with a reset parameter to trigger a fresh state
    const currentPath = window.location.pathname;
    navigate(currentPath, { state: { reset: true } });
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {isCompleted ? (
        <>
          <h2 className="text-2xl font-bold mb-3">Großartig!</h2>
          <p className="text-gray-600 mb-6">
            Du hast alle Karteikarten in dieser Lektion abgeschlossen.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button 
              onClick={() => navigate('/karteikarten')}
              className="w-full"
            >
              Zurück zur Übersicht
            </Button>
            <Button
              variant="outline"
              onClick={handleResetLesson}
              className="w-full"
            >
              Lektion wiederholen
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-3">Keine Karten verfügbar</h2>
          <p className="text-gray-600 mb-6">
            Es sind derzeit keine Karteikarten in dieser Kategorie verfügbar.
          </p>
          <Button 
            onClick={() => navigate('/karteikarten')}
          >
            Zurück zur Übersicht
          </Button>
        </>
      )}
    </div>
  );
}
