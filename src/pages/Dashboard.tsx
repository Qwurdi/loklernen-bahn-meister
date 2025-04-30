
import { Link } from "react-router-dom";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserStats from "@/components/common/UserStats";
import CoursesProgress from "@/components/progress/CoursesProgress";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards";
import RegulationPreferenceCard from "@/components/dashboard/RegulationPreferenceCard";
import QuickStartSection from "@/components/dashboard/QuickStartSection";
import { useDashboardData } from "@/hooks/useDashboardData";
import { RegulationFilterType } from "@/types/regulation";

export default function Dashboard() {
  const { user } = useAuth();
  const { regulationPreference, setRegulationPreference } = useUserPreferences();
  
  // Use the custom hook to fetch dashboard data
  const {
    dueTodaySignals,
    dueTodayBetriebsdienst,
    streak,
    totalXP,
    isLoading
  } = useDashboardData(regulationPreference);

  const handleRegulationChange = (value: RegulationFilterType) => {
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
          
          {/* Regulation Preference Card */}
          <RegulationPreferenceCard 
            value={regulationPreference} 
            onChange={handleRegulationChange} 
          />

          {/* Summary Cards Section */}
          <DashboardSummaryCards
            dueTodaySignals={dueTodaySignals}
            dueTodayBetriebsdienst={dueTodayBetriebsdienst}
            totalXP={totalXP}
            streak={streak}
            regulationPreference={regulationPreference}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Stats */}
            <div className="lg:col-span-1">
              <UserStats xp={totalXP} level={Math.floor(totalXP / 1000) + 1} streak={streak} />
            </div>
            
            {/* Quick Start Cards */}
            <div className="lg:col-span-2">
              <QuickStartSection
                dueTodaySignals={dueTodaySignals}
                dueTodayBetriebsdienst={dueTodayBetriebsdienst}
                regulationPreference={regulationPreference}
              />
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
