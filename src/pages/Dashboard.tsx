import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserStats from "@/components/common/UserStats";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";
import { CalendarCheck, Clock, BookOpen } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { regulationPreference, setRegulationPreference } = useUserPreferences();
  const [dueCards, setDueCards] = useState(0);
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    totalCorrect: 0,
    totalIncorrect: 0
  });
  const [categoryProgress, setCategoryProgress] = useState<Record<string, { correct: number, total: number }>>({});
  const [loading, setLoading] = useState(true);

  // Fetch user stats and due cards
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
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
        
        // Fetch due cards count
        const now = new Date().toISOString();
        const { count, error: dueError } = await supabase
          .from('user_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .lte('next_review_at', now);
        
        if (dueError) {
          console.error('Error fetching due cards:', dueError);
        } else {
          setDueCards(count || 0);
        }
        
        // Fetch category progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('questions(sub_category), correct_count, incorrect_count')
          .eq('user_id', user.id);
          
        if (progressError) {
          console.error('Error fetching progress:', progressError);
        } else {
          const progress = (progressData || []).reduce((acc: Record<string, { correct: number, total: number }>, curr) => {
            const subCategory = curr.questions?.sub_category;
            if (!subCategory) return acc;
            
            if (!acc[subCategory]) {
              acc[subCategory] = { correct: 0, total: 0 };
            }
            
            acc[subCategory].correct += curr.correct_count || 0;
            acc[subCategory].total += (curr.correct_count || 0) + (curr.incorrect_count || 0);
            
            return acc;
          }, {});
          
          setCategoryProgress(progress);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  if (!user) {
    return null; // Will be handled by the route guard
  }

  const totalProgress = Object.values(categoryProgress).reduce(
    (sum, category) => sum + category.correct, 
    0
  );

  const totalCards = Object.values(categoryProgress).reduce(
    (sum, category) => sum + category.total, 
    0
  );

  const successRate = totalCards > 0 
    ? Math.round((totalProgress / totalCards) * 100) 
    : 0;
  
  // Get today's recommended learning time (5 minutes per 10 cards, minimum 5 minutes)
  const recommendedMinutes = Math.max(5, Math.ceil(dueCards / 10) * 5);

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
        
        {/* Today's Learning Card */}
        <Card className="mb-6 border-2 border-loklernen-ultramarine/20 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-2">
            <CardTitle>Heute lernen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-loklernen-ultramarine/10 rounded-full">
                    <CalendarCheck className="h-5 w-5 text-loklernen-ultramarine" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fällige Karten</p>
                    <p className="text-2xl font-semibold">{dueCards}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-loklernen-ultramarine/10 rounded-full">
                    <Clock className="h-5 w-5 text-loklernen-ultramarine" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Empfohlene Zeit</p>
                    <p className="text-2xl font-semibold">{recommendedMinutes} Min.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-between gap-4">
                {/* Regulation Filter */}
                <div className="bg-white/70 rounded-lg p-3">
                  <RegulationFilterToggle 
                    value={regulationPreference}
                    onChange={handleRegulationChange}
                    title="Regelwerk auswählen"
                    variant="default"
                    className="mb-1"
                  />
                </div>
                
                <div className="flex items-center justify-center">
                  <Link to={`/karteikarten/lernen?regelwerk=${regulationPreference}`}>
                    <Button className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90 w-full">
                      <BookOpen className="mr-2 h-4 w-4" /> Jetzt lernen
                    </Button>
                  </Link>
                </div>
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
          
          {/* Categories Tabs */}
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Kategorien</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signale">
                <TabsList className="w-full">
                  <TabsTrigger value="signale" className="flex-1">Signale</TabsTrigger>
                  <TabsTrigger value="betriebsdienst" className="flex-1">Betriebsdienst</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signale" className="pt-4">
                  <div className="space-y-4">
                    <Link to={`/karteikarten/signale/haupt-vorsignale?regelwerk=${regulationPreference}`} className="block hover:bg-slate-50 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span>Haupt- und Vorsignale</span>
                        <span className="text-sm text-muted-foreground">
                          {categoryProgress['Haupt- und Vorsignale']?.correct || 0} / {categoryProgress['Haupt- und Vorsignale']?.total || 0}
                        </span>
                      </div>
                      <Progress 
                        value={categoryProgress['Haupt- und Vorsignale']?.total > 0 
                          ? (categoryProgress['Haupt- und Vorsignale'].correct / categoryProgress['Haupt- und Vorsignale'].total) * 100 
                          : 0} 
                        className="h-1 mt-1" 
                      />
                    </Link>
                    
                    <Link to={`/karteikarten/signale/zusatz-kennzeichen?regelwerk=${regulationPreference}`} className="block hover:bg-slate-50 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span>Zusatz- & Kennzeichen</span>
                        <span className="text-sm text-muted-foreground">
                          {categoryProgress['Zusatz- & Kennzeichen']?.correct || 0} / {categoryProgress['Zusatz- & Kennzeichen']?.total || 0}
                        </span>
                      </div>
                      <Progress 
                        value={categoryProgress['Zusatz- & Kennzeichen']?.total > 0 
                          ? (categoryProgress['Zusatz- & Kennzeichen'].correct / categoryProgress['Zusatz- & Kennzeichen'].total) * 100 
                          : 0} 
                        className="h-1 mt-1" 
                      />
                    </Link>
                    
                    <div className="flex justify-center mt-4">
                      <Link to={`/karteikarten/signale?regelwerk=${regulationPreference}`}>
                        <Button variant="outline">Alle Signale anzeigen</Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="betriebsdienst" className="pt-4">
                  <div className="space-y-4">
                    <Link to={`/karteikarten/betriebsdienst/grundlagen?regelwerk=${regulationPreference}`} className="block hover:bg-slate-50 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span>Grundlagen Bahnbetrieb</span>
                        <span className="text-sm text-muted-foreground">
                          {categoryProgress['Grundlagen Bahnbetrieb']?.correct || 0} / {categoryProgress['Grundlagen Bahnbetrieb']?.total || 0}
                        </span>
                      </div>
                      <Progress 
                        value={categoryProgress['Grundlagen Bahnbetrieb']?.total > 0 
                          ? (categoryProgress['Grundlagen Bahnbetrieb'].correct / categoryProgress['Grundlagen Bahnbetrieb'].total) * 100 
                          : 0} 
                        className="h-1 mt-1" 
                      />
                    </Link>
                    
                    <Link to={`/karteikarten/betriebsdienst/uvv?regelwerk=${regulationPreference}`} className="block hover:bg-slate-50 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span>UVV & Arbeitsschutz</span>
                        <span className="text-sm text-muted-foreground">
                          {categoryProgress['UVV & Arbeitsschutz']?.correct || 0} / {categoryProgress['UVV & Arbeitsschutz']?.total || 0}
                        </span>
                      </div>
                      <Progress 
                        value={categoryProgress['UVV & Arbeitsschutz']?.total > 0 
                          ? (categoryProgress['UVV & Arbeitsschutz'].correct / categoryProgress['UVV & Arbeitsschutz'].total) * 100 
                          : 0} 
                        className="h-1 mt-1" 
                      />
                    </Link>
                    
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
      </main>
      
      <Footer />
    </div>
  );
}
