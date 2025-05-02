
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import DemoMCQuestion from "@/components/common/DemoMCQuestion";

export default function HeroSection() {
  return (
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
  );
}
