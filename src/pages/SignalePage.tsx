
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/common/CategoryCard";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";
import { signalSubCategories } from "@/api/questions";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionFilters } from "@/hooks/useQuestionFilters";
import { RegulationCategory, RegulationFilterType, Question } from "@/types/questions";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { transformAnswers } from "@/api/questions";

// Helper function to transform database questions to application questions
function transformQuestion(dbQuestion: any): Question {
  return {
    ...dbQuestion,
    answers: transformAnswers(dbQuestion.answers)
  };
}

export default function SignalePage() {
  const { user } = useAuth();
  const { regulationPreference } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get regulation filter from URL or default to user preference
  const initialRegulationFilter = (searchParams.get("regelwerk") as RegulationFilterType) || regulationPreference;
  
  // Fetch all signal questions
  const { data: allSignalQuestions } = useQuery({
    queryKey: ['allSignalQuestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', 'Signale');
        
      if (error) throw error;
      // Transform the data to match our application types
      return (data || []).map(transformQuestion);
    }
  });
  
  // Apply filters to the questions
  const { 
    filteredQuestions, 
    regulationFilter, 
    setRegulationFilter 
  } = useQuestionFilters({ 
    questions: allSignalQuestions,
    initialRegulationFilter,
  });
  
  // Update filter when URL param changes
  useEffect(() => {
    setRegulationFilter(initialRegulationFilter);
  }, [initialRegulationFilter, setRegulationFilter]);
  
  // Update URL when regulation filter changes
  const handleRegulationChange = (value: RegulationFilterType) => {
    setRegulationFilter(value);
    // Update URL
    setSearchParams(params => {
      params.set("regelwerk", value);
      return params;
    });
  };
  
  // Get progress stats for each subcategory
  const { data: progressStats } = useQuery({
    queryKey: ['signalProgress', user?.id, regulationFilter],
    queryFn: async () => {
      if (!user) return {};
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('questions(sub_category, regulation_category), correct_count, incorrect_count')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Aggregate stats by subcategory
      return (data || []).reduce((acc: Record<string, { correct: number, total: number }>, curr) => {
        const subCategory = curr.questions?.sub_category;
        const regulationCategory = curr.questions?.regulation_category;
        
        if (!subCategory) return acc;
        
        // Skip if doesn't match current regulation filter
        if (regulationFilter !== "all" && 
            regulationCategory !== regulationFilter && 
            regulationCategory !== "both" && 
            regulationCategory !== undefined) {
          return acc;
        }
        
        if (!acc[subCategory]) {
          acc[subCategory] = { correct: 0, total: 0 };
        }
        
        acc[subCategory].correct += curr.correct_count || 0;
        acc[subCategory].total += (curr.correct_count || 0) + (curr.incorrect_count || 0);
        
        return acc;
      }, {});
    },
    enabled: !!user
  });

  // Group questions by subcategory for counting
  const subcategoryCounts = signalSubCategories.reduce((acc, subCategory) => {
    // Count questions that match the current regulation filter
    const count = filteredQuestions.filter(q => q.sub_category === subCategory).length;
    acc[subCategory] = count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Signale</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Signale</h1>
            <p className="text-gray-500 max-w-2xl mb-6">
              Lerne die wichtigsten Signale der Eisenbahn kennen. Diese Kategorie ist kostenlos und ohne Anmeldung zugänglich. 
              {!user && " Melde dich an, um deinen Lernfortschritt zu speichern."}
            </p>
            
            <Card className="p-4 mb-6">
              <RegulationFilterToggle 
                value={regulationFilter}
                onChange={handleRegulationChange}
                showInfoTooltip={true}
                showAllOption={true}
              />
            </Card>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signalSubCategories.map((subcategory) => {
              const stats = progressStats?.[subcategory];
              const progress = stats ? Math.round((stats.correct / Math.max(1, stats.total)) * 100) : 0;
              const questionCount = subcategoryCounts[subcategory] || 0;
              
              // Hide subcategories with no questions matching the current filter
              if (questionCount === 0) return null;
              
              return (
                <CategoryCard
                  key={subcategory}
                  title={subcategory}
                  description={stats 
                    ? `${stats.correct} von ${stats.total} Karten richtig beantwortet`
                    : `${questionCount} Signale in dieser Kategorie`}
                  progress={progress}
                  link={`/signale/${encodeURIComponent(subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}${
                    regulationFilter !== "all" ? `?regelwerk=${regulationFilter}` : ''
                  }`}
                  badge={regulationFilter !== "all" ? regulationFilter : undefined}
                />
              );
            })}
          </div>
          
          {filteredQuestions.length === 0 && (
            <div className="text-center mt-8 p-8 border border-dashed rounded-lg">
              <p className="text-gray-500">Keine Signale für dieses Regelwerk gefunden.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
