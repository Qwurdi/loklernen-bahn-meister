import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { useSpacedRepetition } from "@/hooks/spaced-repetition";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import FlashcardLoadingState from "@/components/flashcards/FlashcardLoadingState";
import { useSessionParams } from "@/hooks/learning-session/useSessionParams";
import SessionContainer from "@/components/learning-session/SessionContainer";
import SessionHeader from "@/components/learning-session/SessionHeader";
import EmptySessionState from "@/components/learning-session/EmptySessionState";
import SessionCompleteState from "@/components/learning-session/SessionCompleteState";
import CardStackSession from "@/components/learning-session/CardStackSession";
import { Flashcard, SessionType } from "@/hooks/spaced-repetition/types"; // Flashcard und SessionType importieren
import { useCategories } from "@/hooks/useCategories"; // Added useCategories
import { QuestionCategory } from "@/types/questions"; // Import QuestionCategory type
import { useToast } from "@/hooks/use-toast"; // Using useToast for toast management
import { useQuestions } from "@/hooks/useQuestions";
import { Category } from "@/api/categories/types"; // Import Category type for parent category handling

const NO_CARDS_FOUND_TOAST_TITLE = "Keine Karten gefunden";

// Define a new type for access status
type AccessStatus = "pending" | "allowed" | "denied_auth" | "denied_pro" | "not_found" | "no_selection";

// Define a constant for the toast ID
const NO_CARDS_FOUND_TOAST_ID = "no-cards-found-toast";

// Parent categories constants
const PARENT_CATEGORIES: QuestionCategory[] = ["Signale", "Betriebsdienst"];

