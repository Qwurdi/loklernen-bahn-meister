
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Target, Clock, Brain, ChevronRight } from "lucide-react";

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

export default function FeaturesSection() {
  return (
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

        <SpacedRepetitionChart />
      </div>
    </section>
  );
}

function SpacedRepetitionChart() {
  return (
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
            <Button className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/80 text-white">
              Kostenloses Konto erstellen
            </Button>
          </Link>
          <Link to="/karteikarten">
            <Button variant="outline" className="border-gray-500 bg-gray-800 text-white hover:bg-gray-700">
              Oder direkt kostenlos starten
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
