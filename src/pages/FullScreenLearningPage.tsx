
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLearningSession } from '@/hooks/useLearningSession';
import { QuestionCategory } from '@/types/questions';
import { RegulationFilterType } from '@/types/regulation';
import MobileFlashcardDisplay from '@/components/learning/MobileFlashcardDisplay';
import SessionComplete from '@/components/learning/SessionComplete';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ChevronLeft, Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function FullScreenLearningPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [preloadingComplete, setPreloadingComplete] = useState(false);
  
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
  }, [searchParams]);

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

  // Preload all images when session starts
  useEffect(() => {
    if (session && session.questions.length > 0 && !preloadingComplete) {
      const preloadImages = async () => {
        const imagePromises = session.questions
          .filter(q => q.image_url)
          .map(q => {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve; // Continue even if image fails
              img.src = q.image_url!;
            });
          });

        await Promise.all(imagePromises);
        setPreloadingComplete(true);
        toast.success('Alle Bilder geladen - bereit zum Lernen!');
      };

      preloadImages();
    }
  }, [session, preloadingComplete]);

  // Start session on mount
  useEffect(() => {
    startSession();
  }, [startSession]);

  // Lock viewport for mobile
  useEffect(() => {
    if (isMobile) {
      document.body.classList.add('flashcard-mode');
      document.documentElement.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        document.body.classList.remove('flashcard-mode');
        document.documentElement.style.height = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [isMobile]);

  const handleAnswer = async (score: number) => {
    if (!currentQuestion) return;
    
    await submitAnswer(currentQuestion.id, score);
    
    setTimeout(() => {
      nextQuestion();
    }, 300);
  };

  const handleRestart = () => {
    setPreloadingComplete(false);
    resetSession();
  };

  const handleGoHome = () => {
    navigate('/karteikarten');
  };

  // Loading state
  if (loading || (session && !preloadingComplete)) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">
            {loading ? 'Lade Lernkarten...' : 'Lade Bilder...'}
          </p>
          {session && !preloadingComplete && (
            <div className="mt-2 text-sm text-gray-500">
              {session.questions.filter(q => q.image_url).length} Bilder werden geladen
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
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
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
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

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Ultra-thin progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 z-20">
        <div 
          className="h-full bg-gradient-to-r from-loklernen-ultramarine to-blue-600 transition-all duration-300"
          style={{ width: `${progress ? progress.percentage : 0}%` }}
        />
      </div>

      {/* Floating back button */}
      <button
        onClick={handleGoHome}
        className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 shadow-sm"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Progress info */}
      {progress && (
        <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-gray-700">
          {progress.current}/{progress.total}
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 p-4 pt-16">
        <MobileFlashcardDisplay
          question={currentQuestion}
          onAnswer={handleAnswer}
          className="h-full"
        />
      </div>
    </div>
  );
}
