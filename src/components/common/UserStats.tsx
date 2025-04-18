
import { Trophy, Flame, Star } from "lucide-react";

interface UserStatsProps {
  xp: number;
  level: number;
  streak: number;
}

export default function UserStats({ xp, level, streak }: UserStatsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
            <Trophy className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">XP</p>
            <p className="font-medium">{xp}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
            <Star className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Level</p>
            <p className="font-medium">{level}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
            <Flame className={`h-5 w-5 text-orange-600 ${streak > 0 ? 'animate-pulse-subtle' : ''}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="font-medium">{streak} {streak === 1 ? 'Tag' : 'Tage'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
