import { QuestionCategory } from "@/types/questions";

// Type definition for categories
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parent_category: QuestionCategory;
  created_at?: string;
  updated_at?: string;
  isPro?: boolean;
  isPlanned?: boolean;
  requiresAuth?: boolean; // Neues Feld hinzugefügt
}

// Signal subcategories array
export const signalSubCategories = [
  "Allgemeine Bestimmungen",
  "Hp-Signale",
  "Kombinationssignale (Ks)",
  "Lichthaupt- und Lichtvorsignale (Hl)",
  "Haupt- und Vorsignalverbindungen (Sv)",
  "Vr-Signale",
  "Zusatzsignale (Zs)",
  "Signale für Schiebelokomotiven und Sperrfahrten (Ts)",
  "Langsamfahrsignale (Lf)",
  "Schutzsignale (Sh)",
  "Signale für den Rangierdienst (Ra)",
  "Weichensignale (Wn)",
  "Signale für das Zugpersonal (Zp)",
  "Fahrleitungssignale (El)",
  "Signale an Zügen (Zg)",
  "Signale an einzelnen Fahrzeugen (Fz)",
  "Nebensignale (Ne)",
  "Signale für Bahnübergänge (Bü)",
  "Orientierungszeichen",
  "Signalkombinationen (Sk)"
] as const;

// Betriebsdienst subcategories array
export const betriebsdienstSubCategories = [
  "Grundlagen Bahnbetrieb",
  "UVV & Arbeitsschutz",
  "Rangieren",
  "Züge fahren",
  "PZB & Sicherungsanlagen",
  "Kommunikation",
  "Besonderheiten",
  "Unregelmäßigkeiten"
] as const;
