
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { format, subHours } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Mock recent activities data - in a real app this would come from props
const recentActivities = [
  {
    id: 1,
    type: "completion",
    category: "Signale",
    subcategory: "Haupt- und Vorsignale",
    count: 10,
    timestamp: subHours(new Date(), 1),
  },
  {
    id: 2,
    type: "streak",
    days: 7,
    timestamp: subHours(new Date(), 5),
  },
  {
    id: 3,
    type: "achievement",
    name: "Signal-Profi",
    description: "100 Signalkarten korrekt beantwortet",
    timestamp: subHours(new Date(), 12),
  },
];

export default function RecentActivities() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Kürzliche Aktivitäten
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="border-l-2 border-loklernen-ultramarine pl-4 relative">
              <div className="absolute w-2 h-2 rounded-full bg-loklernen-ultramarine -left-[4.5px] top-1.5"></div>
              <p className="text-sm text-muted-foreground">
                {format(activity.timestamp, "HH:mm", { locale: de })}
              </p>
              <div className="mt-1">
                {activity.type === "completion" && (
                  <p>
                    <span className="font-medium">{activity.count} Karten</span> in{" "}
                    <span className={cn("font-medium text-loklernen-ultramarine")}>{activity.subcategory}</span> abgeschlossen
                  </p>
                )}
                
                {activity.type === "streak" && (
                  <p>
                    <span className="font-medium">Glückwunsch!</span> Du hast eine Serie von{" "}
                    <span className="font-medium text-loklernen-ultramarine">{activity.days} Tagen</span> erreicht
                  </p>
                )}
                
                {activity.type === "achievement" && (
                  <p>
                    Abzeichen <span className="font-medium text-loklernen-ultramarine">{activity.name}</span> freigeschaltet:<br />
                    <span className="text-sm">{activity.description}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
