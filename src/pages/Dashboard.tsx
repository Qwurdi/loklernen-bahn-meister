
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserStats from "@/components/common/UserStats";
import CoursesProgress from "@/components/progress/CoursesProgress";
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards";
import QuickStartSection from "@/components/dashboard/QuickStartSection";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import UpcomingReviews from "@/components/dashboard/UpcomingReviews";
import RecentActivities from "@/components/dashboard/RecentActivities";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { user } = useAuth();
  const { regulationPreference } = useUserPreferences();
  
  // Use the custom hook to fetch dashboard data
  const {
    dueTodaySignals,
    dueTodayBetriebsdienst,
    streak,
    totalXP,
    isLoading
  } = useDashboardData(regulationPreference);

  // Mock data - in a real app this would come from the API
  const completedToday = 12;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <div className="container px-4 py-8">
          {/* Welcome Header with Date and Activity */}
          <WelcomeHeader completedToday={completedToday} />
          
          {/* Summary Cards Section */}
          <DashboardSummaryCards
            dueTodaySignals={dueTodaySignals}
            dueTodayBetriebsdienst={dueTodayBetriebsdienst}
            totalXP={totalXP}
            streak={streak}
            regulationPreference={regulationPreference}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Stats Card */}
            <div className="lg:col-span-1 bg-white rounded-lg border p-5 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Deine Statistiken</h3>
              <UserStats xp={totalXP} level={Math.floor(totalXP / 1000) + 1} streak={streak} />
            </div>
            
            {/* Quick Start Cards */}
            <div className="lg:col-span-2 bg-white rounded-lg border p-5 shadow-sm">
              <QuickStartSection
                dueTodaySignals={dueTodaySignals}
                dueTodayBetriebsdienst={dueTodayBetriebsdienst}
                regulationPreference={regulationPreference}
              />
            </div>
          </div>
          
          {/* Course Progress Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Mein Lernfortschritt</h2>
            <CoursesProgress />
          </div>
          
          {/* Additional Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <UpcomingReviews />
            <RecentActivities />
          </div>
          
          {/* Learning Tip */}
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-loklernen-ultramarine" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Lerntipp des Tages
            </h3>
            <p>Wusstest du schon? Regelmäßiges Wiederholen in kurzen Intervallen ist effektiver als langes Lernen am Stück. 15-20 Minuten täglich bringen langfristig den größten Lernerfolg!</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
