
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LearningBoxesOverview from "@/components/flashcards/LearningBoxesOverview";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RegulationFilterType } from "@/types/regulation";
import CardsPageHeader from "@/components/flashcards/CardsPageHeader";
import CardDecksSection from "@/components/flashcards/CardDecksSection";
import LearningPlanSection from "@/components/flashcards/LearningPlanSection";
import RecommendedCardsSection from "@/components/flashcards/RecommendedCardsSection";

export default function CardsPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [regulationFilter, setRegulationFilter] = useState<RegulationFilterType>("all");
  const [activeTab, setActiveTab] = useState<"signale" | "betriebsdienst">("signale");
  
  // Reset selections when changing tabs
  useEffect(() => {
    setSelectedCategories([]);
  }, [activeTab]);

  // Fetch progress stats for each subcategory
  const { data: progressStats } = useQuery({
    queryKey: ['signalProgress', user?.id],
    queryFn: async () => {
      if (!user) return {};
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('questions(sub_category, regulation_category), correct_count, incorrect_count, next_review_at')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Aggregate stats by subcategory
      return (data || []).reduce((acc: Record<string, { 
        correct: number, 
        total: number, 
        due: number,
        mastered: number,
        regulationStats: Record<string, number>  
      }>, curr) => {
        const subCategory = curr.questions?.sub_category;
        const regulationCategory = curr.questions?.regulation_category || "Allgemein";
        
        if (!subCategory) return acc;
        
        if (!acc[subCategory]) {
          acc[subCategory] = { 
            correct: 0, 
            total: 0, 
            due: 0, 
            mastered: 0,
            regulationStats: {}
          };
        }
        
        // Track correct answers and total attempts
        acc[subCategory].correct += curr.correct_count || 0;
        acc[subCategory].total += (curr.correct_count || 0) + (curr.incorrect_count || 0);
        
        // Count due cards (where next_review_at is in the past)
        const now = new Date().toISOString();
        if (curr.next_review_at && curr.next_review_at <= now) {
          acc[subCategory].due += 1;
        }

        // Count mastered cards (cards that have been reviewed at least 5 times with correct answers)
        if (curr.correct_count >= 5) {
          acc[subCategory].mastered += 1;
        }

        // Count by regulation category
        if (!acc[subCategory].regulationStats[regulationCategory]) {
          acc[subCategory].regulationStats[regulationCategory] = 0;
        }
        acc[subCategory].regulationStats[regulationCategory] += 1;
        
        return acc;
      }, {});
    },
    enabled: !!user
  });

  // Query to get total cards per category
  const { data: categoryCardCounts } = useQuery({
    queryKey: ['categoryCardCounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('sub_category, regulation_category, category')
        .order('sub_category', { ascending: true });
        
      if (error) throw error;
      
      // Group by subcategory
      return (data || []).reduce((acc: Record<string, { 
        total: number,
        byRegulation: Record<string, number>
      }>, curr) => {
        const subCategory = curr.sub_category;
        const regulationCategory = curr.regulation_category || "Allgemein";
        
        if (!acc[subCategory]) {
          acc[subCategory] = { 
            total: 0,
            byRegulation: {}
          };
        }
        
        acc[subCategory].total += 1;
        
        if (!acc[subCategory].byRegulation[regulationCategory]) {
          acc[subCategory].byRegulation[regulationCategory] = 0;
        }
        acc[subCategory].byRegulation[regulationCategory] += 1;
        
        return acc;
      }, {});
    }
  });

  const handleSelectCategory = (subcategory: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(subcategory)) {
        return prev.filter(cat => cat !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
  };

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
    
    if (regulationFilter !== "all") {
      queryParams.append('regulation', regulationFilter);
    }
    
    window.location.href = `/karteikarten/lernen?${queryParams.toString()}`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className={`${isMobile ? 'px-3 py-4 pb-20' : 'container px-4 py-8 md:px-6 md:py-12'}`}>
          {!isMobile && (
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
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
            onClearSelection={() => setSelectedCategories([])}
            onStartLearningSelected={handleStartLearningSelected}
            regulationFilter={regulationFilter}
            onRegulationFilterChange={setRegulationFilter}
          />
          
          {/* Learning Boxes Overview */}
          <LearningBoxesOverview />

          <CardDecksSection 
            user={user}
            activeTab={activeTab}
            onTabChange={(value) => setActiveTab(value as "signale" | "betriebsdienst")}
            selectedCategories={selectedCategories}
            onSelectCategory={handleSelectCategory}
            regulationFilter={regulationFilter}
            onRegulationFilterChange={setRegulationFilter}
            progressStats={progressStats}
            categoryCardCounts={categoryCardCounts}
          />
          
          <LearningPlanSection 
            selectedCategories={selectedCategories}
            regulationFilter={regulationFilter}
            onStartLearning={handleStartLearningSelected}
            onRemoveCategory={handleSelectCategory}
          />
          
          {user && selectedCategories.length === 0 && (
            <RecommendedCardsSection user={user} />
          )}
        </div>
      </main>
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