export default function LearningSessionPage() {
  console.log("LearningSessionPage: Initializing component");

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Added
  const isMobile = useIsMobile();
  const { toast: manageCustomToast, toasts: customToastList } = useToast(); // Use toast functions

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]); // Geändert zu Flashcard[]
  const [sessionFinished, setSessionFinished] = useState(false);
  const [resolvedSessionTitle, setResolvedSessionTitle] = useState<string>(""); // For updating title with names

  const { categories, isLoading: categoriesLoading, error: categoriesDbError } = useCategories(); // Added
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("pending");
  const [isParentCategory, setIsParentCategory] = useState(false);
  const [resolvedCategoryIdentifiers, setResolvedCategoryIdentifiers] = useState<string[]>([]);

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
    // If we resolved subcategories for a parent category, use those
    if (isParentCategory && resolvedCategoryIdentifiers.length > 0) {
      return resolvedCategoryIdentifiers;
    }
    // Otherwise use the original logic
    if (multipleCategoryIdentifiers && multipleCategoryIdentifiers.length > 0) {
      return multipleCategoryIdentifiers;
    }
    if (singleCategoryIdentifier) {
      return [singleCategoryIdentifier];
    }
    return [];
  }, [multipleCategoryIdentifiers, singleCategoryIdentifier, isParentCategory, resolvedCategoryIdentifiers]);

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

  // New effect to check and handle parent categories
  useEffect(() => {
    if (categoriesLoading || !singleCategoryIdentifier) return;
    
    // Check if the singleCategoryIdentifier is a parent category
    if (PARENT_CATEGORIES.includes(singleCategoryIdentifier as QuestionCategory)) {
      console.log(`Detected parent category: ${singleCategoryIdentifier}`);
      setIsParentCategory(true);
      
      // Find all subcategories for this parent category
      const subcategories = categories
        .filter(cat => cat.parent_category === singleCategoryIdentifier)
        .map(cat => cat.name);
        
      if (subcategories.length > 0) {
        console.log(`Resolved ${subcategories.length} subcategories for ${singleCategoryIdentifier}`, subcategories);
        setResolvedCategoryIdentifiers(subcategories);
        setResolvedSessionTitle(`${singleCategoryIdentifier} (alle Kategorien)`);
      } else {
        console.log(`No subcategories found for parent category: ${singleCategoryIdentifier}`);
      }
    } else {
      setIsParentCategory(false);
    }
  }, [singleCategoryIdentifier, categories, categoriesLoading]);

  useEffect(() => {
    if (categoriesLoading) {
      setAccessStatus("pending");
      return;
    }
    if (categoriesDbError) {
      manageCustomToast({
        title: "Fehler beim Laden der Kategoriedaten.",
        description: categoriesDbError.message,
        variant: "destructive",
      });
      setAccessStatus("not_found"); // Or a new error state
      return;
    }

    // If no specific category is selected (e.g., for global due cards review)
    // Or if we're handling a parent category with resolved subcategories
    if ((!singleCategoryIdentifier && (!multipleCategoryIdentifiers || multipleCategoryIdentifiers.length === 0)) ||
        (isParentCategory && resolvedCategoryIdentifiers.length > 0)) {
      setAccessStatus("allowed"); // We've either resolved subcategories or don't need categories
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
        manageCustomToast({
          title: "Einige Kategorien wurden nicht gefunden:",
          description: notFoundIdentifiers.join(', '),
          variant: "destructive",
        });
        setAccessStatus("not_found");
        return;
      }
      // Update session title for multiple categories if needed (e.g. with count)
      setResolvedSessionTitle(`Auswahl (${targetCategories.length} Kategorien)`);

    } else if (singleCategoryIdentifier) {
      // If we already handled it as a parent category, skip this block
      if (isParentCategory) return;
      
      const foundCat = categories.find(cat => cat.name === singleCategoryIdentifier || cat.id === singleCategoryIdentifier);
      if (foundCat) {
        targetCategories = [foundCat];
        setResolvedSessionTitle(foundCat.name); // Update title with actual category name
      } else {
        notFoundIdentifiers.push(singleCategoryIdentifier);
        manageCustomToast({
          title: "Kategorie nicht gefunden:",
          description: singleCategoryIdentifier,
          variant: "destructive",
        });
        setAccessStatus("not_found");
        return;
      }
    }

    if (targetCategories.length === 0 && (singleCategoryIdentifier || multipleCategoryIdentifiers)) {
      // This case should ideally be caught above, but as a safeguard
      const existingToast = customToastList.some((toast) => toast.id === "cat_not_found" && toast.open);
      if (!existingToast) { 
        manageCustomToast({
          id: "cat_not_found", // ID für den Toast
          title: "Die angeforderten Lernkategorien wurden nicht gefunden.",
          variant: "destructive",
        });
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
      manageCustomToast({
        title: "Für diese Auswahl ist eine Anmeldung erforderlich.",
        description: "Bitte melde dich an, um auf diese Lernkarten zuzugreifen.",
        variant: "default", // Geändert von "info" zu "default"
      });
      // Save current path to redirect back after login
      const returnTo = location.pathname + location.search;
      navigate("/login", { replace: true, state: { from: returnTo } });
      setAccessStatus("denied_auth");
      return;
    }

    if (proRequired && !isUserPro) {
      manageCustomToast({
        title: "Premium-Funktion erforderlich.",
        description: "Einige der ausgewählten Kategorien sind nur für Premium-Mitglieder verfügbar.",
        variant: "destructive",
      });
      // Navigate to dashboard or a premium upsell page
      navigate("/dashboard", { replace: true, state: { showProUpsell: true } });
      setAccessStatus("denied_pro");
      return;
    }

    setAccessStatus("allowed");

  }, [categories, categoriesLoading, categoriesDbError, singleCategoryIdentifier, multipleCategoryIdentifiers, user, navigate, location, initialSessionTitle, manageCustomToast, customToastList, isParentCategory, resolvedCategoryIdentifiers]);

  const {
    loading: questionsLoading,
    dueQuestions, // Dies sind jetzt Flashcard[]
    submitAnswer,
    applyPendingUpdates,
    pendingUpdatesCount,
    startNewSession, 
    incorrectCardIdsInCurrentSession 
  } = useSpacedRepetition(
    user?.id, 
    spacedRepetitionOptions,
    // initialCardIdsToLoad wird dynamisch in startNewSession übergeben, nicht hier
  );

  console.log("LearningSessionPage: Loaded dueQuestions (Flashcards) count:", dueQuestions?.length || 0, "for categories:", categoryIdentifiersForHook.join(', '));

  useEffect(() => {
    const determineSessionTypeAndLoad = async () => {
      let sessionType: SessionType = 'due';
      let categoryNameToLoad: string | undefined = undefined;
      let cardIdsToLoad: number[] | undefined = undefined;

      // Logik zur Bestimmung des SessionTyps basierend auf URL-Parametern
      const params = new URLSearchParams(location.search);
      const specificCardIdsParam = params.get('card_ids');

      if (specificCardIdsParam) {
        sessionType = 'specific_ids';
        cardIdsToLoad = specificCardIdsParam.split(',').map(Number).filter(id => !isNaN(id));
      } else if (boxParam !== undefined) {
        sessionType = 'all'; // Der Hook filtert intern nach boxNumber via options
        // Hier könnte auch ein spezifischer 'box' Typ verwendet werden, wenn der Hook es unterstützt
      } else if (categoryIdentifiersForHook.length > 0) {
        // Use resolved category identifiers (parent category handling)
        sessionType = 'category';
        categoryNameToLoad = categoryIdentifiersForHook.join(',');
      } else if (practiceMode) {
        sessionType = 'guest';
        if (categoryIdentifiersForHook.length > 0) categoryNameToLoad = categoryIdentifiersForHook.join(',');
      }

      if (accessStatus === "allowed" || accessStatus === "no_selection" || (practiceMode && accessStatus !== "denied_auth")) {
        console.log(`LearningSessionPage: Initiating session with type: ${sessionType}, category: ${categoryNameToLoad}, regulation: ${regulationParam}, cardIds: ${cardIdsToLoad}`);
        await startNewSession(sessionType, categoryNameToLoad, regulationParam, cardIdsToLoad);
      }
    };

    // Nur ausführen, wenn sich die relevanten Parameter für die Sitzungsinitialisierung ändern
    // oder wenn der accessStatus es erlaubt.
    // Die Abhängigkeitsliste ist hier entscheidend, um unnötige Aufrufe zu vermeiden.
    if (user?.id || practiceMode) { // Stellt sicher, dass wir eine Benutzer-ID haben oder im Übungsmodus sind
        determineSessionTypeAndLoad();
    }
  }, [accessStatus, user?.id, practiceMode, categoryIdentifiersForHook, regulationParam, boxParam, location.search, startNewSession]); // Verwenden Sie categoryIdentifiersForHook statt der ursprünglichen Werte


  useEffect(() => {
    if (accessStatus !== "allowed" && accessStatus !== "no_selection") { 
      setSessionCards([]);
      return;
    }
    if (!questionsLoading && dueQuestions && dueQuestions.length > 0) {
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5); // dueQuestions sind Flashcard[]
      setSessionCards(shuffled);
      console.log("Session cards (Flashcards) set:", shuffled.length);
    } else if (!questionsLoading && (!dueQuestions || dueQuestions.length === 0)) {
      setSessionCards([]);
      console.log("No due questions (Flashcards), session cards set to empty.");
    }
  }, [questionsLoading, dueQuestions, accessStatus]);

  useEffect(() => {
    const isNoCardsToastActive = customToastList.some(
      (toast) => toast.title === NO_CARDS_FOUND_TOAST_TITLE && toast.open
    );
    if (
      (accessStatus === "allowed" || accessStatus === "no_selection") &&
      !questionsLoading &&
      sessionCards.length === 0 &&
      !isNoCardsToastActive
    ) {
      manageCustomToast({
        id: NO_CARDS_FOUND_TOAST_ID, // ID für den Toast
        title: NO_CARDS_FOUND_TOAST_TITLE,
        description: "Für deine Auswahl gibt es aktuell keine Lernkarten.",
        variant: "destructive", // Beibehalten als "destructive"
      });
    }
  }, [questionsLoading, sessionCards, accessStatus, manageCustomToast, customToastList]);

  const handleAnswer = async (questionIdAsString: string, score: number) => {
    const questionId = Number(questionIdAsString);
    if (isNaN(questionId)) {
        console.error("Invalid questionId passed to handleAnswer:", questionIdAsString);
        return;
    }
    if (score >= 4) {
      setCorrectCount(prev => prev + 1);
    }
    if (user) { 
      await submitAnswer(questionId, score); 
    }
  };

  const handleComplete = () => {
    setSessionFinished(true);
    applyPendingUpdates().then(() => {
      manageCustomToast({
        title: "Lernsession abgeschlossen! Gut gemacht!",
        variant: "default",
      });
    });
  };

  const handleRestart = async () => {
    await applyPendingUpdates();
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);
    
    let sessionType: SessionType = 'due'; 
    let categoryNameToLoad: string | undefined = undefined;

    // Logik zur Bestimmung des SessionTyps für den Neustart (ähnlich wie Initialisierung)
    if (boxParam !== undefined) {
        sessionType = 'all'; // Hook filtert intern
    } else if (categoryIdentifiersForHook.length > 0) {
      sessionType = 'category';
      categoryNameToLoad = categoryIdentifiersForHook.join(',');
    } else if (practiceMode) {
        sessionType = 'guest'; 
        if (categoryIdentifiersForHook.length > 0) categoryNameToLoad = categoryIdentifiersForHook.join(',');
    }

    await startNewSession(
      sessionType,
      categoryNameToLoad,
      regulationParam
      // Keine cardIdsToLoad, um die Standardlogik für eine neue Runde zu verwenden
    );
  };

  const handleRestartIncorrect = async () => {
    if (!incorrectCardIdsInCurrentSession || incorrectCardIdsInCurrentSession.length === 0) return;

    await applyPendingUpdates();
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionFinished(false);
    
    await startNewSession(
      'specific_ids', 
      undefined, 
      regulationParam, 
      incorrectCardIdsInCurrentSession
    );
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
          totalCards={sessionCards.length} // Bezieht sich auf die Karten der abgeschlossenen Runde
          onRestart={handleRestart}
          onRestartIncorrect={handleRestartIncorrect} // Neue Prop übergeben
          incorrectCardIds={incorrectCardIdsInCurrentSession} // Neue Prop übergeben
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
  if (!questionsLoading && (accessStatus === "allowed" || accessStatus === "no_selection") && sessionCards.length === 0) {
    // This case should be covered by the EmptySessionState above, but as a safety net
     return (
      <SessionContainer isMobile={isMobile}>
        <EmptySessionState categoryName={resolvedSessionTitle || "Auswahl"} />
      </SessionContainer>
    );
  }

  // Default fallback loading state if no other condition is met
  console.log("Fallback loading state rendered, accessStatus:", accessStatus);
  return <FlashcardLoadingState />;
}
