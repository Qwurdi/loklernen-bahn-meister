import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
// QuestionCategory type might not be needed if we rely on categoryName string
// import { QuestionCategory } from "@/types/questions"; 

interface EmptySessionStateProps {
  categoryName?: string; // Added to use the name passed from LearningSessionPage
  isGuestLearningCategory?: boolean;
  message?: string; 
}

export default function EmptySessionState({ categoryName, isGuestLearningCategory, message }: EmptySessionStateProps) {
  const navigate = useNavigate();
  
  // Simplified navigation path
  const getCategoryPath = () => "/karteikarten";

  let title: string;
  let description: string;

  if (message) {
    // If a specific message is provided, use it directly
    title = "Information"; // Or a more generic title if message implies it
    description = message;
  } else if (isGuestLearningCategory) {
    title = "Keine Karten gefunden";
    description = `In der Kategorie "${categoryName || 'Auswahl'}" wurden keine Karten gefunden. Bitte wähle eine andere Kategorie oder versuche es später erneut.`;
  } else {
    // Default messages when no specific message prop is passed
    if (categoryName && categoryName !== "Auswahl" && categoryName !== "Fällige Karten (Alle Kategorien)") {
      title = `Keine Karten für "${categoryName}"`;
      description = `Für "${categoryName}" sind aktuell keine Karten zur Wiederholung fällig oder es gibt keine neuen Karten zum Lernen. Schaue später wieder vorbei oder wähle eine andere Lernoption.`;
    } else { // Covers "Auswahl", "Fällige Karten (Alle Kategorien)", or undefined categoryName
      title = "Keine Karten fällig";
      description = "Aktuell sind keine Karten zur Wiederholung fällig. Schaue später wieder vorbei oder wähle eine Kategorie, um neue Karten zu lernen.";
    }
  }

  // Determine if the button to navigate to categories should be shown
  // Show if not a custom message, or if a category context exists.
  // If it's a generic "Intelligenter Lernstart..." message, we might not want a button or a different one.
  const showButton = !message || (categoryName && categoryName !== "Auswahl"); // Example: Don't show for generic "Auswahl" if it's an error

  return (
    <main className="flex-1 container py-12 flex flex-col items-center justify-center">
      <Card className="p-6 max-w-md text-center bg-gray-900 border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-gray-300 mb-6">{description}</p>
        {/* Show button to navigate to categories, unless it's a specific message that implies otherwise */}
        {showButton && (
          <Button onClick={() => navigate(getCategoryPath())} className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
            Zu den Kategorien
          </Button>
        )}
      </Card>
    </main>
  );
}
