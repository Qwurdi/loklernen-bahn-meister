
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/common/CategoryCard";
import { signalSubCategories } from "@/api/questions";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CardsPage() {
  const { user } = useAuth();
  
  const { data: progressStats } = useQuery({
    queryKey: ['signalProgress', user?.id],
    queryFn: async () => {
      if (!user) return {};
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('questions(sub_category), correct_count, incorrect_count')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Aggregate stats by subcategory
      return (data || []).reduce((acc: Record<string, { correct: number, total: number }>, curr) => {
        const subCategory = curr.questions?.sub_category;
        if (!subCategory) return acc;
        
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
                <BreadcrumbPage>Karteikarten</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Karteikarten</h1>
            <p className="text-gray-500 max-w-2xl">
              Lerne mit unseren Karteikarten und nutze das Spaced Repetition System für nachhaltigen Lernerfolg.
              {!user && " Melde dich an, um deinen Lernfortschritt zu speichern."}
            </p>
          </div>

          <Tabs defaultValue="signale" className="mb-8">
            <TabsList className="w-full max-w-md mb-6">
              <TabsTrigger value="signale" className="flex-1">Signale</TabsTrigger>
              <TabsTrigger value="betriebsdienst" className="flex-1">Betriebsdienst</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signale">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {signalSubCategories.map((subcategory) => {
                  const stats = progressStats?.[subcategory];
                  const progress = stats ? Math.round((stats.correct / Math.max(1, stats.total)) * 100) : 0;
                  
                  return (
                    <CategoryCard
                      key={subcategory}
                      title={subcategory}
                      description={stats 
                        ? `${stats.correct} von ${stats.total} Karten richtig beantwortet`
                        : "Lerne die wichtigsten Signale dieser Kategorie."}
                      progress={progress}
                      link={`/karteikarten/signale/${encodeURIComponent(subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
                    />
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="betriebsdienst">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <CategoryCard
                  title="Grundlagen Bahnbetrieb"
                  description="Einstieg in den Bahnbetrieb."
                  progress={0}
                  link="/karteikarten/betriebsdienst/grundlagen"
                  isLocked={!user}
                />
                <CategoryCard
                  title="UVV & Arbeitsschutz"
                  description="Sicherheit am Arbeitsplatz."
                  progress={0}
                  link="/karteikarten/betriebsdienst/uvv"
                  isLocked={!user}
                />
                <CategoryCard
                  title="Rangieren"
                  description="Alles zum Thema Rangieren."
                  progress={0}
                  link="/karteikarten/betriebsdienst/rangieren"
                  isPro
                  isLocked
                />
                <CategoryCard
                  title="Züge fahren"
                  description="Von der Abfahrt bis zur Ankunft."
                  progress={0}
                  link="/karteikarten/betriebsdienst/zuege-fahren"
                  isPro
                  isLocked
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {user && (
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
      
      <Footer />
    </div>
  );
}
