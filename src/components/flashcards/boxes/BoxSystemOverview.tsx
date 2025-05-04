
import React from 'react';
import { useBoxSystem } from '@/hooks/useBoxSystem';
import LearningBoxItem from './LearningBoxItem';
import BoxContentView from './BoxContentView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Question } from '@/types/questions';

export default function BoxSystemOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    boxStats, 
    activeBox, 
    boxQuestions, 
    loading, 
    handleSelectBox, 
    refreshBoxData 
  } = useBoxSystem();

  // Total due cards across all boxes
  const totalDueCards = boxStats.reduce((sum, box) => sum + (box.due || 0), 0);
  
  // Get stats for currently active box
  const activeBoxStats = activeBox ? boxStats.find(b => b.boxNumber === activeBox) : null;

  // Helper to navigate to learn page
  const handleStartLearning = (boxNumber?: number) => {
    const url = boxNumber 
      ? `/karteikarten/lernen?box=${boxNumber}` 
      : '/karteikarten/lernen';
    
    navigate(url);
  };
  
  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <Card className="p-6 enhanced-glass-card border-gray-800/50 mb-6 shadow-xl rounded-xl">
        <h3 className="text-lg font-bold mb-2 bg-gradient-ultramarine bg-clip-text text-transparent">Lernboxen-System</h3>
        <p className="text-sm text-gray-300 mb-4">
          Melde dich an, um deinen persönlichen Lernfortschritt zu speichern und das Boxen-System zu nutzen.
        </p>
        <Button 
          onClick={() => navigate('/login')}
          className="bg-gradient-ultramarine hover:opacity-90 shadow-lg"
        >
          Anmelden
        </Button>
      </Card>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Card className="p-6 enhanced-glass-card border-gray-800/50 mb-6 shadow-lg rounded-xl">
        <h3 className="text-lg font-bold mb-2 bg-gradient-ultramarine bg-clip-text text-transparent">Lernboxen-System</h3>
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-32 bg-gray-800/60" />
          ))}
        </div>
        <Skeleton className="h-48 bg-gray-800/60" />
      </Card>
    );
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold bg-gradient-ultramarine bg-clip-text text-transparent">Lernboxen-System</h3>
          <p className="text-sm text-gray-300">Dein persönlicher Lernfortschritt</p>
        </div>
        
        <div className="flex gap-3">
          {totalDueCards > 0 && (
            <Button
              onClick={() => handleStartLearning()}
              className="bg-gradient-ultramarine hover:opacity-90 shadow-md transition-all duration-200"
            >
              <Play className="h-4 w-4 mr-2" /> Alle fälligen Karten lernen
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={refreshBoxData}
            className="border-gray-700 bg-black/20 backdrop-blur-lg text-gray-300 hover:bg-gray-800 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Boxes Grid with enhanced visuals */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {boxStats.map((box) => (
          <LearningBoxItem
            key={box.boxNumber}
            boxNumber={box.boxNumber}
            totalCards={box.count}
            dueCards={box.due || 0}
            isActive={activeBox === box.boxNumber}
            onClick={() => handleSelectBox(box.boxNumber)}
          />
        ))}
      </div>

      {/* Box Content View with enhanced design */}
      {activeBox && (
        <BoxContentView
          boxNumber={activeBox}
          questions={boxQuestions as Question[]}
          dueCount={activeBoxStats?.due || 0}
          onStartLearning={() => handleStartLearning(activeBox)}
        />
      )}
    </div>
  );
}
