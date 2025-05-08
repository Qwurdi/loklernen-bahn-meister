import { Button } from "@/components/ui/button";
import { ChevronLeft, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuestionCategory } from "@/types/questions";

interface SessionHeaderProps {
  sessionTitle: string;
  categoryParam?: QuestionCategory; // Made categoryParam optional
  isMobile: boolean;
}

export default function SessionHeader({ 
  sessionTitle, 
  categoryParam, 
  isMobile 
}: SessionHeaderProps) {
  const navigate = useNavigate();

  // Determine the display title based on whether categoryParam is provided
  const displayTitle = categoryParam ? `${sessionTitle}: ${categoryParam}` : sessionTitle;

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-lg font-semibold truncate px-2">
        {displayTitle} 
      </h1>
      {isMobile ? (
        <Button variant="ghost" size="icon" onClick={() => navigate("/cards")}>
          <List className="h-6 w-6" />
        </Button>
      ) : (
        <div style={{ width: '40px' }} /> // Placeholder to balance the header
      )}
    </header>
  );
}
