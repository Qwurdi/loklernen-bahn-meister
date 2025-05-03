
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
      <Card className="p-4 bg-gray-900 border-gray-800 mb-6">
        <h3 className="text-lg font-bold mb-2">Lernboxen-System</h3>
        <p className="text-sm text-gray-400 mb-4">
          Melde dich an, um deinen persönlichen Lernfortschritt zu speichern und das Boxen-System zu nutzen.
        </p>
        <Button 
          onClick={() => navigate('/login')}
          className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
        >
          Anmelden
        </Button>
      </Card>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Card className="p-4 bg-gray-900 border-gray-800 mb-6">
        <h3 className="text-lg font-bold mb-2">Lernboxen-System</h3>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 bg-gray-800" />
          ))}
        </div>
        <Skeleton className="h-40 bg-gray-800" />
      </Card>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold">Lernboxen-System</h3>
          <p className="text-sm text-gray-400">Dein persönlicher Lernfortschritt</p>
        </div>
        
        <div className="flex gap-2">
          {totalDueCards > 0 && (
            <Button
              onClick={() => handleStartLearning()}
              className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
            >
              <Play className="h-4 w-4 mr-1" /> Alle fälligen Karten lernen
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={refreshBoxData}
            className="border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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

      {/* Box Content View */}
      {activeBox && (
        <BoxContentView
          boxNumber={activeBox}
          questions={boxQuestions}
          dueCount={activeBoxStats?.due || 0}
          onStartLearning={() => handleStartLearning(activeBox)}
        />
      )}
    </div>
  );
}
