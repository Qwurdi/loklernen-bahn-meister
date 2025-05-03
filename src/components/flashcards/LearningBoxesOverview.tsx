
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SpacedRepetitionTooltip from './stack/SpacedRepetitionTooltip';
import LearningBoxHelp from './LearningBoxHelp';
import { QuestionCategory } from '@/types/questions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DueCardsMiniView from './stack/DueCardsMiniView';

// Define learning box intervals
const LEARNING_BOXES = [
  { id: 1, name: "Box 1", days: [1], color: "bg-red-500" },
  { id: 2, name: "Box 2", days: [6], color: "bg-amber-500" },
  { id: 3, name: "Box 3", days: [7, 14], color: "bg-yellow-400" },
  { id: 4, name: "Box 4", days: [15, 30], color: "bg-lime-500" },
  { id: 5, name: "Box 5", days: [31, 999], color: "bg-green-600" }
];

// Types for our component
interface BoxStats {
  boxId: number;
  count: number;
  color: string;
  name: string;
}

type CategoryFilterType = "all" | QuestionCategory;

export default function LearningBoxesOverview() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [category, setCategory] = React.useState<CategoryFilterType>("all");
  const [isOpen, setIsOpen] = React.useState(false);

  // Query to fetch user progress data
  const { data, isLoading } = useQuery({
    queryKey: ['learningBoxes', user?.id, category],
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
        
      const { data: progressData, error } = await query;
      
      if (error) throw error;

      // Get due today count and cards
      const { data: dueCards } = await supabase
        .from('user_progress')
        .select('*, questions(*)')
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true });
      
      const filteredDueCards = dueCards?.filter(card => {
        if (category === "all") return true;
        return card.questions?.category === category;
      }) || [];
      
      // Calculate counts for each learning box
      const boxStats = LEARNING_BOXES.map(box => {
        const count = progressData?.filter(record => {
          const interval = record.interval_days;
          const min = Math.min(...box.days);
          const max = Math.max(...box.days);
          return interval >= min && interval <= max;
        }).length || 0;
        
        return {
          boxId: box.id,
          count,
          color: box.color,
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
        <div className="bg-black border border-gray-800 rounded-lg p-4 mb-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-white">Lernfortschritt</h3>
          <p className="text-gray-400">Melde dich an, um deinen Lernfortschritt zu sehen</p>
        </div>
      </SpacedRepetitionTooltip>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-4 mb-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 flex-1" />
          ))}
        </div>
      </div>
    );
  }

  const boxStats = data?.boxStats || [];
  const totalCards = data?.totalCards || 0;
  const dueToday = data?.dueToday || 0;
  const dueCards = data?.dueCards || [];

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-white">Lernfortschritt</h3>
          <LearningBoxHelp />
        </div>
        
        <Tabs value={category} onValueChange={(value) => setCategory(value as CategoryFilterType)} className="w-full md:w-auto">
          <TabsList className="bg-gray-900">
            <TabsTrigger value="all" className="text-xs md:text-sm">Alle</TabsTrigger>
            <TabsTrigger value="Signale" className="text-xs md:text-sm">Signale</TabsTrigger>
            <TabsTrigger value="Betriebsdienst" className="text-xs md:text-sm">Betriebsdienst</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {boxStats.map((box) => (
          <div key={box.boxId} className="flex flex-col items-center">
            <div className="relative w-full">
              <div 
                className={`${box.color} h-${Math.max(3, Math.min(20, Math.ceil(box.count/2)))} min-h-[24px] w-full rounded-t-md`} 
                style={{ height: `${Math.max(24, Math.min(80, box.count * 4))}px` }}
              />
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-black px-1 rounded">
                <span className="text-xs font-medium">{box.count}</span>
              </div>
            </div>
            <div className="text-center mt-1">
              <span className={`text-xs ${isMobile ? '' : 'font-semibold'}`}>
                {isMobile ? `B${box.boxId}` : box.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between mt-4 text-sm text-gray-400 border-t border-gray-800 pt-3">
        <div className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          <span>{totalCards} Karten insgesamt</span>
        </div>
        
        <div className="flex items-center gap-1 mt-2 sm:mt-0">
          <Clock className="h-4 w-4" />
          <span className="text-loklernen-ultramarine">{dueToday} Karten heute fällig</span>
        </div>
      </div>

      {dueToday > 0 && (
        <Collapsible 
          open={isOpen} 
          onOpenChange={setIsOpen}
          className="mt-4 border-t border-gray-800 pt-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Fällige Karten</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-2">
            <DueCardsMiniView dueCards={dueCards} />
            
            <div className="mt-3 flex justify-center">
              <Link to="/karteikarten/lernen">
                <Button size="sm" className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
                  Alle fälligen Karten lernen
                </Button>
              </Link>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
