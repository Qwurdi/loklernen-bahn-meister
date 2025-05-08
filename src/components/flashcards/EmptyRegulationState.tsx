import React from "react";
import { RegulationFilterType } from "@/types/regulation"; // Added

// Added props to accept the current regulation filter
interface EmptyRegulationStateProps {
  regulation?: RegulationFilterType;
}

const EmptyRegulationState: React.FC<EmptyRegulationStateProps> = ({ regulation }) => {
  let message = "Keine Kategorien für das ausgewählte Regelwerk verfügbar.";
  if (regulation && regulation !== "all") {
    message = `Keine Kategorien für das Regelwerk "${regulation.toUpperCase()}" verfügbar. Bitte wähle ein anderes Regelwerk oder "Alle anzeigen".`;
  } else if (regulation === "all") {
    // This case might not be hit if filterCategoriesByRegulation always returns something for "all"
    // or if the parent component doesn't render this for "all" when categories exist.
    message = "Keine Kategorien verfügbar. Möglicherweise müssen diese noch erstellt werden.";
  }

  return (
    <div className="text-center py-8 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default EmptyRegulationState;
