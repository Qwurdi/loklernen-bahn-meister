-- Hinzufügen der Spalte requiresAuth zur Tabelle categories
ALTER TABLE categories
ADD COLUMN "requiresAuth" BOOLEAN DEFAULT FALSE;

-- Optional: Bestehende Kategorien aktualisieren (Beispiel)
-- UPDATE categories
-- SET "requiresAuth" = TRUE
-- WHERE name = 'Spezialkategorie';
