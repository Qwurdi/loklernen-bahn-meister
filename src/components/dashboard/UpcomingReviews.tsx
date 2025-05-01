
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { formatDistanceToNow, addDays } from "date-fns";
import { de } from "date-fns/locale";

// Mock upcoming reviews data - in a real app this would come from props
const upcomingReviews = [
  {
    id: 1,
    day: "Morgen",
    category: "Signale",
    count: 25,
    date: addDays(new Date(), 1)
  },
  {
    id: 2,
    day: "Übermorgen",
    category: "Betriebsdienst",
    count: 15,
    date: addDays(new Date(), 2)
  },
  {
    id: 3,
    day: "Später",
    category: "Signale",
    count: 30,
    date: addDays(new Date(), 4)
  }
];

export default function UpcomingReviews() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Kommende Wiederholungen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingReviews.map((review) => (
            <div key={review.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{review.day}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(review.date, { 
                    addSuffix: true, 
                    locale: de 
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={review.category === "Signale" ? "secondary" : "outline"} className="bg-loklernen-ultramarine/10 text-loklernen-ultramarine border-loklernen-ultramarine/20">
                  {review.count} Karten
                </Badge>
                <span className="font-medium">{review.category}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
