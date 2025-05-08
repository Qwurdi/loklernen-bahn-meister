import React from "react";
import AccessTierCard from "@/components/common/AccessTierCard";
import SpacedRepetitionTooltip from "@/components/flashcards/stack/SpacedRepetitionTooltip";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/api/categories/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Helper function to get a sample of category names
const getSampleCategoryNames = (categories: Category[], count: number): string[] => {
  return categories.slice(0, count).map(cat => cat.name);
};

// Helper function to generate a link to the first suitable category
const getFirstCategoryLink = (categories: Category[]): string | undefined => {
  if (categories.length > 0) {
    return `/karteikarten/lernen?category=${encodeURIComponent(categories[0].id)}`;
  }
  return undefined;
};

export default function AccessTiersSection() {
  const { categories: allCategories, isLoading, error } = useCategories();
  const { user } = useAuth();

  if (isLoading) {
    // You might want a more sophisticated loading state here
    return (
      <section className="py-12 md:py-24 bg-gray-900">
        <div className="container px-4 md:px-6 text-center text-white">
          <p>Lade Lernoptionen...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-24 bg-gray-900">
        <div className="container px-4 md:px-6 text-center text-red-400">
          <p>Fehler beim Laden der Lernoptionen: {error.message}</p>
        </div>
      </section>
    );
  }

  const freeCategories = allCategories.filter(cat => !cat.isPro && !cat.requiresAuth && !cat.isPlanned);
  const authRequiredBasicCategories = allCategories.filter(cat => !cat.isPro && cat.requiresAuth && !cat.isPlanned);
  const proCategories = allCategories.filter(cat => cat.isPro && !cat.isPlanned);

  const freeFeatures = [
    ...getSampleCategoryNames(freeCategories, 2), // Get 2 sample free categories
    "Grundlegende Signale & Konzepte",
    "Ohne Anmeldung direkt loslegen",
  ];
  if (freeCategories.length === 0) {
    freeFeatures.splice(0, freeFeatures.length, "Aktuell keine kostenlosen Kategorien verfügbar.");
  }

  const authFeatures = [
    "Personalisiertes Lernen mit Spaced Repetition",
    "Lernfortschritt speichern",
    ...getSampleCategoryNames(authRequiredBasicCategories, 2), // Get 2 sample auth-required categories
  ];
  if (authRequiredBasicCategories.length === 0 && freeCategories.length > 0) {
    authFeatures.splice(2, authFeatures.length -2, "Weitere kostenlose Inhalte nach Anmeldung.");
  } else if (authRequiredBasicCategories.length === 0 && freeCategories.length === 0){
    authFeatures.splice(2, authFeatures.length -2, "Aktuell keine zusätzlichen kostenlosen Kategorien nach Anmeldung.");
  }

  const proFeatures = [
    "Alle verfügbaren Kategorien & Kurse",
    ...getSampleCategoryNames(proCategories, 2), // Get 2 sample pro categories
    "Vollständiger Zugriff auf alle Lerninhalte",
    "Priorisierter Support",
  ];
  if (proCategories.length === 0) {
    proFeatures.splice(1, proFeatures.length -1, "Aktuell keine exklusiven Premium-Kategorien verfügbar.");
  }
  
  const freeLink = getFirstCategoryLink(freeCategories) || "/karteikarten"; // Fallback to general cards page

  return (
    <section className="py-12 md:py-24 bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="space-y-2 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
            Wähle deine Lernmethode
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
            Von kostenlosen Signalkursen bis zum vollständigen Profipaket
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <AccessTierCard
            title="Kostenlos starten"
            features={freeFeatures}
            buttonLabel={freeCategories.length > 0 ? "Jetzt lernen" : "Entdecken"}
            buttonLink={freeLink}
          />
          
          <SpacedRepetitionTooltip message="Mit unserem Spaced-Repetition-System lernst du effektiver und behältst Wissen langfristig. Dein persönlicher Lernfortschritt wird gespeichert und optimiert.">
            <div className="h-full">
              <AccessTierCard
                title="Mit Anmeldung"
                features={authFeatures}
                buttonLabel={user ? "Zum Dashboard" : "Konto erstellen"}
                buttonLink={user ? "/dashboard" : "/register"}
                isPrimary={true}
                requiresLogin={true}
              />
            </div>
          </SpacedRepetitionTooltip>
          
          <AccessTierCard
            title="Premium"
            features={proFeatures}
            buttonLabel={user?.user_metadata?.is_pro_member ? "Alle Kurse ansehen" : "Premium freischalten"}
            buttonLink={user?.user_metadata?.is_pro_member ? "/karteikarten" : "/register"}
            isPremium={true}
            requiresLogin={true}
          />
        </div>
      </div>
    </section>
  );
}
