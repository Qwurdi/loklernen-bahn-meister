
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ProgressRing from "./ProgressRing";
import { RegulationCategory } from "@/types/questions";

interface CategoryCardProps {
  title: string;
  description: string;
  progress: number;
  link: string;
  isPro?: boolean;
  isLocked?: boolean;
  className?: string;
  badge?: RegulationCategory | string;
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
}: CategoryCardProps) {
  return (
    <Link to={isLocked ? "/login" : link} className={cn("block", className)}>
      <div className={cn(
        "relative rounded-lg border p-6 card-hover",
        isLocked ? "bg-muted/50" : "bg-card",
        className
      )}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium leading-none tracking-tight flex items-center gap-2">
              {title}
              {isPro && (
                <span className="ml-2 inline-flex items-center rounded-full bg-loklernen-sapphire px-2 py-1 text-xs text-white">
                  Pro
                </span>
              )}
              {badge && (
                <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-800 px-2 py-1 text-xs">
                  {badge}
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ProgressRing progress={progress} size={40} showPercentage />
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
    </Link>
  );
}
