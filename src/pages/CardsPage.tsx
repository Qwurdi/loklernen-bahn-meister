
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { toast } from "sonner";
import CardsPageHeader from "@/components/flashcards/CardsPageHeader";
import CardDecksSection from "@/components/flashcards/CardDecksSection";
import LearningPlanSection from "@/components/flashcards/LearningPlanSection";
import { useCardsPageData } from "@/hooks/useCardsPageData";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Settings } from "lucide-react";
import BoxSystemOverview from "@/components/flashcards/boxes/BoxSystemOverview";
import FloatingLearnButton from "@/components/flashcards/FloatingLearnButton";

export default function CardsPage() {
  const { user } = useAuth();
  const { regulationPreference } = useUserPreferences();
  const isMobile = useIsMobile();
  
  const {
    selectedCategories,
    activeTab,
    progressStats,
    categoryCardCounts,
    setActiveTab,
    handleSelectCategory,
    clearSelection
  } = useCardsPageData(user);

  const handleStartLearningSelected = () => {
    if (selectedCategories.length === 0) {
      toast.warning("Bitte wähle mindestens eine Kategorie aus");
      return;
    }
    
    // Construct the URL with query parameters for selected categories
    const queryParams = new URLSearchParams();
    selectedCategories.forEach(cat => {
      queryParams.append('categories', cat);
    });
    
    // Always include the global regulation preference
    queryParams.append('regelwerk', regulationPreference);
    
    window.location.href = `/karteikarten/lernen?${queryParams.toString()}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black -z-10"></div>
      <Navbar />
      
      <main className="flex-1">
        <div className={`${isMobile ? 'px-3 py-4 pb-20' : 'container px-4 py-8 md:px-6 md:py-12'}`}>
          {!isMobile && (
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="text-loklernen-ultramarine hover:text-loklernen-ultramarine/80 transition-colors">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Karteikarten</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
          
          <CardsPageHeader 
            user={user}
            selectedCategories={selectedCategories}
            onClearSelection={clearSelection}
            onStartLearningSelected={handleStartLearningSelected}
          />
          
          {/* Box System Overview - Light Design */}
          <BoxSystemOverview />

          <CardDecksSection 
            user={user}
            activeTab={activeTab}
            onTabChange={(value) => setActiveTab(value as "signale" | "betriebsdienst")}
            selectedCategories={selectedCategories}
            onSelectCategory={handleSelectCategory}
            progressStats={progressStats}
            categoryCardCounts={categoryCardCounts}
          />
          
          <LearningPlanSection 
            selectedCategories={selectedCategories}
            onStartLearning={handleStartLearningSelected}
            onRemoveCategory={handleSelectCategory}
          />
          
          {/* Settings Hint with Light Design */}
          <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-200 pt-4">
            <p className="flex items-center justify-center gap-2">
              <Settings className="h-4 w-4 text-loklernen-ultramarine" />
              Aktives Regelwerk: <span className="font-semibold text-loklernen-ultramarine">{regulationPreference}</span>
              <Link to="/einstellungen" className="text-loklernen-ultramarine hover:text-loklernen-ultramarine/80 hover:underline ml-2 transition-colors">
                Regelwerk in Einstellungen ändern
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      {/* Floating "Learn Now" button */}
      <FloatingLearnButton 
        visible={selectedCategories.length > 0}
        onLearnStart={handleStartLearningSelected}
        count={selectedCategories.length}
      />
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
