
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, TrafficCone } from "lucide-react";
import { RegulationFilterType } from "@/types/regulation";

interface QuickStartSectionProps {
  dueTodaySignals: number;
  dueTodayBetriebsdienst: number;
  regulationPreference: RegulationFilterType;
}

export default function QuickStartSection({ 
  dueTodaySignals = 0, 
  dueTodayBetriebsdienst = 0,
  regulationPreference
}: QuickStartSectionProps) {
  return (
    <div className="space-y-4">
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
      
      {/* Betriebsdienst Learning Card */}
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
  );
}
