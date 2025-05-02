
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Award, Target, Clock, Brain, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/common/CategoryCard";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { motion } from "framer-motion";

// Importiere die neu erstellten Komponenten
import DemoMCQuestion from "@/components/common/DemoMCQuestion";
import AccessTierCard from "@/components/common/AccessTierCard";
import SpacedRepetitionTooltip from "@/components/flashcards/stack/SpacedRepetitionTooltip";

const features = [
  {
    icon: <Brain className="h-6 w-6 text-loklernen-ultramarine" />,
    title: "Wissenschaftlich fundiertes Lernkonzept",
    description: "Basierend auf Spaced Repetition für langfristiges Behalten."
  },
  {
    icon: <Award className="h-6 w-6 text-loklernen-ultramarine" />,
    title: "Gamification und Motivation",
    description: "XP, Abzeichen und Level-Ups motivieren dich zum Weitermachen."
  },
  {
    icon: <Target className="h-6 w-6 text-loklernen-ultramarine" />,
    title: "Fokussiertes Training",
    description: "Gezielter Aufbau von Signalwissen und Betriebsdienst-Kenntnissen."
  },
  {
    icon: <Clock className="h-6 w-6 text-loklernen-ultramarine" />,
    title: "Lernen in kleinen Einheiten",
    description: "Perfekt für zwischendurch - auf jedem Gerät."
  }
];

export default function Index() {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with Black Background */}
        <section className="relative overflow-hidden bg-black text-white py-12 md:py-24 border-b border-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    <span className="text-white">Lok</span>
                    <span className="text-loklernen-ultramarine">Lernen</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-300 md:text-xl">
                    Deine smarte Lern-App für Signale und Bahnbetrieb. Perfekt für angehende Triebfahrzeugführer.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-loklernen-ultramarine" />
                    <span className="text-sm text-gray-300">Über 500 Fragen zu Signalen & Betriebsdienst</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-loklernen-ultramarine" />
                    <span className="text-sm text-gray-300">Kostenlose Signalkurse ohne Anmeldung</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-loklernen-ultramarine" />
                    <span className="text-sm text-gray-300">Perfekt für die Ausbildung & Prüfungsvorbereitung</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex items-center justify-center">
                <DemoMCQuestion />
              </div>
            </div>
          </div>
        </section>

        {/* Zugangsstufen */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="space-y-2 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Wähle deine Lernmethode
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
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
                buttonLink="/karteikarten/signale/haupt-vorsignale"
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

        {/* Kategorien mit visuellem Lernpfad */}
        <section className="py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="space-y-2 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Dein Lernweg zum Triebfahrzeugführer
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Schritt für Schritt zum Expertenwissen
              </p>
            </div>
            
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Signale <span className="text-sm font-normal text-green-600">(Kostenlos)</span></h3>
                <div className="grid gap-4">
                  <CategoryCard
                    title="Haupt- und Vorsignale"
                    description="Lerne die grundlegenden Signale kennen."
                    progress={0}
                    link="/karteikarten/signale/haupt-vorsignale"
                  />
                  <CategoryCard
                    title="Zusatz- & Kennzeichen"
                    description="Zs, Ne, Bü, Ra und mehr."
                    progress={0}
                    link="/karteikarten/signale/zusatz-kennzeichen"
                  />
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="relative"
                  >
                    <CategoryCard
                      title="Rangiersignale"
                      description="Sh und Ra Signale für das Rangieren."
                      progress={0}
                      link="/karteikarten/signale/rangiersignale"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm">
                      <div className="text-center p-4">
                        <p className="text-white font-bold mb-2">Mit Anmeldung: Speichere deinen Fortschritt</p>
                        <Link to="/register">
                          <Button size="sm" className="bg-loklernen-ultramarine">
                            Jetzt anmelden <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                  <CategoryCard
                    title="Sonstige Signale"
                    description="Lf-, El-, und So-Tafeln."
                    progress={0}
                    link="/karteikarten/signale/sonstige"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Betriebsdienst <span className="text-sm font-normal text-amber-600">(Premium)</span></h3>
                <div className="grid gap-4">
                  <CategoryCard
                    title="Grundlagen Bahnbetrieb"
                    description="Einstieg in den Bahnbetrieb."
                    progress={0}
                    link="/karteikarten/betriebsdienst/grundlagen"
                    isLocked
                  />
                  <CategoryCard
                    title="UVV & Arbeitsschutz"
                    description="Sicherheit am Arbeitsplatz."
                    progress={0}
                    link="/karteikarten/betriebsdienst/uvv"
                    isLocked
                  />
                  <CategoryCard
                    title="Rangieren"
                    description="Alles zum Thema Rangieren."
                    progress={0}
                    link="/karteikarten/betriebsdienst/rangieren"
                    isPro
                    isLocked
                  />
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="relative"
                  >
                    <CategoryCard
                      title="Züge fahren"
                      description="Von der Abfahrt bis zur Ankunft."
                      progress={0}
                      link="/karteikarten/betriebsdienst/zuege-fahren"
                      isPro
                      isLocked
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/70 backdrop-blur-sm">
                      <div className="text-center p-4">
                        <div className="bg-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold inline-block mb-2">PREMIUM</div>
                        <p className="text-white font-bold mb-2">Schalte alle Betriebsdienstkurse frei</p>
                        <Link to="/register">
                          <Button size="sm" className="bg-amber-500 text-black hover:bg-amber-600">
                            Premium aktivieren <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features mit schwarzem Hintergrund */}
        <section className="bg-black text-white py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Warum LokLernen?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                Unsere App bietet dir alles, was du für deine Ausbildung brauchst
              </p>
            </div>
            
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-3 rounded-lg border border-gray-800 bg-gray-900 p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <div className="max-w-2xl">
                <h3 className="text-2xl font-bold mb-6">Spaced Repetition System</h3>
                
                <div className="relative py-8">
                  {/* Spaced Repetition Graph */}
                  <div className="flex justify-between items-end h-32 mb-4">
                    <div className="relative">
                      <div className="h-16 w-6 bg-red-500 rounded-t-md"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <p className="text-xs text-gray-400">Tag 1</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="h-24 w-6 bg-amber-500 rounded-t-md"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <p className="text-xs text-gray-400">Tag 3</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="h-28 w-6 bg-yellow-500 rounded-t-md"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <p className="text-xs text-gray-400">Tag 7</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="h-32 w-6 bg-green-500 rounded-t-md"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <p className="text-xs text-gray-400">Tag 14</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="h-32 w-6 bg-green-600 rounded-t-md"></div>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <p className="text-xs text-gray-400">Tag 30</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-2">
                    <p className="text-sm text-gray-400">Langzeitgedächtnis-Kurve mit Spaced Repetition</p>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6">
                  Mit unserem Spaced-Repetition-System lernst du genau die Karten, die du am meisten üben musst, 
                  genau zum richtigen Zeitpunkt. Dein Wissen bleibt langfristig im Gedächtnis.
                </p>
                
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link to="/register">
                    <Button className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
                      Kostenloses Konto erstellen
                    </Button>
                  </Link>
                  <Link to="/karteikarten">
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      Oder direkt kostenlos starten
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {!isMobile && <Footer />}
      {isMobile && <BottomNavigation />}
    </div>
  );
}
