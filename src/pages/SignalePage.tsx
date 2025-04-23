
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

export default function SignalePage() {
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
                <BreadcrumbPage>Signale</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Signale</h1>
            <p className="text-gray-500 max-w-2xl">
              Lerne die wichtigsten Signale der Eisenbahn kennen. Diese Kategorie ist kostenlos und ohne Anmeldung zugänglich. 
              {!user && " Melde dich an, um deinen Lernfortschritt zu speichern."}
            </p>
          </div>
          
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
                  link={`/signale/${encodeURIComponent(subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
                />
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
