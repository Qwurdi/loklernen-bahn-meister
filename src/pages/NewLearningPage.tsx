
import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLearningSession } from '@/hooks/useLearningSession';
import { QuestionCategory } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import MobileFlashcard from '@/components/learning/MobileFlashcard';
import SessionProgress from '@/components/learning/SessionProgress';
import SessionComplete from '@/components/learning/SessionComplete';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ChevronLeft } from 'lucide-react';

export default function NewLearningPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const sessionStarted = useRef<string>('');
  
  // Parse URL parameters into stable options
  const sessionOptions = useMemo(() => {
    const category = searchParams.get('category') as QuestionCategory;
    const subcategory = searchParams.get('subcategory');
    const regulation = searchParams.get('regulation') as RegulationFilterType;
    const practiceMode = searchParams.get('practice') === 'true';
    const boxNumber = searchParams.get('box') ? parseInt(searchParams.get('box')!) : undefined;

    return {
      category,
      subcategory: subcategory || undefined,
      regulationFilter: regulation || 'all',
      practiceMode,
      boxNumber,
      batchSize: 10
    };
  }, [searchParams.toString()]);

  const {
    session,
    loading,
    error,
    sessionComplete,
    currentQuestion,
    currentIndex,
    progress,
    startSession,
    submitAnswer,
    nextQuestion,
    resetSession
  } = useLearningSession(sessionOptions);

  // Start session only once when options change
  useEffect(() => {
    const optionsKey = JSON.stringify(sessionOptions);
    
    if (sessionStarted.current !== optionsKey) {
      sessionStarted.current = optionsKey;
      startSession();
    }
  }, [sessionOptions, startSession]);

  // Handle mobile viewport lock
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('overflow-hidden');
      document.documentElement.style.height = '100%';
      
      return () => {
        document.body.classList.remove('overflow-hidden');
        document.documentElement.style.height = '';
      };
    }
  }, [isMobile]);

  const handleAnswer = async (score: number) => {
    if (!currentQuestion) return;
    
    await submitAnswer(currentQuestion.id, score);
    
    // Short delay for visual feedback
    setTimeout(() => {
      nextQuestion();
    }, 300);
  };

  const handleRestart = () => {
    sessionStarted.current = '';
    resetSession();
    // Session will restart automatically due to useEffect
  };

  const handleGoHome = () => {
    navigate('/karteikarten');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Lade Lernkarten...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <h2 className="text-xl font-bold">Fehler</h2>
            <p className="mt-2">{error}</p>
          </div>
          <button
            onClick={handleGoHome}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  // Session complete state
  if (sessionComplete && progress) {
    return (
      <SessionComplete
        correctCount={progress.correctCount}
        totalQuestions={progress.total}
        onRestart={handleRestart}
        onHome={handleGoHome}
      />
    );
  }

  // No questions state
  if (!session || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Keine Karten verfügbar
          </h2>
          <p className="text-gray-600 mb-6">
            Es sind keine Lernkarten für die ausgewählten Kriterien verfügbar.
          </p>
          <button
            onClick={handleGoHome}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
        {/* Header */}
        <div className="relative p-4 pb-2">
          <button
            onClick={handleGoHome}
            className="absolute left-4 top-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          {progress && (
            <div className="pt-12">
              <SessionProgress
                current={progress.current}
                total={progress.total}
                correctCount={progress.correctCount}
              />
            </div>
          )}
        </div>
        
        {/* Flashcard */}
        <div className="flex-1 p-4 pt-2">
          <MobileFlashcard
            question={currentQuestion}
            onAnswer={handleAnswer}
            className="h-full"
          />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleGoHome}
            className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Lerneinheit
          </h1>
        </div>
        
        {/* Progress */}
        {progress && (
          <SessionProgress
            current={progress.current}
            total={progress.total}
            correctCount={progress.correctCount}
            className="mb-6"
          />
        )}
        
        {/* Flashcard */}
        <div className="h-96">
          <MobileFlashcard
            question={currentQuestion}
            onAnswer={handleAnswer}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
