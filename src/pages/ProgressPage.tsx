
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserStats from "@/components/common/UserStats";
import CoursesProgress from "@/components/progress/CoursesProgress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";

// Temporary mock data - will be replaced with Supabase data
const mockUserData = {
  xp: 1250,
  level: 4,
  streak: 7,
};

export default function ProgressPage() {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="container flex-1 py-12 pb-24">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Dein Fortschritt</h1>
        
        {/* User Stats Section */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Übersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <UserStats 
                xp={mockUserData.xp} 
                level={mockUserData.level} 
                streak={mockUserData.streak} 
              />
            </CardContent>
          </Card>
        </section>

        {/* Courses Progress Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Kurse</CardTitle>
            </CardHeader>
            <CardContent>
              <CoursesProgress />
            </CardContent>
          </Card>
        </section>
      </main>

      {!isMobile && <Footer />}
      <BottomNavigation />
    </div>
  );
}
