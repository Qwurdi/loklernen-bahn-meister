
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
      className="mt-4 border-t border-gray-700 pt-3"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white">Fällige Karten</span>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-700 bg-gray-800 hover:bg-gray-700">
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
            <Button size="sm" className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
              Alle fälligen Karten lernen
            </Button>
          </Link>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
