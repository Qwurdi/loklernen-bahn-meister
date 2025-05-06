
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";
import { AlertTriangle } from "lucide-react";

interface EmptySessionStateProps {
  categoryParam: QuestionCategory;
  showError?: boolean;
}

export default function EmptySessionState({ categoryParam, showError = false }: EmptySessionStateProps) {
  const navigate = useNavigate();
  
  const getCategoryPath = () => {
    return categoryParam === "Betriebsdienst" 
      ? "/karteikarten/betriebsdienst" 
      : "/karteikarten";
  };

  return (
    <main className="flex-1 container py-12 flex flex-col items-center justify-center">
      <Card className={`p-6 max-w-md text-center ${showError ? 'bg-red-50 border-red-200' : 'bg-gray-900 border-gray-800'}`}>
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
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-white">Keine Karten fällig!</h2>
            <p className="text-gray-300 mb-6">
              Aktuell sind keine Karten zur Wiederholung fällig. Schaue später wieder vorbei oder wähle eine Kategorie, um neue Karten zu lernen.
            </p>
          </>
        )}
        <Button onClick={() => navigate(getCategoryPath())} className={showError ? "bg-red-600 hover:bg-red-700" : "bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"}>
          Zu Kategorien
        </Button>
      </Card>
    </main>
  );
}
