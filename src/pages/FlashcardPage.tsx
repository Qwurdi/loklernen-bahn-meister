
import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
import FlashcardContent from "@/components/flashcards/FlashcardContent";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPracticeMode] = useState(true);
  const { regulationPreference } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  
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

  // Update regulation filter when it changes
  const handleRegulationChange = (value: RegulationFilterType) => {
    setSearchParams(params => {
      params.set("regelwerk", value);
      return params;
    });
  };

  if (loading) {
    return <FlashcardLoadingState />;
  }

  if (!loading && questions.length === 0) {
    return <FlashcardEmptyState />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-6">
          <FlashcardHeader 
            subcategory={subcategory}
            isPracticeMode={isPracticeMode}
            regulationFilter={regulationParam}
            onRegulationChange={handleRegulationChange}
          />
          
          {/* Main content - flashcard first, then progress */}
          {currentQuestion && (
            <FlashcardContent 
              currentQuestion={currentQuestion}
              currentIndex={currentIndex}
              totalCards={questions.length}
              correctCount={correctCount}
              remainingToday={remainingToday}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
