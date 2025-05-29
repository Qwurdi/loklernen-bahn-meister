
# LokLernen - Dokumentation

## 1. Projektüberblick

### Zweck und Ziele
LokLernen ist eine mobile Begleiter-App im Duolingo/Fahrschule-Stil, die (angehende) Triebfahrzeugführer*innen mit Gamification und einem wissenschaftlich fundierten Spaced-Repetition-System zum nachhaltigen Bahnwissen führt. Die App bietet eine benutzerfreundliche Oberfläche, die das Lernen von Bahnbetriebssignalen und -vorschriften erleichtert und durch spielerische Elemente motivierend gestaltet.

### Zielgruppe
- Angehende Triebfahrzeugführer*innen in der Ausbildung
- Berufstätige Triebfahrzeugführer*innen zur Auffrischung des Wissens
- Bahninteressierte, die ihr Fachwissen vertiefen möchten

### Kernfunktionalität
- Karteikartensystem mit Spaced-Repetition-Algorithmus
- Kategorisierte Lernbereiche für Signale und Betriebsdienst
- Unterstützung verschiedener Regelwerke (DS 301, DB-Ril 301)
- Fortschrittsverfolgung und Gamification-Elemente
- Freemium-Modell mit kostenlosen und Pro-Inhalten

## 2. Funktionsdokumentation

### Authentifizierungssystem
- Benutzerregistrierung und -anmeldung über Supabase Authentication
- Profilmanagement mit Benutzerpräferenzen
- Zugriffssteuerung für kostenlose vs. Premium-Inhalte

### Kategorienverwaltung
- Zwei Hauptkategorien: Signale und Betriebsdienst
- Signalkategorien sind frei zugänglich, auch ohne Anmeldung
- Betriebsdienst-Grundlagen sind nach Login kostenlos verfügbar
- Fortgeschrittene Betriebsdienst-Kategorien sind Pro-Inhalte
- Kennzeichnung geplanter, noch nicht verfügbarer Kategorien (`isPlanned: true`)

### Karteikartensystem
- Offene Fragen für Signal-Kategorien zur Förderung des aktiven Abrufs
- Multiple-Choice-Fragen für Betriebsdienst-Kategorien
- Bildunterstützung für visuelle Lerninhalte
- Regelwerk-spezifische Filterung (DS 301, DB-Ril 301, Beide)

### Spaced-Repetition-Lernsystem
- SM-2-basierter Algorithmus für optimale Wiederholungsintervalle
- Adaptive Intervalle basierend auf der Selbstbewertung des Lernenden:
  - Intervallstart: 1 Tag → 6 Tage, dann multiplikativ (× ≈ 2–2,5)
  - Bewertungsskala 0–5 mit entsprechenden Faktoren
  - Fehlerkarten erscheinen am selben Tag erneut
  - Sichere Karten können bis zu 12 Monate pausieren
- Lernboxen-System zur Visualisierung des Fortschritts (Leitner-Box-Prinzip)

### Regelwerk-Präferenzen
- Filterung der Inhalte nach Regelwerk: DS 301, DB-Ril 301 oder beide
- Persistente Benutzereinstellungen für Regelwerk-Präferenzen
- Kategoriefilterfunktion basierend auf Regelwerk-Kompatibilität

### Pro vs. kostenlose Inhalte
- Kostenloser Zugang zu allen Signal-Kategorien
- Kostenloser Zugang zu Grundlagen des Bahnbetriebs nach Anmeldung
- Pro-Inhalte für fortgeschrittene Betriebsdienst-Themen
- Markierung von Pro-Kategorien in der Benutzeroberfläche

### Geplante Kategorien
- Kennzeichnung zukünftiger Inhalte als "Demnächst verfügbar"
- Sichtbarkeit in der Kategorie-Übersicht mit spezieller Markierung
- Datenbankunterstützung durch das Attribut `isPlanned`

## 3. Technische Architektur

### Projektstruktur
- React/TypeScript Single Page Application (SPA)
- Vite als Build-Tool
- Tailwind CSS für Styling
- Shadcn UI für Komponenten-Bibliothek
- Supabase für Backend-Services (Auth, Datenbank, Storage)

### Komponentenhierarchie
- Layout-Komponenten für konsistente UI-Struktur
- Funktionale Komponenten für spezifische Bereiche (Flashcards, Dashboard, etc.)
- Wiederverwendbare UI-Komponenten (CategoryCard, FlashcardItem, etc.)
- Mobile-First-Design mit responsiver Anpassung

### State-Management
- React Context für globalen State (Auth, Benutzereinstellungen)
- React Query für serverseitigen State und Caching
- Lokaler Komponenten-State für UI-spezifische Zustände
- Persistenz wichtiger Einstellungen im localStorage und Supabase

### Supabase-Integration
- Authentifizierung und Benutzerverwaltung
- PostgreSQL-Datenbank für alle Anwendungsdaten
- Storage für Frage- und Signalbilder
- Row Level Security (RLS) für Datenzugriffsschutz

