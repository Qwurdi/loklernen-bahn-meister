
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  bgColor?: string;
  showPercentage?: boolean;
}

export default function ProgressRing({
  progress = 0,
  size = 60,
  strokeWidth = 4,
  className,
  color = "stroke-loklernen-ultramarine",
  bgColor = "stroke-gray-200",
  showPercentage = false,
}: ProgressRingProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;
  
  return (
    <div className={cn("progress-ring-container", className)} style={{ width: size, height: size }}>
      <svg
        className="progress-ring"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className={bgColor}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`progress-ring__circle ${color}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showPercentage && (
        <div 
          className="absolute inset-0 flex items-center justify-center text-xs font-medium"
          style={{ fontSize: size * 0.25 }}
        >
          {Math.round(normalizedProgress)}%
        </div>
      )}
    </div>
  );
}
