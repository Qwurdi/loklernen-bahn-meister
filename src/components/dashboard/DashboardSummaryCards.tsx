
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award, Clock, Zap, ChevronRight } from "lucide-react";
import { RegulationFilterType } from "@/types/regulation";

interface DashboardSummaryCardsProps {
  dueTodaySignals: number;
  dueTodayBetriebsdienst: number;
  totalXP: number;
  streak: number;
  regulationPreference: RegulationFilterType;
}

export default function DashboardSummaryCards({ 
  dueTodaySignals = 0, 
  dueTodayBetriebsdienst = 0, 
  totalXP = 0, 
  streak = 0,
  regulationPreference 
}: DashboardSummaryCardsProps) {
  const totalDueToday = dueTodaySignals + dueTodayBetriebsdienst;

  return (
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
  );
}
