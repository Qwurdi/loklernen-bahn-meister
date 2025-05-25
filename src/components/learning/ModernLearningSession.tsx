
import React from 'react';
import { Question } from '@/types/questions';
import { SessionOptions } from '@/types/spaced-repetition';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModernFlashcardDisplay from './ModernFlashcardDisplay';
import ModernProgressIndicator from './ModernProgressIndicator';
import ExpressiveCard from './ExpressiveCard';

interface ModernLearningSessionProps {
  currentQuestion: Question;
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  sessionTitle: string;
  sessionOptions: SessionOptions;
  onAnswer: (score: number) => Promise<void>;
  isMobile: boolean;
}

export default function ModernLearningSession({
  currentQuestion,
  currentIndex,
  totalCards,
  correctCount,
  sessionTitle,
  sessionOptions,
  onAnswer,
  isMobile
}: ModernLearningSessionProps) {
  const { regulationPreference } = useUserPreferences();
  const isPracticeMode = sessionOptions.mode === 'practice';

  // Handle answer with smooth animation flow
  const handleAnswer = async (score: number) => {
    await onAnswer(score);
  };

  if (isMobile) {
    return (
      <div className="h-full">
        <ModernFlashcardDisplay
          key={`${currentQuestion.id}-${currentIndex}`}
          question={currentQuestion}
          onAnswer={handleAnswer}
          regulationPreference={regulationPreference}
          className="h-full"
        />
      </div>
    );
  }

  // Modern desktop layout with Material Design Expressive
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Modern header with floating design */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/karteikarten">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-700 hover:bg-gray-100/80 transition-all duration-300 hover:scale-105"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-2">Zurück</span>
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">{sessionTitle}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium shadow-sm">
                {isPracticeMode ? "Übungsmodus" : "Wiederholungsmodus"}
              </div>
              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium shadow-sm">
                {regulationPreference}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with modern layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Modern progress indicator */}
          <ModernProgressIndicator 
            currentIndex={currentIndex}
            totalCards={totalCards}
            correctCount={correctCount}
          />
          
          {/* Main card container */}
          <div className="flex justify-center">
            <ExpressiveCard 
              key={`desktop-${currentQuestion.id}-${currentIndex}`}
              question={currentQuestion} 
              onAnswer={handleAnswer}
              regulationPreference={regulationPreference}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
