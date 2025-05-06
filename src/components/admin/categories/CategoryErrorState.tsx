
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CategoryErrorState: React.FC = () => {
  return (
    <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Fehler beim Laden der Kategorien</AlertTitle>
      <AlertDescription>
        Beim Laden der Kategorien ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder wenden Sie sich an den Support.
      </AlertDescription>
    </Alert>
  );
};

export default CategoryErrorState;
