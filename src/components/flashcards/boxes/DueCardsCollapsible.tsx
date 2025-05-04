
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import DueCardsMiniView from '../stack/DueCardsMiniView';

interface DueCardsCollapsibleProps {
  dueToday: number;
  dueCards: any[];
}

export default function DueCardsCollapsible({ dueToday, dueCards }: DueCardsCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (dueToday === 0) {
    return null;
  }

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className="mt-4 border-t border-white/10 pt-3"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-loklernen-coral rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-white">Fällige Karten</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-loklernen-coral text-black font-medium">{dueToday}</span>
        </div>
        
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-white/10 bg-black/30 backdrop-blur-md hover:bg-gray-800">
            {isOpen ? 
              <ChevronUp className="h-4 w-4 text-gray-300" /> : 
              <ChevronDown className="h-4 w-4 text-gray-300" />
            }
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-2">
        <DueCardsMiniView dueCards={dueCards} />
        
        <div className="mt-3 flex justify-center">
          <Link to="/karteikarten/lernen">
            <Button className="bg-gradient-ultramarine hover:bg-loklernen-ultramarine/90 shadow-md">
              Alle fälligen Karten lernen
            </Button>
          </Link>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
