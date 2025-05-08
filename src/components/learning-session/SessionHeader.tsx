
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface SessionHeaderProps {
  sessionTitle: string;
  categoryParam?: string; // Will be unused now that we have the resolved title
  isMobile: boolean;
}

export default function SessionHeader({ sessionTitle, isMobile }: SessionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Link to="/karteikarten">
          <Button
            variant="ghost"
            size="sm"
            className={`${isMobile ? "px-2" : ""} text-white hover:bg-gray-800`}
          >
            <ChevronLeft className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Zurück</span>}
          </Button>
        </Link>
        <h2 className={`${isMobile ? "text-md" : "text-xl"} font-semibold ml-2 text-white`}>
          {sessionTitle}
        </h2>
      </div>
    </div>
  );
}
