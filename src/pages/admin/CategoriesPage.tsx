
import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { initializeDefaultCategories } from "@/api/categories";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CategoryPageHeader from "@/components/admin/categories/CategoryPageHeader";
import CategoryTabs from "@/components/admin/categories/CategoryTabs";
import CategoryEmptyStateView from "@/components/admin/categories/CategoryEmptyStateView";
import CategoryErrorState from "@/components/admin/categories/CategoryErrorState";

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

  const handleTabChange = (value: string) => {
    setActiveTab(value as "signal" | "betriebsdienst");
  };

  const signalCategories = categoriesByParent('Signale');
  const betriebsdienstCategories = categoriesByParent('Betriebsdienst');
  const isEmpty = !categories || categories.length === 0;

  return (
    <div className="space-y-6 pb-10">
      <CategoryPageHeader 
        isEmpty={isEmpty}
        isInitializing={initializeMutation.isPending}
        showHelp={showHelp}
        onInitialize={handleInitializeCategories}
        onHideHelp={() => setShowHelp(false)}
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <CategoryErrorState />
      ) : isEmpty ? (
        <CategoryEmptyStateView 
          isInitializing={initializeMutation.isPending}
          onInitialize={handleInitializeCategories}
        />
      ) : (
        <CategoryTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          signalCategories={signalCategories}
          betriebsdienstCategories={betriebsdienstCategories}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
