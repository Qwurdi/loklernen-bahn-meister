
import React from "react";
import { Folder } from "lucide-react";

const CategoryEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-500">
      <Folder className="h-12 w-12 mb-3 text-gray-400" />
      <p className="text-lg font-medium">Keine Kategorien gefunden</p>
      <p className="mt-1 text-sm text-gray-400">
        Fügen Sie neue Kategorien hinzu, um Ihre Fragen zu organisieren
      </p>
    </div>
  );
};

export default CategoryEmptyState;
