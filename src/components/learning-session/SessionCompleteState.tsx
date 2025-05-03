
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface SessionCompleteStateProps {
  correctCount: number;
  totalCards: number;
  onRestart: () => void;
}

export default function SessionCompleteState({ 
  correctCount, 
  totalCards, 
  onRestart 
}: SessionCompleteStateProps) {
  const navigate = useNavigate();
  
  const handleEndSession = () => {
    navigate("/karteikarten");
  };
  
  return (
    <main className="flex-1 container py-12 flex flex-col items-center justify-center">
      <Card className="p-6 max-w-md text-center bg-gray-900 border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">Session abgeschlossen!</h2>
        <p className="text-gray-300 mb-6">
          Du hast {correctCount} von {totalCards} Karten richtig beantwortet.
          ({Math.round((correctCount / totalCards) * 100)}%)
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={onRestart} variant="outline" className="border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800">
            Neu starten
          </Button>
          <Button onClick={handleEndSession} className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
            Zum Dashboard
          </Button>
        </div>
      </Card>
    </main>
  );
}
