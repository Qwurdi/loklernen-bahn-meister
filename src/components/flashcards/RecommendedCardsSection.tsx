
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RecommendedCardsSectionProps {
  user: any;
}

export default function RecommendedCardsSection({ user }: RecommendedCardsSectionProps) {
  if (!user) {
    return null;
  }
  
  return (
    <div className="mt-8 text-center">
      <p className="mb-2 text-muted-foreground">
        Direkt mit dem Lernen anfangen? Wir empfehlen dir die fälligen Karten.
      </p>
      <Link to="/karteikarten/lernen">
        <Button className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
          Empfohlene Karten lernen
        </Button>
      </Link>
    </div>
  );
}
