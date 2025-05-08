import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";
import { useSessionParams } from "@/hooks/learning-session/useSessionParams";
import SessionContainer from "@/components/learning-session/SessionContainer";
import SessionHeader from "@/components/learning-session/SessionHeader";
import EmptySessionState from "@/components/learning-session/EmptySessionState";
import SessionCompleteState from "@/components/learning-session/SessionCompleteState";
import CardStackSession from "@/components/learning-session/CardStackSession";
import { Question } from "@/types/questions";
import { useCategories } from "@/hooks/useCategories"; // Added useCategories
import { Category } from "@/api/categories/types"; // Added Category type
import { useToast, toast as globalToast } from "@/hooks/use-toast"; // Import toasts array

// Define a new type for access status
type AccessStatus = "pending" | "allowed" | "denied_auth" | "denied_pro" | "not_found" | "no_selection";

// Define a constant for the toast ID
const NO_CARDS_FOUND_TOAST_ID = "no-cards-found-toast";

export default function LearningSessionPage() {
  console.log("LearningSessionPage: Initializing component");

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Added
  const isMobile = useIsMobile();
  const { toast, toasts } = useToast(); // Destructure toasts from useToast

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Question[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [resolvedSessionTitle, setResolvedSessionTitle] = useState<string>(""); // For updating title with names

  const { categories, isLoading: categoriesLoading, error: categoriesDbError } = useCategories(); // Added
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("pending");

  const {
    singleCategoryIdentifier,
    multipleCategoryIdentifiers,
    regulationParam,
    boxParam,
    sessionTitle: initialSessionTitle, // Renamed to avoid conflict
    practiceMode
  } = useSessionParams();

  // Memoize categoryIdentifiersForHook to prevent re-renders
  const categoryIdentifiersForHook = useMemo(() => {
    if (multipleCategoryIdentifiers && multipleCategoryIdentifiers.length > 0) {
      return multipleCategoryIdentifiers;
    }
    if (singleCategoryIdentifier) {
      return [singleCategoryIdentifier];
    }
    return [];
  }, [multipleCategoryIdentifiers, singleCategoryIdentifier]);

  // Memoize options for useSpacedRepetition to prevent re-renders
  const spacedRepetitionOptions = useMemo(() => ({
    practiceMode: practiceMode,
    regulationCategory: regulationParam,
    boxNumber: boxParam,
    batchSize: 15 // Ideal batch size for balance between performance and cognitive load
  }), [practiceMode, regulationParam, boxParam]);

  useEffect(() => {
    setResolvedSessionTitle(initialSessionTitle); // Set initial title
  }, [initialSessionTitle]);

  console.log("Learning session parameters from hook:", {
    singleCategoryIdentifier,
    multipleCategoryIdentifiers,
    regulation: regulationParam,
    box: boxParam,
    practiceMode
  });

  useEffect(() => {
    if (categoriesLoading) {
      setAccessStatus("pending");
      return;
    }
    if (categoriesDbError) {
      toast.error("Fehler beim Laden der Kategoriedaten.", { description: categoriesDbError.message });
      setAccessStatus("not_found"); // Or a new error state
      return;
    }

    // If no specific category is selected (e.g., for global due cards review)
    if (!singleCategoryIdentifier && (!multipleCategoryIdentifiers || multipleCategoryIdentifiers.length === 0)) {
      setAccessStatus("no_selection"); // Or "allowed" if global review doesn't need these checks
      // Potentially update title for global review if not already handled by useSessionParams
      if (!initialSessionTitle.includes("Fällige Karten")) {
        setResolvedSessionTitle("Fällige Karten (Alle Kategorien)");
      }
      return;
    }

    let targetCategories: Category[] = [];
    let notFoundIdentifiers: string[] = [];

    if (multipleCategoryIdentifiers && multipleCategoryIdentifiers.length > 0) {
      targetCategories = multipleCategoryIdentifiers.map(idOrName => {
        const found = categories.find(cat => cat.name === idOrName || cat.id === idOrName);
        if (!found) notFoundIdentifiers.push(idOrName);
        return found;
      }).filter(Boolean) as Category[];
      
      if (notFoundIdentifiers.length > 0) {
        toast.error("Einige Kategorien wurden nicht gefunden:", { description: notFoundIdentifiers.join(', ') });
        setAccessStatus("not_found");
        return;
      }
      // Update session title for multiple categories if needed (e.g. with count)
      setResolvedSessionTitle(`Auswahl (${targetCategories.length} Kategorien)`);

    } else if (singleCategoryIdentifier) {
      const foundCat = categories.find(cat => cat.name === singleCategoryIdentifier || cat.id === singleCategoryIdentifier);
      if (foundCat) {
        targetCategories = [foundCat];
        setResolvedSessionTitle(foundCat.name); // Update title with actual category name
      } else {
        notFoundIdentifiers.push(singleCategoryIdentifier);
        toast.error("Kategorie nicht gefunden:", { description: singleCategoryIdentifier });
        setAccessStatus("not_found");
        return;
      }
    }

    if (targetCategories.length === 0 && (singleCategoryIdentifier || multipleCategoryIdentifiers)) {
      // This case should ideally be caught above, but as a safeguard
      if (!toast.isActive("cat_not_found")) { // Prevent duplicate toasts
        toast.error("Die angeforderten Lernkategorien wurden nicht gefunden.", { id: "cat_not_found" });
      }
      setAccessStatus("not_found");
      return;
    }

    let requiresAuthNeeded = false;
    let proRequired = false;

    for (const cat of targetCategories) {
      if (cat.requiresAuth) {
        requiresAuthNeeded = true;
      }
      if (cat.isPro) {
        proRequired = true;
      }
    }

    const isUserPro = !!user?.user_metadata?.is_pro_member; // Adjust to your actual pro member check

    if (requiresAuthNeeded && !user) {
      toast.info("Für diese Auswahl ist eine Anmeldung erforderlich.", {
        description: "Bitte melde dich an, um auf diese Lernkarten zuzugreifen.",
      });
      // Save current path to redirect back after login
      const returnTo = location.pathname + location.search;
      navigate("/login", { replace: true, state: { from: returnTo } });
      setAccessStatus("denied_auth");
      return;
    }

    if (proRequired && !isUserPro) {
      toast.error("Premium-Funktion erforderlich.", {
        description: "Einige der ausgewählten Kategorien sind nur für Premium-Mitglieder verfügbar.",
      });
      // Navigate to dashboard or a premium upsell page
      navigate("/dashboard", { replace: true, state: { showProUpsell: true } });
      setAccessStatus("denied_pro");
      return;
    }

    setAccessStatus("allowed");

  }, [categories, categoriesLoading, categoriesDbError, singleCategoryIdentifier, multipleCategoryIdentifiers, user, navigate, location, initialSessionTitle]);

  const {
    loading: questionsLoading, // Renamed from 'loading'
    dueQuestions,
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount
  } = useSpacedRepetition(
    categoryIdentifiersForHook, // Use memoized identifiers
    spacedRepetitionOptions    // Use memoized options
  );

  console.log("LearningSessionPage: Loaded questions count:", dueQuestions?.length || 0, "for categories:", categoryIdentifiersForHook.join(', '));

  useEffect(() => {
    if (accessStatus !== "allowed" && accessStatus !== "no_selection") { // no_selection means global review, proceed to load cards
      setSessionCards([]);
      return;
    }
    if (!questionsLoading && dueQuestions.length > 0) {
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
      console.log("Session cards set:", shuffled.length);
    } else if (!questionsLoading && dueQuestions.length === 0) {
      setSessionCards([]);
      console.log("No due questions, session cards set to empty.");
    }
  }, [questionsLoading, dueQuestions, accessStatus]);

  useEffect(() => {
    if (
      (accessStatus === "allowed" || accessStatus === "no_selection") &&
      !questionsLoading &&
      sessionCards.length === 0 &&
      !toasts.some(t => t.id === NO_CARDS_FOUND_TOAST_ID && t.open)
    ) {
      toast({
        id: NO_CARDS_FOUND_TOAST_ID,
        title: "Keine Karten gefunden",
        description: "Für deine Auswahl gibt es aktuell keine Lernkarten.",
        variant: "destructive",
      });
    }
  }, [questionsLoading, sessionCards, accessStatus, toast, toasts]); // Added sessionCards and accessStatus to dependencies

  const handleAnswer = async (questionId: string, score: number) => {
    // Consider scores >= 4 as correct
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }

    // Submit answer for spaced repetition without reloading all cards
    if (user) {
      await submitAnswer(questionId, score);
    }
  };

  const handleComplete = () => {
    setSessionFinished(true);

    // Apply all pending updates when session is complete
    applyPendingUpdates().then(() => {
      toast.success("Lernsession abgeschlossen! Gut gemacht!");
    });
  };

  const handleRestart = async () => {
    // Apply any pending updates before restarting
    await applyPendingUpdates();

    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);

    // Reset will shuffle cards again
    if (dueQuestions.length > 0) {
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5);
      setSessionCards(shuffled);
    }
  };

  // Render loading states based on accessStatus
  if (accessStatus === "pending" || (categoriesLoading && (singleCategoryIdentifier || multipleCategoryIdentifiers))) {
    return <FlashcardLoadingState />;
  }

  if (accessStatus === "not_found") {
    return (
      <SessionContainer isMobile={isMobile}>
        <EmptySessionState message={`Die angeforderte Kategorie oder Kategorien wurden nicht gefunden.`} />
      </SessionContainer>
    );
  }

  if (accessStatus === "denied_auth" || accessStatus === "denied_pro") {
    // This state is brief due to navigation, but a loading indicator is good.
    return <FlashcardLoadingState />;
  }
  
  // Render loading state for questions if access is allowed or no specific selection
  if (questionsLoading && (accessStatus === "allowed" || accessStatus === "no_selection")) {
    return <FlashcardLoadingState />;
  }

  // Render empty state when no cards are available (and access is allowed or no selection)
  if ((accessStatus === "allowed" || accessStatus === "no_selection") && !sessionCards.length && !questionsLoading) {
    return (
      <SessionContainer isMobile={isMobile}>
        <EmptySessionState categoryName={resolvedSessionTitle || "Auswahl"} />
      </SessionContainer>
    );
  }
  
  // Render finished session state
  if (sessionFinished) {
    return (
      <SessionContainer isMobile={isMobile}>
        <SessionCompleteState
          correctCount={correctCount}
          totalCards={sessionCards.length}
          onRestart={handleRestart}
          pendingUpdates={pendingUpdatesCount > 0}
        />
      </SessionContainer>
    );
  }

  // Render main learning session UI with our new card stack
  // This part should only render if a category is resolved (or no categoryParam) and cards are ready
  if ((accessStatus === "allowed" || accessStatus === "no_selection") && sessionCards.length > 0) {
    return (
      <SessionContainer isMobile={isMobile} fullHeight={isMobile}>
        <main className={`flex-1 ${isMobile ? 'px-0 pt-2 pb-16 overflow-hidden flex flex-col' : 'container px-4 py-8'}`}>
          <SessionHeader
            sessionTitle={resolvedSessionTitle} // Use resolved title
            categoryParam={categoryIdentifiersForHook} // Pass the identifier used for fetching
            isMobile={isMobile}
          />
          <CardStackSession
            sessionCards={sessionCards}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            onAnswer={handleAnswer}
            onComplete={handleComplete}
            isMobile={isMobile}
          />
        </main>
      </SessionContainer>
    );
  }
  
  // Fallback if none of the above conditions met (e.g., still resolving or unexpected state)
  // Fallback if none of the above conditions met (e.g., still resolving or unexpected state)
  // or if accessStatus is an error type not yet resulting in navigation
  if (!questionsLoading && (accessStatus === "allowed" || accessStatus === "no_selection") && sessionCards.length === 0) {
    // This case should be covered by the EmptySessionState above, but as a safety net
     return (
      <SessionContainer isMobile={isMobile}>
        <EmptySessionState categoryName={resolvedSessionTitle || "Auswahl"} />
      </SessionContainer>
    );
  }

  // Default fallback loading state if no other condition is met
  // (e.g. if accessStatus is an error state but navigation hasn't happened yet)
  console.log("Fallback loading state rendered, accessStatus:", accessStatus);
  return <FlashcardLoadingState message="Sitzung wird vorbereitet..." />;
}
