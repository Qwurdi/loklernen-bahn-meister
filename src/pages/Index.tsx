
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Award, Target, Clock, Brain } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/common/CategoryCard";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";

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
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    <span className="text-black">Lok</span>
                    <span className="text-loklernen-ultramarine">Lernen</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Deine smarte Lern-App für Signale und Bahnbetrieb. Perfekt für angehende Triebfahrzeugführer.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/karteikarten">
                    <Button size="lg" className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
                      Jetzt starten
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline">
                      Mehr erfahren
                    </Button>
                  </Link>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-loklernen-ultramarine" />
                    <span className="text-sm text-gray-500">Über 500 Fragen zu Signalen & Betriebsdienst</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-loklernen-ultramarine" />
                    <span className="text-sm text-gray-500">Kostenlose Signalkurse ohne Anmeldung</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-loklernen-ultramarine" />
                    <span className="text-sm text-gray-500">Perfekt für die Ausbildung & Prüfungsvorbereitung</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-full bg-loklernen-sapphire/10 p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="https://placehold.co/300x300/0F52BA/FFFFFF?text=LokLernen" 
                      alt="LokLernen App" 
                      className="h-[280px] w-[280px] rounded-3xl shadow-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kategorien */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Unsere Kurskategorien
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Wähle eine Kategorie und starte dein Training
              </p>
            </div>
            
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Signale</h3>
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
                  <CategoryCard
                    title="Rangiersignale"
                    description="Sh und Ra Signale für das Rangieren."
                    progress={0}
                    link="/karteikarten/signale/rangiersignale"
                  />
                  <CategoryCard
                    title="Sonstige Signale"
                    description="Lf-, El-, und So-Tafeln."
                    progress={0}
                    link="/karteikarten/signale/sonstige"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Betriebsdienst</h3>
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
                  <CategoryCard
                    title="Züge fahren"
                    description="Von der Abfahrt bis zur Ankunft."
                    progress={0}
                    link="/karteikarten/betriebsdienst/zuege-fahren"
                    isPro
                    isLocked
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/40 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Warum LokLernen?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Unsere App bietet dir alles, was du für deine Ausbildung brauchst
              </p>
            </div>
            
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-3 rounded-lg border bg-card p-6 text-center shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Bereit zum Lernen?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Starte jetzt mit den Signalkursen - kostenlos und ohne Anmeldung
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/karteikarten">
                  <Button size="lg" className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
                    Mit Signalen starten
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline">
                    Konto erstellen
                  </Button>
                </Link>
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
