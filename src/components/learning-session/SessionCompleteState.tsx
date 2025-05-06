
import { useNetworkStatus } from "@/hooks/use-network-status";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Trophy, 
  RefreshCw, 
  ChevronLeft,
  WifiOff
} from "lucide-react";

interface SessionCompleteStateProps {
  correctCount: number;
  totalCards: number;
  onRestart: () => void;
  pendingUpdates: boolean;
}

export default function SessionCompleteState({
  correctCount,
  totalCards,
  onRestart,
  pendingUpdates
}: SessionCompleteStateProps) {
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const percentCorrect = Math.round((correctCount / totalCards) * 100);
  
  // Determine the message and color based on performance
  let message = "";
  let colorClass = "";
  
  if (percentCorrect >= 90) {
    message = "Hervorragend!";
    colorClass = "text-green-600";
  } else if (percentCorrect >= 75) {
    message = "Sehr gut!";
    colorClass = "text-green-500";
  } else if (percentCorrect >= 50) {
    message = "Gut gemacht!";
    colorClass = "text-amber-500";
  } else {
    message = "Weiter üben!";
    colorClass = "text-amber-600";
  }

  return (
    <main className="flex-1 container py-12 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <Trophy className="h-16 w-16 text-yellow-500" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Session abgeschlossen!</h2>
        <p className={`text-xl font-semibold mb-6 ${colorClass}`}>
          {message}
        </p>
        
        <div className="bg-gray-100 rounded-full h-4 mb-6">
          <div 
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${percentCorrect}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mb-8 text-gray-700">
          <div>
            <span className="font-medium">{correctCount}</span> von {totalCards} richtig
          </div>
          <div>
            <span className="font-medium">{percentCorrect}%</span> Erfolg
          </div>
        </div>
        
        {(pendingUpdates || !isOnline) && (
          <div className="flex items-center justify-center mb-6 bg-blue-50 p-3 rounded-lg">
            {!isOnline ? (
              <WifiOff className="h-5 w-5 mr-2 text-blue-500" />
            ) : (
              <RefreshCw className="h-5 w-5 mr-2 text-blue-500" />
            )}
            <p className="text-blue-700 text-sm">
              {!isOnline
                ? "Du bist offline. Deine Antworten werden später synchronisiert."
                : "Fortschritt wird gespeichert..."}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={onRestart} 
            variant="outline" 
            className="flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Neu starten
          </Button>
          
          <Button
            onClick={() => navigate('/karteikarten')}
            className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90 flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
        </div>
        
        {/* Additional stats */}
        {correctCount > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <p className="text-gray-600">
                {correctCount} neue Karten gelernt
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
