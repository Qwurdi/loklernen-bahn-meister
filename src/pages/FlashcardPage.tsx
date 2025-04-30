import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { QuestionCategory } from "@/types/questions";
import { signalSubCategories } from "@/api/questions";
import FlashcardItem from "@/components/flashcards/FlashcardItem";
import FlashcardProgress from "@/components/flashcards/FlashcardProgress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";

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
  const { subcategory: urlSubcategory } = useParams<{ subcategory: string }>();
  const subcategory = mapUrlToSubcategory(urlSubcategory); // map to original subcategory
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPracticeMode] = useState(true);
  const { regulationPreference } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get regulation filter from URL or default to user preference
  const regulationParam = searchParams.get("regelwerk") || regulationPreference;

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

  // Update regulation filter when it changes
  const handleRegulationChange = (value: RegulationFilterType) => {
    setSearchParams(params => {
      params.set("regelwerk", value);
      return params;
    });
  };

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

  const currentQuestion = questions[currentIndex];
  const remainingToday = (dueTodayStats?.count || 0) - (currentIndex > 0 ? 1 : 0);

  const handleAnswer = async (score: number) => {
    if (!currentQuestion) return;

    if (user) {
      await submitAnswer(currentQuestion.id, score);
    }

    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
      toast.success("Richtig! Weiter so!");
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      navigate('/karteikarten');
      toast.success("Gut gemacht! Du hast alle fälligen Karten für heute geschafft!");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container px-4 py-6">
            <div className="flex justify-center items-center h-60">
              <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                <p>Lade Karteikarten...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container px-4 py-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Keine Karten fällig</h2>
              <p className="mb-8">Du hast aktuell keine Karten zum Wiederholen. Schau später wieder vorbei!</p>
              <Link to="/karteikarten">
                <Button>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Zurück zur Übersicht
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link to="/karteikarten">
                <Button variant="ghost" size="sm" className={isMobile ? "px-2" : ""}>
                  <ChevronLeft className="h-4 w-4" />
                  {!isMobile && <span className="ml-2">Zurück</span>}
                </Button>
              </Link>
              {!isMobile && <h1 className="text-xl font-semibold ml-2">{subcategory}</h1>}
            </div>
            {!isMobile && (
              <div className="flex items-center gap-4">
                <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                  {isPracticeMode ? "Übungsmodus" : "Wiederholungsmodus"}
                </span>
              </div>
            )}
          </div>
          
          {isMobile && <h1 className="text-lg font-semibold mb-4">{subcategory}</h1>}
          
          {/* Regulation filter */}
          <div className="mb-4">
            <RegulationFilterToggle
              value={regulationParam}
              onChange={handleRegulationChange}
              variant="outline"
              size="sm"
              className="mb-4"
            />
          </div>
          
          {/* Main content - flashcard first, then progress */}
          {currentQuestion && (
            <div className="space-y-6">
              <FlashcardItem 
                question={currentQuestion} 
                onAnswer={handleAnswer}
                onNext={handleNext}
              />
              
              <FlashcardProgress 
                currentIndex={currentIndex}
                totalCards={questions.length}
                correctCount={correctCount}
                remainingToday={remainingToday}
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