## 4. Datenbankstruktur

### Tabellen und Beziehungen

#### categories
- `id`: UUID (PK)
- `name`: Text - Name der Kategorie
- `description`: Text (nullable) - Beschreibung der Kategorie
- `icon`: Text (nullable) - Icon-Name/Pfad
- `color`: Text (nullable) - Farbcode für visuelle Unterscheidung
- `parent_category`: Text - 'Signale' oder 'Betriebsdienst'
- `created_at`: Timestamp - Erstellungszeitpunkt
- `updated_at`: Timestamp - Letzter Aktualisierungszeitpunkt
- `isPro`: Boolean - Kennzeichnet Premium-Inhalte
- `isPlanned`: Boolean - Kennzeichnet geplante, noch nicht verfügbare Inhalte

#### questions
- `id`: UUID (PK)
- `category`: Enum ('Signale', 'Betriebsdienst')
- `sub_category`: Text - Name der Unterkategorie
- `question_type`: Enum ('MC_single', 'MC_multi', 'open')
- `difficulty`: Integer (1-5)
- `text`: Text - Fragetext (kann strukturierten Inhalt als JSON enthalten)
- `image_url`: Text (nullable) - URL zum Fragenbild
- `answers`: JSONB - Array von Antworten mit Text und isCorrect-Flag
- `created_by`: UUID - Ersteller-ID
- `regulation_category`: Text (nullable) - Zuordnung zum Regelwerk
- `hint`: Text (nullable) - Hilfetext zur Frage
- `revision`: Integer - Versionsnummer
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### user_progress
- `id`: UUID (PK)
- `user_id`: UUID - Benutzer-ID
- `question_id`: UUID - Frage-ID (FK → questions.id)
- `box_number`: Integer - Lernbox (1-5)
- `correct_count`: Integer - Anzahl richtiger Antworten
- `incorrect_count`: Integer - Anzahl falscher Antworten
- `last_score`: Integer - Letzte Selbstbewertung (0-5)
- `repetition_count`: Integer - Anzahl der Wiederholungen
- `streak`: Integer - Aktuelle Korrekt-Serie
- `ease_factor`: Numeric - Leichtigkeitsfaktor für SM-2-Algorithmus
- `interval_days`: Integer - Aktuelles Wiederholungsintervall in Tagen
- `last_reviewed_at`: Timestamp - Zeitpunkt der letzten Überprüfung
- `next_review_at`: Timestamp - Berechneter Zeitpunkt für nächste Überprüfung
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### user_stats
- `user_id`: UUID (PK)
- `total_correct`: Integer - Gesamtanzahl korrekter Antworten
- `total_incorrect`: Integer - Gesamtanzahl falscher Antworten
- `signals_mastered`: Integer - Anzahl gemeisterter Signale
- `xp`: Integer - Erfahrungspunkte für Gamification
- `streak_days`: Integer - Tägliche Lernserie
- `last_activity_date`: Date - Letzter Aktivitätstag
- `regulation_preference`: Text (nullable) - Bevorzugtes Regelwerk
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Row-Level Security-Richtlinien
- Benutzer können nur ihre eigenen Fortschrittsdaten sehen und bearbeiten
- Anonym zugängliche Daten für nicht-authentifizierte Benutzer (Signalkategorien)
- Adminbeschränkter Zugriff auf Konfigurationstabellen

## 5. Entwicklungsrichtlinien

### Coding-Standards
- Konsequente Verwendung von TypeScript mit strengen Typdefinitionen
- Funktionale Komponentenstruktur mit Hooks
- Einhaltung der React-Muster für Leistung und Wartbarkeit
- Mobile-First-Design für alle UI-Komponenten

### Testing-Standards
- Vitest als Test-Framework mit standardisierter Konfiguration
- **Ausschließliche Verwendung von Vitest-Globals** - niemals direkte Imports von 'vitest'
- Konsistente Dateinamenskonventionen: `*.test.tsx` oder `*.test.ts`
- Umfassende Test-Setup in `src/test/setup.ts`
- Tests für kritische Geschäftslogik (z.B. Spaced-Repetition-Algorithmus)
- Integration von React Testing Library für Komponententests
- Mockstrategien für externe Abhängigkeiten
- Detaillierte Testrichtlinien in `src/test/README.md`

### Testing-Konfiguration
- Vitest-Konfiguration in `vitest.config.ts` mit Globals aktiviert
- Test-Setup-Datei für globale Mocks und Konfiguration
- TypeScript-Deklarationen für Vitest-Globals in `src/vite-env.d.ts`
- Coverage-Konfiguration für Testabdeckung

### Beitragsprozess
- Code-Review vor Merge in den Hauptbranch
- Linting und Type-Checking bei jedem Build
- Dokumentation neuer Features im DOCUMENTATION.md

## 6. Benutzerrollen und Funktionen

### Admin-Funktionen
- Vollzugriff auf Plattform und Supabase-Datenbank
- Kurs- und Benutzerverwaltung
- Erstellung und Bearbeitung von Fragen und Kategorien
- Überwachung der Plattformnutzung und Analyse

