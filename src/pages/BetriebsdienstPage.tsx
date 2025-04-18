
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Lock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/common/CategoryCard";

export default function BetriebsdienstPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="flex items-center gap-2 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Betriebsdienst</h1>
          </div>
          
          <p className="mb-8 text-gray-500 max-w-2xl">
            Lerne alles zum Bahnbetrieb - von den Grundlagen bis zu komplexen Betriebssituationen. 
            Einige Kurse sind nach der Anmeldung kostenlos verfügbar, Pro-Kurse erfordern ein Abonnement.
          </p>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <CategoryCard
              title="Grundlagen Bahnbetrieb"
              description="Einstieg in den Bahnbetrieb."
              progress={0}
              link="/betriebsdienst/grundlagen"
              isLocked
            />
            <CategoryCard
              title="UVV & Arbeitsschutz"
              description="Sicherheit am Arbeitsplatz."
              progress={0}
              link="/betriebsdienst/uvv"
              isLocked
            />
            <CategoryCard
              title="Rangieren"
              description="Alles zum Thema Rangieren."
              progress={0}
              link="/betriebsdienst/rangieren"
              isPro
              isLocked
            />
            <CategoryCard
              title="Züge fahren"
              description="Von der Abfahrt bis zur Ankunft."
              progress={0}
              link="/betriebsdienst/zuege-fahren"
              isPro
              isLocked
            />
            <CategoryCard
              title="PZB & Sicherungsanlagen"
              description="PZB, LZB und mehr."
              progress={0}
              link="/betriebsdienst/pzb"
              isPro
              isLocked
            />
            <CategoryCard
              title="Kommunikation"
              description="Kommunikation im Bahnbetrieb."
              progress={0}
              link="/betriebsdienst/kommunikation"
              isPro
              isLocked
            />
            <CategoryCard
              title="Besonderheiten"
              description="Besonderheiten im Bahnbetrieb."
              progress={0}
              link="/betriebsdienst/besonderheiten"
              isPro
              isLocked
            />
            <CategoryCard
              title="Unregelmäßigkeiten"
              description="Technische und betriebliche Unregelmäßigkeiten."
              progress={0}
              link="/betriebsdienst/unregelmaessigkeiten"
              isPro
              isLocked
            />
          </div>
          
          <div className="mt-12 rounded-lg border bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Lock className="h-6 w-6 text-loklernen-sapphire" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-loklernen-sapphire mb-2">Zugang zum Betriebsdienst-Bereich</h2>
                <p className="mb-4 text-gray-600">
                  Um auf die Betriebsdienst-Kurse zugreifen zu können, musst du dich registrieren. 
                  Die Grundlagen-Kurse sind nach der Anmeldung kostenlos verfügbar. Für alle Pro-Kurse benötigst du ein Abonnement.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link to="/register">
                    <Button className="bg-loklernen-sapphire hover:bg-loklernen-sapphire/90">
                      Jetzt registrieren
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline">
                      Anmelden
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
