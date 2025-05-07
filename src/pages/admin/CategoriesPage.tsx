import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CategoryList from "@/components/admin/categories/CategoryList";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { initializeDefaultCategories } from "@/api/categories/index";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  AlertCircle, 
  Database, 
  Loader2, 
  Tags, 
  ChevronRight,
  RefreshCw,
  Info
} from "lucide-react";

const CategoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signal" | "betriebsdienst">("signal");
  const { categories, isLoading, error, categoriesByParent } = useCategories();
  const { user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Show help tooltip after a short delay
    const timer = setTimeout(() => setShowHelp(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Hide help tooltip after some time
    if (showHelp) {
      const timer = setTimeout(() => setShowHelp(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showHelp]);

  const initializeMutation = useMutation({
    mutationFn: () => user ? initializeDefaultCategories(user.id) : Promise.reject("No user"),
    onSuccess: () => {
      toast.success("Standardkategorien wurden erfolgreich initialisiert", {
        description: "Die Standard-Kategorien wurden in die Datenbank geladen."
      });
      window.location.reload(); // Reload to show new categories
    },
    onError: (error) => {
      toast.error(`Fehler beim Initialisieren der Kategorien: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  });

  const handleInitializeCategories = () => {
    if (window.confirm("Möchten Sie die Standardkategorien initialisieren? Dies hat keine Auswirkungen auf bestehende Kategorien.")) {
      initializeMutation.mutate();
    }
  };

  const signalCategories = categoriesByParent('Signale');
  const betriebsdienstCategories = categoriesByParent('Betriebsdienst');
  const isEmpty = !categories || categories.length === 0;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Kategorieverwaltung</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isEmpty && (
          <Button 
            onClick={handleInitializeCategories}
            className="flex items-center bg-gradient-to-r from-loklernen-ultramarine to-loklernen-sapphire text-white"
            disabled={initializeMutation.isPending}
          >
            {initializeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initialisiere...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Standardkategorien initialisieren
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Tags className="h-8 w-8" />
          Kategorieverwaltung
        </h1>
        
        {showHelp && !isEmpty && (
          <div className="relative">
            <div className="absolute -top-12 right-0 w-64 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800 shadow-lg animate-fade-in-up">
              <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  Wechseln Sie zwischen Signal- und Betriebsdienst-Kategorien mit den Tabs
                  <button 
                    className="absolute top-1 right-1 text-blue-500 hover:text-blue-700"
                    onClick={() => setShowHelp(false)}
                  >
                    <span className="text-xs">×</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler beim Laden der Kategorien</AlertTitle>
          <AlertDescription>
            Beim Laden der Kategorien ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder wenden Sie sich an den Support.
          </AlertDescription>
        </Alert>
      ) : isEmpty ? (
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
                  onClick={handleInitializeCategories}
                  className="mt-2"
                  variant="outline"
                  disabled={initializeMutation.isPending}
                >
                  {initializeMutation.isPending ? (
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
      ) : (
        <Tabs 
          defaultValue="signal" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "signal" | "betriebsdienst")}
          className="space-y-6"
        >
          <TabsList className="w-full sm:w-auto bg-white border border-gray-200 p-1">
            <TabsTrigger 
              value="signal" 
              className="relative px-4 py-2 data-[state=active]:bg-loklernen-ultramarine/10 data-[state=active]:text-loklernen-ultramarine"
            >
              <span className="flex items-center gap-2">
                Signale
                <span className="rounded-full bg-loklernen-ultramarine/10 px-2 py-0.5 text-xs text-loklernen-ultramarine">
                  {signalCategories.length}
                </span>
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="betriebsdienst" 
              className="relative px-4 py-2 data-[state=active]:bg-loklernen-betriebsdienst/10 data-[state=active]:text-loklernen-betriebsdienst"
            >
              <span className="flex items-center gap-2">
                Betriebsdienst
                <span className="rounded-full bg-loklernen-betriebsdienst/10 px-2 py-0.5 text-xs text-loklernen-betriebsdienst">
                  {betriebsdienstCategories.length}
                </span>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signal" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CategoryList 
                  categories={signalCategories} 
                  parentCategory="Signale" 
                />
              </div>
              <div>
                <CategoryForm parentCategory="Signale" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="betriebsdienst" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CategoryList 
                  categories={betriebsdienstCategories} 
                  parentCategory="Betriebsdienst" 
                />
              </div>
              <div>
                <CategoryForm parentCategory="Betriebsdienst" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CategoriesPage;
