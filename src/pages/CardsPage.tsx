
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, Clock, Filter, FilterX, Signal, Square } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/common/CategoryCard";
import { signalSubCategories } from "@/api/questions";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import LearningBoxesOverview from "@/components/flashcards/LearningBoxesOverview";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";

export default function CardsPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [regulationFilter, setRegulationFilter] = useState<"all" | "DS 301" | "DV 301">("all");
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
        const category = curr.category;
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
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Karteikarten</h1>
              <p className="text-gray-500 max-w-2xl">
                Lerne mit unseren Karteikarten und nutze das Spaced Repetition System für nachhaltigen Lernerfolg.
                {!user && " Melde dich an, um deinen Lernfortschritt zu speichern."}
              </p>
            </div>
            
            {user && selectedCategories.length > 0 && (
              <div className="flex flex-col gap-2 items-end">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-loklernen-ultramarine text-white">
                    {selectedCategories.length} Kategorien ausgewählt
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedCategories([])}
                  >
                    <FilterX className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
                  onClick={handleStartLearningSelected}
                >
                  Ausgewählte Kategorien lernen
                </Button>
              </div>
            )}
          </div>
          
          {/* Learning Boxes Overview */}
          <LearningBoxesOverview />

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <h2 className="text-xl font-semibold">Kartendecks</h2>
              
              {user && (
                <div className="flex gap-2 items-center">
                  <RegulationFilterToggle
                    value={regulationFilter}
                    onChange={setRegulationFilter}
                    title=""
                    showInfoTooltip={false}
                    variant="outline"
                    size="sm"
                    showAllOption
                    className="w-auto"
                  />
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Wähle die Kategorien aus, die du lernen möchtest. Du kannst mehrere Kategorien gleichzeitig auswählen.
            </p>
          </div>

          <Tabs 
            defaultValue="signale" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "signale" | "betriebsdienst")}
            className="mb-8"
          >
            <TabsList className="w-full max-w-md mb-6">
              <TabsTrigger value="signale" className="flex-1">
                <Signal className="h-4 w-4 mr-2" />
                Signale
              </TabsTrigger>
              <TabsTrigger value="betriebsdienst" className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Betriebsdienst
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signale">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {signalSubCategories.map((subcategory) => {
                  const stats = progressStats?.[subcategory];
                  const cardCounts = categoryCardCounts?.[subcategory];
                  
                  // Calculate progress percentage
                  const progress = stats ? Math.round((stats.correct / Math.max(1, stats.total)) * 100) : 0;
                  
                  // Calculate card stats
                  const totalCards = cardCounts?.total || 0;
                  const dueCards = stats?.due || 0;
                  const masteredCards = stats?.mastered || 0;
                  
                  // Filter by regulation if needed
                  let shouldDisplay = true;
                  if (regulationFilter !== "all" && cardCounts) {
                    const hasCardsForRegulation = cardCounts.byRegulation[regulationFilter] > 0 || 
                                                cardCounts.byRegulation["Beide"] > 0;
                    shouldDisplay = hasCardsForRegulation;
                  }
                  
                  if (!shouldDisplay) return null;
                  
                  return (
                    <CategoryCard
                      key={subcategory}
                      title={subcategory}
                      description={stats 
                        ? `${Math.round(progress)}% gelernt`
                        : "Lerne die wichtigsten Signale dieser Kategorie"}
                      progress={progress}
                      link={`/karteikarten/signale/${encodeURIComponent(subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
                      isSelected={selectedCategories.includes(subcategory)}
                      onSelect={() => handleSelectCategory(subcategory)}
                      selectable={!!user}
                      stats={{
                        totalCards,
                        dueCards,
                        masteredCards
                      }}
                    />
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="betriebsdienst">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <CategoryCard
                  title="Grundlagen Bahnbetrieb"
                  description="Einstieg in den Bahnbetrieb"
                  progress={0}
                  link="/karteikarten/betriebsdienst/grundlagen"
                  isLocked={!user}
                  isSelected={selectedCategories.includes("Grundlagen Bahnbetrieb")}
                  onSelect={() => handleSelectCategory("Grundlagen Bahnbetrieb")}
                  selectable={!!user}
                  stats={{
                    totalCards: 25,
                    dueCards: user ? 0 : undefined,
                    masteredCards: user ? 0 : undefined
                  }}
                />
                <CategoryCard
                  title="UVV & Arbeitsschutz"
                  description="Sicherheit am Arbeitsplatz"
                  progress={0}
                  link="/karteikarten/betriebsdienst/uvv"
                  isLocked={!user}
                  isSelected={selectedCategories.includes("UVV & Arbeitsschutz")}
                  onSelect={() => handleSelectCategory("UVV & Arbeitsschutz")}
                  selectable={!!user}
                  stats={{
                    totalCards: 18,
                    dueCards: user ? 0 : undefined,
                    masteredCards: user ? 0 : undefined
                  }}
                />
                <CategoryCard
                  title="Rangieren"
                  description="Alles zum Thema Rangieren"
                  progress={0}
                  link="/karteikarten/betriebsdienst/rangieren"
                  isPro
                  isLocked
                  stats={{
                    totalCards: 42
                  }}
                />
                <CategoryCard
                  title="Züge fahren"
                  description="Von der Abfahrt bis zur Ankunft"
                  progress={0}
                  link="/karteikarten/betriebsdienst/zuege-fahren"
                  isPro
                  isLocked
                  stats={{
                    totalCards: 35
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {user && selectedCategories.length > 0 && (
            <div className="mb-8 p-4 border border-gray-800 rounded-lg bg-gray-900">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">Dein Lernplan</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCategories.map(cat => (
                      <Badge key={cat} variant="secondary" className="bg-gray-700 text-white">
                        {cat}
                        <button 
                          onClick={() => handleSelectCategory(cat)}
                          className="ml-1 text-gray-400 hover:text-white"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    {regulationFilter !== "all" ? 
                      `Regelwerk: ${regulationFilter}` : 
                      "Alle Regelwerke"}
                  </p>
                </div>
                <Button
                  className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
                  onClick={handleStartLearningSelected}
                >
                  Mit diesem Plan lernen
                </Button>
              </div>
            </div>
          )}
          
          {user && selectedCategories.length === 0 && (
            <div className="mt-8 text-center">
              <p className="mb-2 text-muted-foreground">
                Direkt mit dem Lernen anfangen? Wir empfehlen dir die fälligen Karten.
              </p>
              <Link to="/karteikarten/lernen">
                <Button className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
                  Empfohlene Karten lernen
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
