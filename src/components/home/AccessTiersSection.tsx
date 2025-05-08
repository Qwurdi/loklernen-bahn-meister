import React from "react";
import AccessTierCard from "@/components/common/AccessTierCard";
import SpacedRepetitionTooltip from "@/components/flashcards/stack/SpacedRepetitionTooltip";

export default function AccessTiersSection() {
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
            features={[
              "Signale lernen ohne Anmeldung",
              "Haupt- und Vorsignale",
              "Zusatzsignale und Kennzeichen",
              "Sofort verfügbar"
            ]}
            buttonLabel="Jetzt lernen"
            buttonLink="/karteikarten/lernen?category=Signale"
          />
          
          <SpacedRepetitionTooltip message="Mit unserem Spaced-Repetition-System lernst du effektiver und behältst Wissen langfristig. Dein persönlicher Lernfortschritt wird gespeichert und optimiert.">
            <div className="h-full">
              <AccessTierCard
                title="Mit Anmeldung"
                features={[
                  "Personalisiertes Lernen mit Spaced Repetition",
                  "Lernfortschritt speichern",
                  "Grundlagen des Bahnbetriebs",
                  "UVV & Arbeitsschutz"
                ]}
                buttonLabel="Konto erstellen"
                buttonLink="/register"
                isPrimary={true}
                requiresLogin={true}
              />
            </div>
          </SpacedRepetitionTooltip>
          
          <AccessTierCard
            title="Premium"
            features={[
              "Alle Betriebsdienstkurse",
              "Züge fahren & Rangieren",
              "PZB & Sicherungsanlagen",
              "Priorisierter Support"
            ]}
            buttonLabel="Premium freischalten"
            buttonLink="/register"
            isPremium={true}
            requiresLogin={true}
          />
        </div>
      </div>
    </section>
  );
}
