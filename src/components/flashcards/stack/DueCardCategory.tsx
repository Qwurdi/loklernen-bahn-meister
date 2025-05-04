
import React from 'react';
import { Signal } from 'lucide-react';
import DueCardSubcategory from './DueCardSubcategory';

interface DueCardCategoryProps {
  category: string;
  subcategories: Record<string, any[]>;
  hoverCard: string | null;
  onHoverCard: (id: string | null) => void;
}

export default function DueCardCategory({ 
  category, 
  subcategories, 
  hoverCard, 
  onHoverCard 
}: DueCardCategoryProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-gray-700">
          {category === "Signale" ? (
            <Signal className="h-4 w-4 inline mr-1 text-loklernen-ultramarine" />
          ) : (
            <span className="inline-block w-4 h-4 bg-loklernen-ultramarine rounded-sm mr-1"></span>
          )}
          {category}
        </h4>
      </div>
      
      <div className="space-y-4">
        {Object.entries(subcategories).map(([subcategory, cards]) => (
          <DueCardSubcategory 
            key={subcategory}
            subcategory={subcategory}
            cards={cards}
            hoverCard={hoverCard}
            onHoverCard={onHoverCard}
          />
        ))}
      </div>
    </div>
  );
}