### Lehrkräfte-Funktionen
- Vom Admin angelegt
- Klassenverwaltung und Einsicht in Lernfortschritte
- Alle Schüler-Funktionen
- Erstellung eigener Fragen für ihre Klassen

### Standard-Benutzer (Schüler)
- Kurse absolvieren
- Karten beantworten
- XP sammeln und leveln
- Badges verdienen
- Fortschrittseinsicht

### Anonyme Benutzer
- Zugang zu Signal-Kategorien ohne Anmeldung
- Eingeschränkte Funktionalität ohne Fortschrittsverfolgung

## 7. Aktuelle Implementierungen

### isPlanned-Kategoriefunktion
- Kennzeichnung geplanter, noch nicht verfügbarer Kategorien
- Anzeige eines spezifischen Textes "Demnächst verfügbar"
- Deaktivierte Interaktionsmöglichkeiten
- Visuelle Unterscheidung in der Kategorienliste

### Refactoring der CategoryGrid-Komponente
- Aufteilung in kleinere, spezialisierte Komponenten:
  - `CategoryRegulationFilter.tsx` - Filtert Kategorien nach Regelwerk
  - `EmptyRegulationState.tsx` - Anzeige bei leeren Filterergebnissen
  - `useCategoryMetadata.ts` - Hook für Kategoriemetadaten
- Verbesserte Performance durch optimierte Renderzyklen
- Verbesserte Wartbarkeit durch klarere Zuständigkeiten

### Regelwerk-Präferenzmanagement
- Persistenz der Benutzereinstellung im localStorage und der Datenbank
- Synchronisierung zwischen verschiedenen Geräten
- Filterlogik für regelwerk-spezifische Inhalte

### Standardisierte Test-Architektur
- Vitest als primäres Test-Framework
- Globale Test-Konfiguration mit aktivierten Globals
- Einheitliche Mock-Patterns für externe Abhängigkeiten
- Umfassende Test-Utilities und Helper-Funktionen
- Coverage-Reporting und Performance-Metriken

## 8. Zukünftige Roadmap

### Geplante Features
- Klassenmanagement für Ausbilder
- Erweiterte Statistiken und Lernanalysen
- Offline-Modus mit lokaler Datensynchronisierung
- Peer-to-Peer-Lernmodus
- Erweiterte Gamification-Elemente (Erfolge, Wettbewerbe)
- Integration mit externen Lernplattformen

### Bekannte Probleme
- Performance-Optimierungen für große Fragenkataloge
- Verbesserungen der Bildkompression für schnelleres Laden
- Erweiterung der Testabdeckung

## 9. Design-DNA

### Farben
- Primär Schwarz #000000
- Ultramarin #3F00FF
- Saphir #0F52BA
- Betriebsdienst #00B8A9
- Akzentfarben:
  - Digital Lavender #9683EC
  - Neo-Mint #C7F0BD
  - Tranquil Blue #5080FF
  - Digital Coral #FF6D70

### Typografie
- Hauptschriftart: Inter (Sans-Serif)
- Schriftgewichte: Regular (400), Medium (500), Semibold (600), Bold (700)

### UI-Komponenten
- Mobile-First mit responsiver Anpassung
- Touch-optimierte Interaktionsflächen
- Kartenbasiertes Design mit konsistenten Abständen
- Visuelle Hierarchie durch Farbkodierung
- Zugänglichkeit nach WCAG 2.1 AA-Standard

## 10. Technische Hinweise für Entwickler

### Supabase-Integration
- Client-Initialisierung in `src/integrations/supabase/client.ts`
- Typen generiert aus der Datenbank in `src/integrations/supabase/types.ts`
- API-Funktionen in entsprechenden Modulen strukturiert

### Wichtige Hooks
- `useAuth` - Authentifizierungskontext und -funktionen
- `useSpacedRepetition` - Kern der Lernalgorithmus-Implementierung
- `useCategoryMetadata` - Metadaten-Verwaltung für Kategorien
- `useUserPreferences` - Benutzereinstellungen und -präferenzen

### Kritische Komponenten
- `CategoryGrid` - Darstellung der Kategorieübersicht mit Filtern
- `CardStack` - Kern-UI für das Karteikartensystem
- `FlashcardPage` - Hauptseite für das Lernen mit Karteikarten
- `LearningSessionPage` - Strukturierte Lernsitzungen mit Fortschrittsverfolgung

### Testing-Framework
- **Vitest-Globals**: Verwende immer globale Funktionen (`describe`, `it`, `expect`, `vi`)
- **Test-Setup**: Zentrale Konfiguration in `src/test/setup.ts`
- **Mock-Patterns**: Konsistente Strategien für externe Abhängigkeiten
- **Coverage**: Mindestens 80% Testabdeckung für kritische Geschäftslogik
- **Dokumentation**: Vollständige Testrichtlinien in `src/test/README.md`
