import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { QuestionCategory } from "@/types/questions";
import { signalSubCategories } from "@/api/questions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { RegulationFilterType } from "@/types/regulation";
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";
import FlashcardEmptyState from "@/components/flashcards/FlashcardEmptyState";
import FlashcardHeader from "@/components/flashcards/FlashcardHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import CardStack from "@/components/flashcards/stack/CardStack";

// Helper to map URL subcategory param back to original subcategory string (case sensitive)
function mapUrlToSubcategory(urlSubcategory?: string): string | undefined {
  if (!urlSubcategory) return undefined;
  const normalizedParam = urlSubcategory.toLowerCase();

  const found = signalSubCategories.find((subcat) => 
    subcat.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedParam
  );
  return found;
}

export default function FlashcardPage() {
  console.log("FlashcardPage: Initializing component");
  
  const { subcategory: urlSubcategory } = useParams<{ subcategory: string }>();
  const subcategory = mapUrlToSubcategory(urlSubcategory); // map to original subcategory
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [isPracticeMode] = useState(true);
  const { regulationPreference } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  
  // Get regulation filter from URL or default to user preference
  const regulationParam = searchParams.get("regelwerk") as RegulationFilterType || regulationPreference;

  // Pass the regulation preference to the hook
  const {
    loading,
    dueQuestions: questions,
    submitAnswer
  } = useSpacedRepetition(
    "Signale" as QuestionCategory, 
    subcategory, 
    { 
      practiceMode: isPracticeMode,
      regulationCategory: regulationParam
    }
  );

  console.log("FlashcardPage: Loaded questions count:", questions?.length || 0);

  // Query to get total due cards count for today
  const { data: dueTodayStats } = useQuery({
    queryKey: ['dueTodayCount', user?.id, regulationParam],
    queryFn: async () => {
      if (!user) return { count: 0 };
      
      const { count, error } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString());
        
      if (error) throw error;
      
      return { count: count || 0 };
    },
    enabled: !!user
  });

  const remainingToday = (dueTodayStats?.count || 0);

  const handleAnswer = async (questionId: string, score: number) => {
    if (user) {
      await submitAnswer(questionId, score);
    }

    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    setSessionFinished(true);
    toast.success("Gut gemacht! Du hast alle Karten dieser Kategorie bearbeitet!");
  };

  // Update regulation filter when it changes
  const handleRegulationChange = (value: RegulationFilterType) => {
    setSearchParams(params => {
      params.set("regelwerk", value);
      return params;
    });
  };

  // Apply mobile mode styles
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('overflow-hidden', 'fixed', 'inset-0', 'h-full', 'w-full');
      
      return () => {
        document.body.style.overflow = '';
        document.documentElement.classList.remove('overflow-hidden', 'fixed', 'inset-0', 'h-full', 'w-full');
      };
    }
  }, [isMobile]);

  if (loading) {
    return <FlashcardLoadingState />;
  }

  if (!loading && questions.length === 0) {
    return <FlashcardEmptyState />;
  }

  // Handle session completion
  if (sessionFinished) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Navbar />
        <main className="flex-1 container py-12 flex flex-col items-center justify-center">
          <div className="p-6 max-w-md text-center bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Kategorie abgeschlossen!</h2>
            <p className="text-gray-300 mb-6">
              Du hast {correctCount} von {questions.length} Karten richtig beantwortet.
              ({Math.round((correctCount / questions.length) * 100)}%)
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/karteikarten')}
                className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
              >
                Zurück zur Übersicht
              </Button>
            </div>
          </div>
        </main>
        {!isMobile && <Footer />}
        {isMobile && <BottomNavigation />}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMobile ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-black text-white`}>
      <Navbar />
      
      <main className="flex-1">
        <div className={`${isMobile ? 'px-0 pt-0 pb-16 h-full' : 'container px-4 py-6'}`}>
          <FlashcardHeader 
            subcategory={subcategory}
            isPracticeMode={isPracticeMode}
            regulationFilter={regulationParam}
            onRegulationChange={handleRegulationChange}
          />
          
          {/* Card Stack */}
          <div className="h-full pt-2">
            <CardStack 
              questions={questions}
              onAnswer={handleAnswer}
              onComplete={handleComplete}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
