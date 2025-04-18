
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCard from "@/components/common/CategoryCard";

export default function SignalePage() {
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
            <h1 className="text-2xl font-bold">Signale</h1>
          </div>
          
          <p className="mb-8 text-gray-500 max-w-2xl">
            Lerne die wichtigsten Signale der Eisenbahn kennen. Diese Kategorie ist kostenlos und ohne Anmeldung zugänglich. 
            Wähle einen Signaltyp, um mit dem Lernen zu beginnen.
          </p>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <CategoryCard
              title="Haupt- und Vorsignale"
              description="Die wichtigsten Signale im Bahnbetrieb."
              progress={0}
              link="/signale/haupt-vorsignale"
            />
            <CategoryCard
              title="Zusatz- & Kennzeichen"
              description="Zs, Ne, Bü, Ra und mehr."
              progress={0}
              link="/signale/zusatz-kennzeichen"
            />
            <CategoryCard
              title="Rangiersignale"
              description="Sh und Ra Signale für das Rangieren."
              progress={0}
              link="/signale/rangiersignale"
            />
            <CategoryCard
              title="Sonstige Signale"
              description="Lf-, El-, und So-Tafeln."
              progress={0}
              link="/signale/sonstige"
            />
          </div>
          
          <div className="mt-12 rounded-lg border bg-blue-50 p-6">
            <h2 className="text-lg font-medium text-loklernen-sapphire mb-2">Warum Signale wichtig sind</h2>
            <p className="mb-4 text-gray-600">
              Signale sind die Sprache der Eisenbahn. Sie regeln den Bahnverkehr und sorgen für Sicherheit. 
              Als Triebfahrzeugführer*in musst du alle Signale sofort erkennen und richtig interpretieren können.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/signale/haupt-vorsignale">
                <Button className="bg-loklernen-sapphire hover:bg-loklernen-sapphire/90">
                  Jetzt mit Haupt- und Vorsignalen starten
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">
                  Fortschritt speichern (Registrieren)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
