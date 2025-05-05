
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Tags, RefreshCw, Loader2 } from "lucide-react";

interface CategoryEmptyStateViewProps {
  isInitializing: boolean;
  onInitialize: () => void;
}

const CategoryEmptyStateView: React.FC<CategoryEmptyStateViewProps> = ({ 
  isInitializing,
  onInitialize 
}) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <Info className="h-5 w-5" />
        <AlertTitle>Keine Kategorien gefunden</AlertTitle>
        <AlertDescription>
          Es wurden keine Kategorien gefunden. Bitte initialisieren Sie die Standardkategorien oder fügen Sie neue Kategorien hinzu.
        </AlertDescription>
      </Alert>
      
      <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <Tags className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700">Kategorien sind wichtig für die Organisation</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Kategorien helfen dabei, Fragen zu organisieren und den Schülern eine strukturierte Lernumgebung zu bieten.
            </p>
            <Button 
              onClick={onInitialize}
              className="mt-2"
              variant="outline"
              disabled={isInitializing}
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird initialisiert...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Standardkategorien laden
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryEmptyStateView;
