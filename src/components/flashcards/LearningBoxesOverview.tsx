
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LearningBoxHelp from './LearningBoxHelp';
import SpacedRepetitionTooltip from './stack/SpacedRepetitionTooltip';
import { QuestionCategory } from '@/types/questions';
import LearningBoxesDisplay, { LEARNING_BOXES, BoxStats } from './boxes/LearningBoxesDisplay';
import LearningBoxStats from './boxes/LearningBoxStats';
import DueCardsCollapsible from './boxes/DueCardsCollapsible';
import { RegulationFilterType } from '@/types/regulation';
import { Card } from '@/components/ui/card';

type CategoryFilterType = "all" | QuestionCategory;

export default function LearningBoxesOverview() {
  const { user } = useAuth();
  const { regulationPreference } = useUserPreferences();
  const [category, setCategory] = React.useState<CategoryFilterType>("all");

  // Query to fetch user progress data
  const { data, isLoading } = useQuery({
    queryKey: ['learningBoxes', user?.id, category, regulationPreference],
    queryFn: async () => {
      if (!user) return { boxStats: [], totalCards: 0, dueToday: 0, dueCards: [] };

      // Get all progress records to analyze
      let query = supabase
        .from('user_progress')
        .select('interval_days, questions!inner(*)')
      
      // Filter by category if needed
      if (category !== "all") {
        query = query.eq('questions.category', category as QuestionCategory);
      }

      // Apply regulation filter if it's not "all"
      if (regulationPreference !== "all") {
        query = query.or(`questions.regulation_category.eq.${regulationPreference},questions.regulation_category.eq.both,questions.regulation_category.is.null`);
      }
        
      const { data: progressData, error } = await query;
      
      if (error) throw error;

      // Get due today count and cards
      let dueCardsQuery = supabase
        .from('user_progress')
        .select('*, questions(*)')
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true });
      
      // Apply regulation filter to due cards as well  
      if (regulationPreference !== "all") {
        dueCardsQuery = dueCardsQuery.or(`questions.regulation_category.eq.${regulationPreference},questions.regulation_category.eq.both,questions.regulation_category.is.null`);
      }
      
      const { data: dueCards } = await dueCardsQuery;
      
      const filteredDueCards = dueCards?.filter(card => {
        if (category === "all") return true;
        return card.questions?.category === category;
      }) || [];
      
      console.log(`Progress data: Found ${progressData?.length} cards, filtered due cards: ${filteredDueCards.length}`);
      
      // Calculate counts for each learning box
      const boxStats: BoxStats[] = LEARNING_BOXES.map(box => {
        const count = progressData?.filter(record => {
          const interval = record.interval_days;
          const min = Math.min(...box.days);
          const max = Math.max(...box.days);
          return interval >= min && interval <= max;
        }).length || 0;
        
        return {
          boxNumber: box.id,
          count,
          color: box.color,
          border: box.border,
          name: box.name
        };
      });
      
      return { 
        boxStats,
        totalCards: progressData?.length || 0,
        dueToday: filteredDueCards.length,
        dueCards: filteredDueCards
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!user) {
    return (
      <SpacedRepetitionTooltip>
        <Card className="enhanced-glass-card border-gray-800/50 p-4 mb-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-white">Lernfortschritt</h3>
          <p className="text-gray-400">Melde dich an, um deinen Lernfortschritt zu sehen</p>
        </Card>
      </SpacedRepetitionTooltip>
    );
  }

  if (isLoading) {
    return (
      <Card className="enhanced-glass-card border-gray-800/50 p-4 mb-6">
        <Skeleton className="h-6 w-40 mb-4 bg-gray-800/60" />
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 flex-1 bg-gray-800/60" />
          ))}
        </div>
      </Card>
    );
  }

  const boxStats = data?.boxStats || [];
  const totalCards = data?.totalCards || 0;
  const dueToday = data?.dueToday || 0;
  const dueCards = data?.dueCards || [];

  return (
    <Card className="enhanced-glass-card border-gray-800/50 p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-white">Lernfortschritt</h3>
          <LearningBoxHelp />
        </div>
        
        <Tabs value={category} onValueChange={(value) => setCategory(value as CategoryFilterType)} className="w-full md:w-auto">
          <TabsList className="bg-black/50 backdrop-blur-md border border-gray-800/80">
            <TabsTrigger value="all" className="text-xs md:text-sm data-[state=active]:bg-loklernen-ultramarine data-[state=active]:text-white">Alle</TabsTrigger>
            <TabsTrigger value="Signale" className="text-xs md:text-sm data-[state=active]:bg-loklernen-ultramarine data-[state=active]:text-white">Signale</TabsTrigger>
            <TabsTrigger value="Betriebsdienst" className="text-xs md:text-sm data-[state=active]:bg-loklernen-ultramarine data-[state=active]:text-white">Betriebsdienst</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Learning Boxes Display */}
      <LearningBoxesDisplay boxStats={boxStats} isLoading={isLoading} />

      {/* Stats Display */}
      <LearningBoxStats totalCards={totalCards} dueToday={dueToday} />

      {/* Due Cards Collapsible Section */}
      <DueCardsCollapsible dueToday={dueToday} dueCards={dueCards} />
    </Card>
  );
}
