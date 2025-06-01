
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-display-large mb-4 bg-gradient-ultramarine bg-clip-text text-transparent">
          LokLernen 2.0
        </h1>
        <p className="text-headline-medium text-gray-600 mb-8 max-w-2xl mx-auto">
          Die moderne Lernplattform für angehende Triebfahrzeugführer*innen
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild className="bg-gradient-ultramarine">
            <Link to="/karteikarten">
              Jetzt lernen
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/register">
              Kostenlos registrieren
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="text-title-large">🚂 Signale lernen</CardTitle>
            <CardDescription>
              Alle wichtigen Eisenbahnsignale mit visuellen Beispielen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body-large text-gray-600 mb-4">
              Kostenloser Zugang zu allen Signal-Kategorien mit offenen Fragen 
              für aktiven Recall.
            </p>
            <Button variant="link" asChild className="p-0">
              <Link to="/karteikarten?category=Signale">
                Signale erkunden →
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="material-card">
          <CardHeader>
            <CardTitle className="text-title-large">⚙️ Betriebsdienst</CardTitle>
            <CardDescription>
              Umfassendes Wissen für den Bahnbetrieb
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body-large text-gray-600 mb-4">
              Grundlagen kostenlos verfügbar, erweiterte Inhalte mit Pro-Zugang.
            </p>
            <Button variant="link" asChild className="p-0">
              <Link to="/karteikarten?category=Betriebsdienst">
                Betrieb lernen →
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Material Design Demo */}
      <section className="text-center py-8">
        <h2 className="text-headline-large mb-4">Material Design Expressive</h2>
        <p className="text-body-large text-gray-600 mb-6">
          LokLernen 2.0 nutzt moderne Design-Prinzipien für eine intuitive Lernerfahrung
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <div className="bg-gradient-ultramarine text-white px-6 py-3 rounded-lg">
            Ultramarine
          </div>
          <div className="bg-gradient-sapphire text-white px-6 py-3 rounded-lg">
            Sapphire
          </div>
          <div className="surface-elevated px-6 py-3 rounded-lg">
            Elevated Surface
          </div>
        </div>
      </section>
    </div>
  );
}
