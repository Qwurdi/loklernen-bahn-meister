
import { Progress } from "@/components/ui/progress";
import ProgressRing from "@/components/common/ProgressRing";

// Temporary mock data - will be replaced with Supabase data
const mockCourses = [
  {
    id: 1,
    title: "Haupt- und Vorsignale",
    category: "Signale",
    progress: 65,
    totalCards: 50,
    completedCards: 32,
  },
  {
    id: 2,
    title: "Zusatz- & Kennzeichen",
    category: "Signale",
    progress: 30,
    totalCards: 40,
    completedCards: 12,
  },
  {
    id: 3,
    title: "Grundlagen Bahnbetrieb",
    category: "Betriebsdienst",
    progress: 0,
    totalCards: 45,
    completedCards: 0,
    locked: true,
  },
];

export default function CoursesProgress() {
  return (
    <div className="space-y-6">
      {mockCourses.map((course) => (
        <div key={course.id} className="flex items-center gap-4">
          <div className="w-12">
            <ProgressRing progress={course.progress} size={48} showPercentage />
          </div>
          
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{course.title}</p>
                <p className="text-sm text-muted-foreground">{course.category}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {course.completedCards}/{course.totalCards} Karten
              </span>
            </div>
            <Progress value={course.progress} />
          </div>
        </div>
      ))}
    </div>
  );
}
