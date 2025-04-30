import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserStats from "@/components/common/UserStats";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CalendarCheck, BookOpen, Signal, TrafficCone } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { regulationPreference, setRegulationPreference } = useUserPreferences();
  const [dueCards, setDueCards] = useState({ 
    total: 0,
    signale: 0,
    betriebsdienst: 0
  });
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    totalCorrect: 0,
    totalIncorrect: 0
  });
  const [categoryProgress, setCategoryProgress] = useState<Record<string, { correct: number, total: number }>>({});
  const [loading, setLoading] = useState(true);

  // Fetch user stats and due cards - optimized with useCallback to prevent unnecessary re-fetches
  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', statsError);
      }
      
      if (statsData) {
        const level = Math.floor(Math.sqrt(statsData.xp / 100)) + 1;
        setUserStats({
          xp: statsData.xp || 0,
          level,
          streak: statsData.streak_days || 0,
          totalCorrect: statsData.total_correct || 0,
          totalIncorrect: statsData.total_incorrect || 0
        });
      }
      
      // Fetch due cards count with category breakdowns - using limit to prevent large queries
      const now = new Date().toISOString();
      
      // Due cards for Signale category - limited to prevent large IN lists
      const { count: signaleCount, error: signaleDueError } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lte('next_review_at', now)
        .filter('questions.category', 'eq', 'Signale')
        .limit(1000);
      
      // Due cards for Betriebsdienst category
      const { count: betriebsdienstCount, error: betriebsdienstDueError } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lte('next_review_at', now)
        .filter('questions.category', 'eq', 'Betriebsdienst')
        .limit(1000);
      
      // Total due cards (sum of both categories)
      const totalCount = (signaleCount || 0) + (betriebsdienstCount || 0);
      
      if (signaleDueError) {
        console.error('Error fetching Signale due cards:', signaleDueError);
      }
      
      if (betriebsdienstDueError) {
        console.error('Error fetching Betriebsdienst due cards:', betriebsdienstDueError);
      }
      
      setDueCards({
        total: totalCount,
        signale: signaleCount || 0,
        betriebsdienst: betriebsdienstCount || 0
      });
      
      // Fetch category progress - optimized to handle large datasets
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('questions(category,sub_category), correct_count, incorrect_count')
        .eq('user_id', user.id)
        .limit(1000);
        
      if (progressError) {
        console.error('Error fetching progress:', progressError);
      } else {
        const progress = (progressData || []).reduce((acc: Record<string, { correct: number, total: number }>, curr) => {
          const category = curr.questions?.category;
          const subCategory = curr.questions?.sub_category;
          
          if (!category || !subCategory) return acc;
          
          // Track by subcategory
          if (!acc[subCategory]) {
            acc[subCategory] = { correct: 0, total: 0 };
          }
          
          acc[subCategory].correct += curr.correct_count || 0;
          acc[subCategory].total += (curr.correct_count || 0) + (curr.incorrect_count || 0);
          
          return acc;
        }, {});
        
        setCategoryProgress(progress);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    fetchUserData();
    
    // Set up a refresh interval, but with a reasonable time
    // This avoids the page reloading too frequently
    const intervalId = setInterval(() => {
      fetchUserData();
    }, 5 * 60 * 1000); // Refresh every 5 minutes instead of seconds
    
    return () => {
      clearInterval(intervalId); // Clean up on unmount
    };
  }, [user, fetchUserData]);

  if (!user) {
    return null; // Will be handled by the route guard
  }

  // Calculate totals for each main category
  const calculateCategoryTotals = (category: 'Signale' | 'Betriebsdienst') => {
    const subCategories = {
      'Signale': ['Haupt- und Vorsignale', 'Zusatz- & Kennzeichen', 'Rangiersignale', 'Sonstige Signale'],
      'Betriebsdienst': ['Grundlagen Bahnbetrieb', 'UVV & Arbeitsschutz', 'Rangieren', 'Züge fahren', 'PZB & Sicherungsanlagen']
    };
    
    const subcatsForCategory = subCategories[category];
    let totalCorrect = 0;
    let totalCards = 0;
    
    subcatsForCategory.forEach(subcat => {
      if (categoryProgress[subcat]) {
        totalCorrect += categoryProgress[subcat].correct;
        totalCards += categoryProgress[subcat].total;
      }
    });
    
    return { correct: totalCorrect, total: totalCards };
  };

  const signaleTotals = calculateCategoryTotals('Signale');
  const betriebsdienstTotals = calculateCategoryTotals('Betriebsdienst');
  
  const successRate = userStats.totalCorrect + userStats.totalIncorrect > 0 
    ? Math.round((userStats.totalCorrect / (userStats.totalCorrect + userStats.totalIncorrect)) * 100) 
    : 0;

  const handleRegulationChange = async (value: string) => {
    await setRegulationPreference(value as any);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {user ? `Hallo ${user.email?.split('@')[0] || 'Lokführer'}!` : 'Dein Lernbereich'}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        {/* Redesigned Learning Section - with consistent colors */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-loklernen-ultramarine" />
              Heute lernen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Signale Learning Card */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-loklernen-ultramarine/10 rounded-full">
                    <Signal className="h-5 w-5 text-loklernen-ultramarine" />
                  </div>
                  <div>
                    <p className="font-medium">Signale</p>
                    <p className="text-sm text-muted-foreground">
                      {dueCards.signale} fällige Karten
                    </p>
                  </div>
                </div>
                <Link to={`/karteikarten/lernen?regelwerk=${regulationPreference}&category=Signale`}>
                  <Button className="w-full bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
                    <BookOpen className="mr-2 h-4 w-4" /> Signale lernen
                  </Button>
                </Link>
              </div>
              
              {/* Betriebsdienst Learning Card - updated colors to match brand */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-loklernen-sapphire/10 rounded-full">
                    <TrafficCone className="h-5 w-5 text-loklernen-sapphire" />
                  </div>
                  <div>
                    <p className="font-medium">Betriebsdienst</p>
                    <p className="text-sm text-muted-foreground">
                      {dueCards.betriebsdienst} fällige Karten
                    </p>
                  </div>
                </div>
                <Link to={`/karteikarten/lernen?regelwerk=${regulationPreference}&category=Betriebsdienst`}>
                  <Button className="w-full bg-loklernen-sapphire hover:bg-loklernen-sapphire/90">
                    <BookOpen className="mr-2 h-4 w-4" /> Betriebsdienst lernen
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats and Categories */}
        <div className="grid gap-6 md:grid-cols-12">
          {/* User Stats */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Deine Statistiken</CardTitle>
            </CardHeader>
            <CardContent>
              <UserStats 
                xp={userStats.xp} 
                level={userStats.level} 
                streak={userStats.streak} 
              />
              
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Erfolgsrate</span>
                    <span>{successRate}%</span>
                  </div>
                  <Progress value={successRate} className="h-2" 
                    indicatorClassName={successRate > 70 ? "bg-green-500" : successRate > 40 ? "bg-yellow-500" : "bg-red-500"}
                  />
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Insgesamt: {userStats.totalCorrect} richtig, {userStats.totalIncorrect} falsch
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Categories Tabs with Accordions */}
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Kategorien</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signale">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="signale" className="flex-1">Signale</TabsTrigger>
                  <TabsTrigger value="betriebsdienst" className="flex-1">Betriebsdienst</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signale">
                  <div className="space-y-2">
                    {/* Main category progress */}
                    <div className="p-3 rounded-lg border mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Signale gesamt</span>
                        <span className="text-sm text-muted-foreground">
                          {signaleTotals.correct} / {signaleTotals.total}
                        </span>
                      </div>
                      <Progress 
                        value={signaleTotals.total > 0 
                          ? (signaleTotals.correct / signaleTotals.total) * 100 
                          : 0} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* Subcategories in accordion */}
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="haupt-vorsignale">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex-1 text-left">
                            <div className="flex justify-between items-center">
                              <span>Haupt- und Vorsignale</span>
                              <span className="text-sm text-muted-foreground mr-2">
                                {categoryProgress['Haupt- und Vorsignale']?.correct || 0} / {categoryProgress['Haupt- und Vorsignale']?.total || 0}
                              </span>
                            </div>
                            <Progress 
                              value={categoryProgress['Haupt- und Vorsignale']?.total > 0 
                                ? (categoryProgress['Haupt- und Vorsignale'].correct / categoryProgress['Haupt- und Vorsignale'].total) * 100 
                                : 0} 
                              className="h-1 mt-1"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-4 pr-2 py-2">
                            <Link 
                              to={`/karteikarten/signale/haupt-vorsignale?regelwerk=${regulationPreference}`}
                              className="flex justify-between items-center px-2 py-3 rounded-lg hover:bg-slate-50"
                            >
                              <span>Zu den Karteikarten</span>
                              <Button variant="outline" size="sm">Öffnen</Button>
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="zusatz-kennzeichen">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex-1 text-left">
                            <div className="flex justify-between items-center">
                              <span>Zusatz- & Kennzeichen</span>
                              <span className="text-sm text-muted-foreground mr-2">
                                {categoryProgress['Zusatz- & Kennzeichen']?.correct || 0} / {categoryProgress['Zusatz- & Kennzeichen']?.total || 0}
                              </span>
                            </div>
                            <Progress 
                              value={categoryProgress['Zusatz- & Kennzeichen']?.total > 0 
                                ? (categoryProgress['Zusatz- & Kennzeichen'].correct / categoryProgress['Zusatz- & Kennzeichen'].total) * 100 
                                : 0} 
                              className="h-1 mt-1"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-4 pr-2 py-2">
                            <Link 
                              to={`/karteikarten/signale/zusatz-kennzeichen?regelwerk=${regulationPreference}`}
                              className="flex justify-between items-center px-2 py-3 rounded-lg hover:bg-slate-50"
                            >
                              <span>Zu den Karteikarten</span>
                              <Button variant="outline" size="sm">Öffnen</Button>
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="rangiersignale">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex-1 text-left">
                            <div className="flex justify-between items-center">
                              <span>Rangiersignale</span>
                              <span className="text-sm text-muted-foreground mr-2">
                                {categoryProgress['Rangiersignale']?.correct || 0} / {categoryProgress['Rangiersignale']?.total || 0}
                              </span>
                            </div>
                            <Progress 
                              value={categoryProgress['Rangiersignale']?.total > 0 
                                ? (categoryProgress['Rangiersignale'].correct / categoryProgress['Rangiersignale'].total) * 100 
                                : 0} 
                              className="h-1 mt-1"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-4 pr-2 py-2">
                            <Link 
                              to={`/karteikarten/signale/rangiersignale?regelwerk=${regulationPreference}`}
                              className="flex justify-between items-center px-2 py-3 rounded-lg hover:bg-slate-50"
                            >
                              <span>Zu den Karteikarten</span>
                              <Button variant="outline" size="sm">Öffnen</Button>
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <div className="flex justify-center mt-4">
                      <Link to={`/karteikarten/signale?regelwerk=${regulationPreference}`}>
                        <Button variant="outline">Alle Signale anzeigen</Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="betriebsdienst">
                  <div className="space-y-2">
                    {/* Main category progress */}
                    <div className="p-3 rounded-lg border mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Betriebsdienst gesamt</span>
                        <span className="text-sm text-muted-foreground">
                          {betriebsdienstTotals.correct} / {betriebsdienstTotals.total}
                        </span>
                      </div>
                      <Progress 
                        value={betriebsdienstTotals.total > 0 
                          ? (betriebsdienstTotals.correct / betriebsdienstTotals.total) * 100 
                          : 0} 
                        className="h-2"
                      />
                    </div>
                    
                    {/* Subcategories in accordion */}
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="grundlagen">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex-1 text-left">
                            <div className="flex justify-between items-center">
                              <span>Grundlagen Bahnbetrieb</span>
                              <span className="text-sm text-muted-foreground mr-2">
                                {categoryProgress['Grundlagen Bahnbetrieb']?.correct || 0} / {categoryProgress['Grundlagen Bahnbetrieb']?.total || 0}
                              </span>
                            </div>
                            <Progress 
                              value={categoryProgress['Grundlagen Bahnbetrieb']?.total > 0 
                                ? (categoryProgress['Grundlagen Bahnbetrieb'].correct / categoryProgress['Grundlagen Bahnbetrieb'].total) * 100 
                                : 0} 
                              className="h-1 mt-1"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-4 pr-2 py-2">
                            <Link 
                              to={`/karteikarten/betriebsdienst/grundlagen?regelwerk=${regulationPreference}`}
                              className="flex justify-between items-center px-2 py-3 rounded-lg hover:bg-slate-50"
                            >
                              <span>Zu den Karteikarten</span>
                              <Button variant="outline" size="sm">Öffnen</Button>
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="uvv">
                        <AccordionTrigger className="py-3 hover:no-underline">
                          <div className="flex-1 text-left">
                            <div className="flex justify-between items-center">
                              <span>UVV & Arbeitsschutz</span>
                              <span className="text-sm text-muted-foreground mr-2">
                                {categoryProgress['UVV & Arbeitsschutz']?.correct || 0} / {categoryProgress['UVV & Arbeitsschutz']?.total || 0}
                              </span>
                            </div>
                            <Progress 
                              value={categoryProgress['UVV & Arbeitsschutz']?.total > 0 
                                ? (categoryProgress['UVV & Arbeitsschutz'].correct / categoryProgress['UVV & Arbeitsschutz'].total) * 100 
                                : 0} 
                              className="h-1 mt-1"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-4 pr-2 py-2">
                            <Link 
                              to={`/karteikarten/betriebsdienst/uvv?regelwerk=${regulationPreference}`}
                              className="flex justify-between items-center px-2 py-3 rounded-lg hover:bg-slate-50"
                            >
                              <span>Zu den Karteikarten</span>
                              <Button variant="outline" size="sm">Öffnen</Button>
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <div className="flex justify-center mt-4">
                      <Link to={`/karteikarten/betriebsdienst?regelwerk=${regulationPreference}`}>
                        <Button variant="outline">Alle Betriebsdienst-Themen anzeigen</Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Settings Section with Regulation Toggle */}
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Lerneinstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <RegulationFilterToggle 
                value={regulationPreference}
                onChange={handleRegulationChange}
                title="Regelwerk auswählen"
                showInfoTooltip={true}
                variant="default"
                showAllOption={false}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Diese Einstellung wird für alle Lernkarten verwendet.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
