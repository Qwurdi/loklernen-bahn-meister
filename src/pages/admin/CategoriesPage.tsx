
import React, { useState } from "react";
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
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CategoryList from "@/components/admin/categories/CategoryList";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { initializeDefaultCategories } from "@/api/categories";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

const CategoriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"signal" | "betriebsdienst">("signal");
  const { categories, isLoading, error, categoriesByParent } = useCategories();
  const { user } = useAuth();

  const initializeMutation = useMutation({
    mutationFn: () => user ? initializeDefaultCategories(user.id) : Promise.reject("No user"),
    onSuccess: () => {
      toast.success("Standardkategorien wurden initialisiert");
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
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Kategorien</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kategorieverwaltung</h1>
        {isEmpty && (
          <button 
            onClick={handleInitializeCategories}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={initializeMutation.isPending}
          >
            {initializeMutation.isPending ? "Initialisiere..." : "Standardkategorien initialisieren"}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>
            Beim Laden der Kategorien ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
          </AlertDescription>
        </Alert>
      ) : isEmpty ? (
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Keine Kategorien gefunden</AlertTitle>
          <AlertDescription>
            Es wurden keine Kategorien gefunden. Bitte initialisieren Sie die Standardkategorien oder fügen Sie neue Kategorien hinzu.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs 
          defaultValue="signal" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "signal" | "betriebsdienst")}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="signal" className="relative px-4 py-2">
              Signale
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                {signalCategories.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="betriebsdienst" className="relative px-4 py-2">
              Betriebsdienst
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                {betriebsdienstCategories.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signal" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <CategoryList 
                categories={signalCategories} 
                parentCategory="Signale" 
              />
              <CategoryForm parentCategory="Signale" />
            </div>
          </TabsContent>

          <TabsContent value="betriebsdienst" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <CategoryList 
                categories={betriebsdienstCategories} 
                parentCategory="Betriebsdienst" 
              />
              <CategoryForm parentCategory="Betriebsdienst" />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CategoriesPage;
