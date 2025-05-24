
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, Loader2, RotateCw } from "lucide-react";

// Update interface to match expected props in LearningSessionPage
export interface SessionCompleteStateProps {
  correctCount: number;
  totalCards: number;
  onRestart: () => void;
  pendingUpdates?: boolean;
}

const SessionCompleteState: React.FC<SessionCompleteStateProps> = ({
  correctCount,
  totalCards,
  onRestart,
  pendingUpdates = false
}) => {
  const navigate = useNavigate();
  const percentage = Math.round((correctCount / totalCards) * 100);
  
  const renderCompletionMessage = () => {
    if (percentage >= 90) {
      return "Hervorragend! Du hast fast alles richtig beantwortet.";
    } else if (percentage >= 70) {
      return "Gut gemacht! Das ist ein solides Ergebnis.";
    } else if (percentage >= 50) {
      return "Nicht schlecht! Mit etwas Übung wirst du besser.";
    } else {
      return "Diese Themen brauchst du noch etwas Übung. Bleib dran!";
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center max-w-md w-full shadow-sm">
        <div className="mb-6">
          <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Session abgeschlossen!</h3>
          <p className="text-gray-600">{renderCompletionMessage()}</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-2">
            <div className="text-center">
              <div className="text-2xl font-bold">{correctCount}</div>
              <div className="text-sm text-gray-500">Richtig</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalCards}</div>
              <div className="text-sm text-gray-500">Gesamt</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/karteikarten")}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Zurück zur Übersicht
            </Button>
            
            <Button
              onClick={onRestart}
              className="flex-1 relative"
              disabled={pendingUpdates}
            >
              {pendingUpdates ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Aktualisiere Fortschritt...
                </>
              ) : (
                <>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Erneut lernen
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCompleteState;
