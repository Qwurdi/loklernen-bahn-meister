
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegulationFilterType } from "@/types/regulation";
import { QuestionCategory } from "@/types/questions";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

export function useCardsPageData(user: any) {
  const { regulationPreference } = useUserPreferences();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [regulationFilter, setRegulationFilter] = useState<RegulationFilterType>(regulationPreference);
  const [activeTab, setActiveTab] = useState<"signale" | "betriebsdienst">("signale");
  
  // Reset selections when changing tabs
  useEffect(() => {
    setSelectedCategories([]);
  }, [activeTab]);

  // Synchronize with user preferences when they change
  useEffect(() => {
    setRegulationFilter(regulationPreference);
  }, [regulationPreference]);

  // Fetch progress stats for each subcategory
  const { data: progressStats } = useQuery({
    queryKey: ['signalProgress', user?.id, regulationFilter],
    queryFn: async () => {
      if (!user) return {};
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('questions(sub_category, regulation_category), correct_count, incorrect_count, next_review_at')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Aggregate stats by subcategory
      return (data || []).reduce((acc: Record<string, { 
        correct: number, 
        total: number, 
        due: number,
        mastered: number,
        regulationStats: Record<string, number>  
      }>, curr) => {
        const subCategory = curr.questions?.sub_category;
        const regulationCategory = curr.questions?.regulation_category || "Allgemein";
        
        if (!subCategory) return acc;
        
        if (!acc[subCategory]) {
          acc[subCategory] = { 
            correct: 0, 
            total: 0, 
            due: 0, 
            mastered: 0,
            regulationStats: {}
          };
        }
        
        // Track correct answers and total attempts
        acc[subCategory].correct += curr.correct_count || 0;
        acc[subCategory].total += (curr.correct_count || 0) + (curr.incorrect_count || 0);
        
        // Count due cards (where next_review_at is in the past)
        const now = new Date().toISOString();
        if (curr.next_review_at && curr.next_review_at <= now) {
          acc[subCategory].due += 1;
        }

        // Count mastered cards (cards that have been reviewed at least 5 times with correct answers)
        if (curr.correct_count >= 5) {
          acc[subCategory].mastered += 1;
        }

        // Count by regulation category
        if (!acc[subCategory].regulationStats[regulationCategory]) {
          acc[subCategory].regulationStats[regulationCategory] = 0;
        }
        acc[subCategory].regulationStats[regulationCategory] += 1;
        
        return acc;
      }, {});
    },
    enabled: !!user
  });

  // Query to get total cards per category
  const { data: categoryCardCounts } = useQuery({
    queryKey: ['categoryCardCounts', regulationFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('sub_category, regulation_category, category')
        .order('sub_category', { ascending: true });
        
      if (error) throw error;
      
      // Group by subcategory
      return (data || []).reduce((acc: Record<string, { 
        total: number,
        byRegulation: Record<string, number>
      }>, curr) => {
        const subCategory = curr.sub_category;
        const regulationCategory = curr.regulation_category || "Allgemein";
        
        if (!acc[subCategory]) {
          acc[subCategory] = { 
            total: 0,
            byRegulation: {}
          };
        }
        
        acc[subCategory].total += 1;
        
        if (!acc[subCategory].byRegulation[regulationCategory]) {
          acc[subCategory].byRegulation[regulationCategory] = 0;
        }
        acc[subCategory].byRegulation[regulationCategory] += 1;
        
        return acc;
      }, {});
    }
  });

  const handleSelectCategory = (subcategory: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(subcategory)) {
        return prev.filter(cat => cat !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
  };

  const clearSelection = () => {
    setSelectedCategories([]);
  };

  return {
    selectedCategories,
    regulationFilter,
    activeTab,
    progressStats,
    categoryCardCounts,
    setActiveTab,
    setRegulationFilter,
    handleSelectCategory,
    clearSelection
  };
}
