
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

// Improved data structure
const mockCourses = [
  {
    id: "signale",
    title: "Signale",
    progress: 48,
    totalCards: 90,
    completedCards: 43,
    subcategories: [
      {
        id: "haupt-vorsignale",
        title: "Haupt- und Vorsignale",
        progress: 65,
        totalCards: 50,
        completedCards: 32,
      },
      {
        id: "zusatz-kennzeichen",
        title: "Zusatz- & Kennzeichen",
        progress: 30, 
        totalCards: 40,
        completedCards: 12,
      }
    ]
  },
  {
    id: "betriebsdienst",
    title: "Betriebsdienst",
    progress: 15,
    totalCards: 70,
    completedCards: 10,
    subcategories: [
      {
        id: "grundlagen",
        title: "Grundlagen Bahnbetrieb",
        progress: 25,
        totalCards: 40,
        completedCards: 10,
      },
      {
        id: "uvv",
        title: "UVV & Arbeitsschutz", 
        progress: 0,
        totalCards: 30,
        completedCards: 0,
        locked: true,
      }
    ]
  }
];

export default function CoursesProgress() {
  const { regulationPreference } = useUserPreferences();
  
  return (
    <div className="space-y-6">
      {mockCourses.map((course) => (
        <Accordion type="single" collapsible key={course.id} className="border rounded-lg">
          <AccordionItem value="course" className="border-none">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{course.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {course.completedCards}/{course.totalCards} Karten
                  </span>
                </div>
                <Progress 
                  value={course.progress}
                  className="h-2" 
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-4 py-2">
                {course.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className={`rounded-lg border p-3 ${subcategory.locked ? 'bg-muted/50' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span>{subcategory.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {subcategory.completedCards}/{subcategory.totalCards}
                      </span>
                    </div>
                    <Progress value={subcategory.progress} className="h-1.5 mb-2" />
                    
                    {subcategory.locked ? (
                      <div className="flex justify-end mt-2">
                        <Button disabled variant="outline" size="sm">
                          Gesperrt
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end mt-2">
                        <Link to={`/karteikarten/${course.id}/${subcategory.id}?regelwerk=${regulationPreference}`}>
                          <Button variant="outline" size="sm">Öffnen</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="flex justify-center mt-2">
                  <Link to={`/karteikarten/${course.id}?regelwerk=${regulationPreference}`}>
                    <Button variant="outline">Alle {course.title} anzeigen</Button>
                  </Link>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
