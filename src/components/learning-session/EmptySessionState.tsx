
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { AlertTriangle, WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/hooks/use-network-status";

interface EmptySessionStateProps {
  categoryParam: QuestionCategory;
  showError?: boolean;
}

export default function EmptySessionState({ categoryParam, showError = false }: EmptySessionStateProps) {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  
  const getCategoryPath = () => {
    return categoryParam === "Betriebsdienst" 
      ? "/karteikarten/betriebsdienst" 
      : "/karteikarten";
  };

  return (
    <main className="flex-1 container py-12 flex flex-col items-center justify-center">
      <Card className={`p-6 max-w-md text-center ${
        showError ? 'bg-red-50 border-red-200' : 
        !isOnline ? 'bg-amber-50 border-amber-200' : 
        'bg-gray-900 border-gray-800'
      }`}>
        {showError ? (
          <>
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Laden fehlgeschlagen</h2>
            <p className="text-gray-700 mb-6">
              Es gab ein Problem beim Laden deiner Karteikarten. Bitte versuche es später erneut oder wähle eine andere Kategorie.
            </p>
          </>
        ) : !isOnline ? (
          <>
            <div className="flex justify-center mb-4">
              <WifiOff className="h-12 w-12 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Offline ohne Daten</h2>
            <p className="text-gray-700 mb-6">
              Du bist offline und es wurden keine Karten für diese Kategorie im Cache gefunden. Verbinde dich mit dem Internet, um neue Karten zu laden.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-white">Keine Karten fällig!</h2>
            <p className="text-gray-300 mb-6">
              Aktuell sind keine Karten zur Wiederholung fällig. Schaue später wieder vorbei oder wähle eine Kategorie, um neue Karten zu lernen.
            </p>
          </>
        )}
        <Button 
          onClick={() => navigate(getCategoryPath())} 
          className={
            showError ? "bg-red-600 hover:bg-red-700" : 
            !isOnline ? "bg-amber-600 hover:bg-amber-700" :
            "bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
          }
        >
          Zu Kategorien
        </Button>
      </Card>
    </main>
  );
}
