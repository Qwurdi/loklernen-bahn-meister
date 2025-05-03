
import { Button } from "@/components/ui/button";
import { ChevronLeft, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";

interface SessionHeaderProps {
  sessionTitle: string;
  categoryParam: QuestionCategory;
  isMobile: boolean;
}

export default function SessionHeader({ 
  sessionTitle, 
  categoryParam, 
  isMobile 
}: SessionHeaderProps) {
  const navigate = useNavigate();
  
  const getCategoryPath = () => {
    return categoryParam === "Betriebsdienst" 
      ? "/karteikarten/betriebsdienst" 
      : "/karteikarten";
  };

  // Mobile-specific compact header
  if (isMobile) {
    return (
      <div className="px-3 pt-2 pb-1">
        <h2 className="text-xl font-semibold">{sessionTitle}</h2>
      </div>
    );
  }

  // Desktop header with back and category buttons
  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800"
        onClick={() => navigate(getCategoryPath())}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Zurück
      </Button>
      
      <h2 className="text-xl font-semibold">{sessionTitle}</h2>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center text-white hover:bg-gray-800"
        onClick={() => navigate(getCategoryPath())}
      >
        <List className="h-4 w-4 mr-1" />
        Alle Kategorien
      </Button>
    </div>
  );
}
