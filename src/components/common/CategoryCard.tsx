
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ProgressRing from "./ProgressRing";
import { RegulationCategory } from "@/types/questions";
import { CheckCircle, Clock, Radiation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  title: string;
  description: string;
  progress: number;
  link: string;
  isPro?: boolean;
  isLocked?: boolean;
  className?: string;
  badge?: RegulationCategory | string;
  isSelected?: boolean;
  onSelect?: () => void;
  selectable?: boolean;
  stats?: {
    totalCards?: number;
    dueCards?: number;
    masteredCards?: number;
  };
}

export default function CategoryCard({
  title,
  description,
  progress,
  link,
  isPro = false,
  isLocked = false,
  className,
  badge,
  isSelected = false,
  onSelect,
  selectable = false,
  stats
}: CategoryCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (selectable && onSelect) {
      e.preventDefault();
      onSelect();
    }
  };
  
  const cardContent = (
    <div className={cn(
      "relative rounded-lg border p-6 transition-all duration-200",
      selectable ? "cursor-pointer" : "card-hover",
      isSelected ? "category-card selected ring-2 ring-loklernen-ultramarine" : "category-card",
      isLocked ? "bg-muted/50" : "bg-card",
      className
    )} onClick={handleClick}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium leading-none tracking-tight flex items-center gap-2">
            {title}
            {isPro && (
              <Badge variant="outline" className="ml-2 bg-loklernen-sapphire text-white border-loklernen-sapphire">
                Pro
              </Badge>
            )}
            {badge && (
              <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
                {badge}
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>

          {stats && (
            <div className="mt-3 space-y-1 pt-2 border-t border-gray-800">
              {stats.totalCards !== undefined && (
                <div className="stat-item">
                  <span>Karten:</span> 
                  <span className="stat-value">{stats.totalCards}</span>
                </div>
              )}
              {stats.dueCards !== undefined && stats.dueCards > 0 && (
                <div className="stat-item text-amber-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{stats.dueCards} fällig</span>
                </div>
              )}
              {stats.masteredCards !== undefined && (
                <div className="stat-item text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{stats.masteredCards} gemeistert</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <ProgressRing 
            progress={progress} 
            size={40} 
            strokeWidth={4}
            showPercentage 
            color={progress > 80 ? "stroke-emerald-500" : 
                 progress > 50 ? "stroke-amber-500" : 
                 "stroke-loklernen-ultramarine"}
          />
          {isSelected && (
            <div className="absolute -top-2 -right-2 bg-loklernen-ultramarine rounded-full w-5 h-5 flex items-center justify-center text-white">
              <CheckCircle className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-sm font-medium">Anmelden zum Freischalten</p>
          </div>
        </div>
      )}
    </div>
  );

  if (selectable) {
    return cardContent;
  }

  return (
    <Link to={isLocked ? "/login" : link} className={cn("block", className)}>
      {cardContent}
    </Link>
  );
}
