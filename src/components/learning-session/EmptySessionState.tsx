
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";

interface EmptySessionStateProps {
  categoryParam: QuestionCategory;
}

export default function EmptySessionState({ categoryParam }: EmptySessionStateProps) {
  const navigate = useNavigate();
  
  const getCategoryPath = () => {
    return categoryParam === "Betriebsdienst" 
      ? "/karteikarten/betriebsdienst" 
      : "/karteikarten";
  };

  return (
    <main className="flex-1 container py-12 flex flex-col items-center justify-center">
      <Card className="p-6 max-w-md text-center bg-gray-900 border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">Keine Karten fällig!</h2>
        <p className="text-gray-300 mb-6">
          Aktuell sind keine Karten zur Wiederholung fällig. Schaue später wieder vorbei oder wähle eine Kategorie, um neue Karten zu lernen.
        </p>
        <Button onClick={() => navigate(getCategoryPath())} className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
          Zu Kategorien
        </Button>
      </Card>
    </main>
  );
}
