
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, RefreshCw } from "lucide-react";

interface EmptySessionStateProps {
  message?: string;
  categoryParam?: string | null;
  isGuestLearningCategory?: boolean;
}

const EmptySessionState: React.FC<EmptySessionStateProps> = ({ 
  message, 
  categoryParam,
  isGuestLearningCategory = false
}) => {
  const navigate = useNavigate();

  const defaultMessage = categoryParam
    ? `Keine Karten für die Kategorie "${categoryParam}" verfügbar.`
    : "Keine Karten zum Lernen verfügbar.";

  // Special message for guests trying to access categories requiring authentication
  const displayMessage = isGuestLearningCategory
    ? "Bitte melde dich an, um auf diese Karten zuzugreifen."
    : (message || defaultMessage);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center max-w-md w-full">
        <h3 className="text-xl font-semibold mb-2">Keine Karten</h3>
        <p className="text-gray-600 mb-6">{displayMessage}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/karteikarten")}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Button>
          
          {isGuestLearningCategory ? (
            <Button 
              onClick={() => navigate("/login")} 
              className="flex items-center gap-2"
            >
              Anmelden
            </Button>
          ) : (
            <Button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Aktualisieren
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptySessionState;
