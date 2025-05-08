
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface EmptySessionStateProps {
  categoryName?: string;
  categoryId?: string; // Added to match usage in SessionContent
  subcategory?: string; // Added to match usage in SessionContent
  isGuestLearningCategory?: boolean;
  message?: string; 
}

export default function EmptySessionState({ 
  categoryId,
  categoryName, 
  subcategory,
  isGuestLearningCategory, 
  message 
}: EmptySessionStateProps) {
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
    description = `In der Kategorie "${categoryName || subcategory || 'Auswahl'}" wurden keine Karten gefunden. Bitte wähle eine andere Kategorie oder versuche es später erneut.`;
  } else {
    // Default messages when no specific message prop is passed
    if ((categoryName && categoryName !== "Auswahl" && categoryName !== "Fällige Karten (Alle Kategorien)") || 
        (subcategory && subcategory !== "Auswahl")) {
      title = `Keine Karten für "${categoryName || subcategory}"`;
      description = `Für "${categoryName || subcategory}" sind aktuell keine Karten zur Wiederholung fällig oder es gibt keine neuen Karten zum Lernen. Schaue später wieder vorbei oder wähle eine andere Lernoption.`;
    } else { // Covers "Auswahl", "Fällige Karten (Alle Kategorien)", or undefined categoryName
      title = "Keine Karten fällig";
      description = "Aktuell sind keine Karten zur Wiederholung fällig. Schaue später wieder vorbei oder wähle eine Kategorie, um neue Karten zu lernen.";
    }
  }

  // Determine if the button to navigate to categories should be shown
  const showButton = !message || (categoryName && categoryName !== "Auswahl") || (subcategory && subcategory !== "Auswahl");

  return (
    <main className="flex-1 container py-12 flex flex-col items-center justify-center">
      <Card className="p-6 max-w-md text-center bg-gray-900 border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-gray-300 mb-6">{description}</p>
        {showButton && (
          <Button onClick={() => navigate(getCategoryPath())} className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
            Zu den Kategorien
          </Button>
        )}
      </Card>
    </main>
  );
}
