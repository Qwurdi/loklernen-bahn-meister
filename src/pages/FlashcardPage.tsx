import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { QuestionCategory } from "@/types/questions";
import { signalSubCategories } from "@/api/categories/types";
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
import EmptySessionState from '@/components/learning-session/EmptySessionState';
import { SessionType } from "@/hooks/spaced-repetition/types";

// Helper to map URL subcategory param back to original subcategory string (case sensitive)
function mapUrlToSubcategory(urlSubcategory?: string): string | undefined {
  if (!urlSubcategory) return undefined;
  const normalizedParam = urlSubcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // This is a simplified example; a more robust mapping might be needed
  const knownSubcategories = [...signalSubCategories]; // Add Betriebsdienst subcategories if needed
  const found = knownSubcategories.find((subcat) => 
    subcat.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedParam
  );
  return found || urlSubcategory; // Fallback to original if not found, assuming it might be correct
}

export default function FlashcardPage() {
  console.log("FlashcardPage: Initializing component");
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { subcategory: urlSubcategoryParam } = useParams<{ subcategory: string }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const { regulationPreference } = useUserPreferences();
  const isMobile = useIsMobile();
  
  const regulationParam = searchParams.get("regelwerk") as RegulationFilterType || regulationPreference;

  // Determine mainCategory and subCategory for fetching questions
  let mainCategoryForHook: QuestionCategory = 'Signale'; // Default
  let subCategoryForHook: string | undefined = undefined;

  const categoryUrlQueryParam = searchParams.get('category');
  const categoriesUrlQueryParam = searchParams.getAll('categories');

  if (urlSubcategoryParam) {
    const mappedSubcategory = mapUrlToSubcategory(urlSubcategoryParam);
    if (mappedSubcategory) {
      const pathSegments = window.location.pathname.split('/');
      if (pathSegments.includes('signale')) {
        mainCategoryForHook = 'Signale';
      } else if (pathSegments.includes('betriebsdienst')) {
        mainCategoryForHook = 'Betriebsdienst';
      }
      subCategoryForHook = mappedSubcategory;
    }
  } else if (categoryUrlQueryParam) {
    if (categoryUrlQueryParam.toLowerCase() === 'signale') {
      mainCategoryForHook = 'Signale';
    } else if (categoryUrlQueryParam.toLowerCase() === 'betriebsdienst') {
      mainCategoryForHook = 'Betriebsdienst';
    } else {
      const potentialSubCategory = mapUrlToSubcategory(categoryUrlQueryParam);
      if (signalSubCategories.map(s => s.toLowerCase()).includes(potentialSubCategory?.toLowerCase() || '')) {
         mainCategoryForHook = 'Signale';
         subCategoryForHook = potentialSubCategory;
      } else {
         mainCategoryForHook = 'Signale';
      }
    }
  } else if (categoriesUrlQueryParam.length > 0) {
    const isBetriebsdienstLikely = categoriesUrlQueryParam.some(
      cat => cat.toLowerCase().includes('betriebsdienst')
    );
    mainCategoryForHook = isBetriebsdienstLikely ? 'Betriebsdienst' : 'Signale';
  }

  const isPracticeMode = !user;
  
  // Fixed parameter order: userId, options, initialCardIdsToLoad
  const {
    loading,
    dueQuestions: questions,
    submitAnswer,
    startNewSession // Make sure we expose this function
  } = useSpacedRepetition(
    user?.id, 
    { 
      practiceMode: isPracticeMode,
      regulationCategory: regulationParam
    }
  );

  console.log(`FlashcardPage: Loading for mainCat: ${mainCategoryForHook}, subCat: ${subCategoryForHook}, practice: ${isPracticeMode}`);
  console.log("FlashcardPage: Loaded questions count:", questions?.length || 0);

  // Use useEffect to start a new session when component mounts or when key parameters change
  useEffect(() => {
    if (loading) return;
    
    let sessionType: SessionType = 'category';
    // For guest mode
    if (isPracticeMode) {
      sessionType = 'guest';
    }
    
    console.log(`Starting new session with: type=${sessionType}, category=${mainCategoryForHook}, subcategory=${subCategoryForHook}, regulation=${regulationParam}`);
    startNewSession(sessionType, mainCategoryForHook, regulationParam);
  }, [startNewSession, mainCategoryForHook, regulationParam, isPracticeMode, loading]);

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

  const handleRegulationChange = (value: RegulationFilterType) => {
    setSearchParams(params => {
      params.set("regelwerk", value);
      return params;
    });
  };

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

  if (!loading && questions.length === 0 && !sessionFinished) {
    const boxUrlParam = searchParams.get('box');
    const questionIdUrlParam = searchParams.get('questionId');
    const dueUrlParam = searchParams.get('due');
    const isGuest = !user;

    const isGuestLearningSpecificCategory =
      isGuest &&
      (!!categoryUrlQueryParam || categoriesUrlQueryParam.length > 0 || !!urlSubcategoryParam) &&
      !boxUrlParam &&
      !questionIdUrlParam &&
      dueUrlParam !== 'true';

    if (isGuestLearningSpecificCategory) {
      return (
        <EmptySessionState
          categoryParam={mainCategoryForHook}
          isGuestLearningCategory={true}
        />
      );
    } else {
      if (dueUrlParam === 'true') {
        return <FlashcardEmptyState />;
      } else {
        return <EmptySessionState categoryParam={mainCategoryForHook} />;
      }
    }
  }

  if (sessionFinished) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <Navbar />
        <main className="flex-1 container py-12 flex flex-col items-center justify-center">
          <div className="p-6 max-w-md text-center bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Kategorie abgeschlossen!</h2>
            <p className="text-gray-300 mb-6">
              Du hast {correctCount} von {questions.length} Karten richtig beantwortet.
              ({questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0}%)
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
            subcategory={subCategoryForHook || mainCategoryForHook}
            isPracticeMode={isPracticeMode}
            onRegulationChange={handleRegulationChange}
          />
          
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
