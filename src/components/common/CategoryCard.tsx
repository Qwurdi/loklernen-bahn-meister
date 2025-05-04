
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryStats {
  totalCards: number;
  dueCards?: number;
  masteredCards?: number;
}

interface CategoryCardProps {
  title: string;
  description?: string;
  progress: number;
  link?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  selectable?: boolean;
  isLocked?: boolean;
  isPro?: boolean;
  stats?: CategoryStats;
  regulationCategory?: string;
}

export default function CategoryCard({
  title,
  description,
  progress,
  link,
  isSelected = false,
  onSelect,
  selectable = false,
  isLocked = false,
  isPro = false,
  stats,
  regulationCategory
}: CategoryCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    if (selectable && onSelect) {
      e.preventDefault();
      onSelect();
    }
  };

  // Determine progress bar color based on progress percentage
  const progressColorClass = progress >= 75 
    ? "bg-loklernen-mint" 
    : progress >= 40 
      ? "bg-loklernen-tranquil" 
      : "bg-loklernen-ultramarine";

  return (
    <Card 
      className={cn(
        "category-card relative overflow-hidden transition-all duration-200 bg-white border",
        isSelected 
          ? "border-loklernen-ultramarine/80 shadow-md shadow-loklernen-ultramarine/20" 
          : "border-gray-200 shadow-md shadow-black/10 hover:shadow-lg hover:shadow-black/20", 
        isLocked ? "opacity-80" : ""
      )}
      onClick={handleCardClick}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-gradient-ultramarine flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" className="text-white">
            <polyline points="6 12 10 16 18 8"></polyline>
          </svg>
        </div>
      )}
      
      <div className="p-4 flex flex-col h-full">
        {/* Title and stats section */}
        <div className="mb-2 flex justify-between items-center">
          <h3 className="font-medium text-lg text-gray-800 line-clamp-1">{title}</h3>
          
          {isPro && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black">
              PRO
            </span>
          )}
          
          {regulationCategory && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {regulationCategory}
            </span>
          )}
        </div>
        
        {/* Progress bar - slimmer and more subtle */}
        <div className="mb-3">
          <Progress 
            value={progress} 
            className="h-1.5 bg-gray-100" 
            indicatorClassName={progressColorClass}
          />
        </div>
        
        {/* Stats with improved layout */}
        {stats && (
          <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2">
            <div className="flex items-center">
              <span className="text-gray-800 font-medium">{stats.totalCards}</span>
              <span className="text-gray-500 ml-1 text-xs">Karten</span>
            </div>
            
            {stats.dueCards !== undefined && (
              <div className="flex items-center">
                <span className={cn(
                  "font-medium",
                  stats.dueCards > 0 ? "text-loklernen-coral" : "text-gray-500"
                )}>
                  {stats.dueCards}
                </span>
                <span className="text-gray-500 ml-1 text-xs">fällig</span>
              </div>
            )}
            
            {stats.masteredCards !== undefined && stats.masteredCards > 0 && (
              <div className="flex items-center">
                <span className="text-loklernen-mint font-medium">{stats.masteredCards}</span>
                <span className="text-gray-500 ml-1 text-xs">gemeistert</span>
              </div>
            )}
          </div>
        )}
        
        {/* Description - shorter with ellipsis */}
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-4">{description}</p>
        )}
        
        {/* Card footer - Link or Locked status */}
        <div className="mt-auto">
          {isLocked ? (
            <div className="flex items-center text-sm text-gray-500">
              <Lock size={14} className="mr-1" />
              <span>
                {isPro ? "Pro-Funktion" : "Bitte anmelden"}
              </span>
            </div>
          ) : link ? (
            <Link
              to={link}
              className={cn(
                "text-sm flex items-center text-loklernen-ultramarine hover:text-loklernen-sapphire transition-colors",
                selectable ? "pointer-events-none" : ""
              )}
            >
              {selectable ? (
                "Klicken zum Auswählen"
              ) : (
                <>
                  Karten ansehen
                  <ExternalLink size={14} className="ml-1" />
                </>
              )}
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
