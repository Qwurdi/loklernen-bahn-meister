import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useQuestionFilters } from "@/hooks/useQuestionFilters";
import {
  Award,
  BookOpen,
  Brain,
  Clock,
  TrafficCone,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { RegulationFilterToggle } from "@/components/common/RegulationFilterToggle";
import { toast } from "sonner";
import CoursesProgress from "@/components/progress/CoursesProgress";
import UserStats from "@/components/common/UserStats";

export default function Dashboard() {
  const { user } = useAuth();
  const { regulationPreference, setRegulationPreference } = useUserPreferences();
  const [dueTodaySignals, setDueTodaySignals] = useState(0);
  const [dueTodayBetriebsdienst, setDueTodayBetriebsdienst] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDueCards = useCallback(async (category, regulationFilter) => {
    try {
      if (!user) return 0;
      
      // Get current date in ISO format for comparison
      const now = new Date().toISOString();
      
      // Query user_progress joined with questions to filter by category and regulation
      const { count, error } = await supabase
        .from('user_progress')
        .select('question_id, questions!inner(category, regulation_category)', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('questions.category', category)
        .lte('next_review_at', now)
        .or(`questions.regulation_category.eq.${regulationFilter},questions.regulation_category.eq.both,questions.regulation_category.is.null`);
        
      if (error) {
        console.error(`Error fetching ${category} due cards:`, error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error(`Error fetching ${category} due cards:`, error);
      return 0;
    }
  }, [user]);

  const fetchUserStats = useCallback(async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_stats')
        .select('streak_days, xp')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching user stats:", error);
        return;
      }
      
      if (data) {
        setStreak(data.streak_days);
        setTotalXP(data.xp);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch due cards for both categories
        const signalsDue = await fetchDueCards('Signale', regulationPreference);
        const betriebsdienstDue = await fetchDueCards('Betriebsdienst', regulationPreference);
        
        setDueTodaySignals(signalsDue);
        setDueTodayBetriebsdienst(betriebsdienstDue);
        
        await fetchUserStats();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Fehler beim Laden der Dashboard-Daten");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchDueCards, fetchUserStats, regulationPreference, user]);

  // Calculate the total due today
  const totalDueToday = dueTodaySignals + dueTodayBetriebsdienst;

  const handleRegulationChange = (value) => {
    setRegulationPreference(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-6">
          <h1 className="text-xl font-bold mb-1">Dein Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Willkommen zurück{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
          </p>
          
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between mb-2">
              <h2 className="text-lg font-semibold mb-3 sm:mb-0">Regelwerk-Präferenz</h2>
            </div>
            <Card className="p-4">
              <RegulationFilterToggle 
                value={regulationPreference}
                onChange={handleRegulationChange}
                showInfoTooltip={true}
              />
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {/* Due Today Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-amber-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium">Heute fällig</CardTitle>
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold">{totalDueToday}</span>
                  <span className="text-sm text-muted-foreground">Karten</span>
                </div>
                <div className="flex flex-col text-sm text-muted-foreground">
                  <span>{dueTodaySignals} Signale</span>
                  <span>{dueTodayBetriebsdienst} Betriebsdienst</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/40 pt-2">
                <Link to={`/karteikarten/lernen?regelwerk=${regulationPreference}`} className="w-full">
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    <span>Alle wiederholen</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* XP Today Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-purple-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium">Gesammelte XP</CardTitle>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Zap className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold">{totalXP.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">Punkte</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>Nächstes Level: {Math.floor(totalXP / 1000) + 1}</span>
                </div>
                <Progress className="mt-2 h-1" value={(totalXP % 1000) / 10} />
              </CardContent>
              <CardFooter className="bg-muted/40 pt-2">
                <Link to="/fortschritt" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    <span>Mehr Statistiken</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Streak Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-green-50 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium">Lernserie</CardTitle>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold">{streak}</span>
                  <span className="text-sm text-muted-foreground">Tage in Folge</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>Weiter so! Bleib dran und lerne jeden Tag.</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/40 pt-2">
                <Link to={`/karteikarten/lernen?regelwerk=${regulationPreference}`} className="w-full">
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    <span>Heute lernen</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Stats */}
            <div className="lg:col-span-1">
              <UserStats xp={totalXP} level={Math.floor(totalXP / 1000) + 1} streak={streak} />
            </div>
            
            {/* Quick Start Cards */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-semibold text-lg">Schnellstart</h2>
              
              {/* Signale Learning Card */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-loklernen-ultramarine/10 rounded-full">
                    <Brain className="h-5 w-5 text-loklernen-ultramarine" />
                  </div>
                  <div>
                    <p className="font-medium">Signale</p>
                    <p className="text-sm text-gray-500">
                      {dueTodaySignals} Karten fällig
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
              <div className="bg-[#e6fff9] p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-[#00B8A9]/10 rounded-full">
                    <TrafficCone className="h-5 w-5 text-[#00B8A9]" />
                  </div>
                  <div>
                    <p className="font-medium">Betriebsdienst</p>
                    <p className="text-sm text-gray-500">
                      {dueTodayBetriebsdienst} Karten fällig
                    </p>
                  </div>
                </div>
                <Link to={`/karteikarten/lernen?regelwerk=${regulationPreference}&category=Betriebsdienst`}>
                  <Button className="w-full bg-[#00B8A9] hover:bg-[#00B8A9]/90">
                    <BookOpen className="mr-2 h-4 w-4" /> Betriebsdienst lernen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Course Progress Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Mein Lernfortschritt</h2>
            <CoursesProgress />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
