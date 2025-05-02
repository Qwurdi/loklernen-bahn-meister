
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import CategoryCard from "@/components/common/CategoryCard";
import { motion } from "framer-motion";

export default function LearningPathSection() {
  return (
    <section className="py-12 md:py-24 bg-black text-white">
      <div className="container px-4 md:px-6">
        <div className="space-y-2 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Dein Lernweg zum Triebfahrzeugführer
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
            Schritt für Schritt zum Expertenwissen
          </p>
        </div>
        
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Signale <span className="text-sm font-normal text-green-500">
              (Kostenlos)</span></h3>
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
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/70 backdrop-blur-sm">
                  <div className="text-center p-4">
                    <p className="text-white font-bold mb-2">Mit Anmeldung: Speichere deinen Fortschritt</p>
                    <Link to="/register">
                      <Button size="sm" className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/80">
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
            <h3 className="text-xl font-bold">Betriebsdienst <span className="text-sm font-normal text-amber-500">
              (Premium)</span></h3>
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
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm">
                  <div className="text-center p-4">
                    <div className="bg-amber-500 text-black text-xs px-2 py-1 rounded-full font-bold inline-block mb-2">
                      PREMIUM
                    </div>
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
  );
}
