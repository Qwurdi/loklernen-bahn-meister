
import React from "react";

const EmptyRegulationState: React.FC = () => {
  return (
    <div className="text-center py-8 px-4 border border-gray-200 rounded-lg bg-white">
      <p className="text-gray-600">Keine Kategorien für das ausgewählte Regelwerk verfügbar.</p>
    </div>
  );
};

export default EmptyRegulationState;
