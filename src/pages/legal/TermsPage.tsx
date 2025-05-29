
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 pb-24">
        <div className="container max-w-4xl px-4">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Allgemeine Geschäftsbedingungen</h1>
              <p className="text-muted-foreground mt-2">
                Nutzungsbedingungen für LokLernen
              </p>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <h2>§ 1 Geltungsbereich</h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der LokLernen-Plattform. 
                Mit der Registrierung und Nutzung der Plattform erkennen Sie diese AGB an.
              </p>
              
              <h2>§ 2 Leistungen</h2>
              <p>
                LokLernen bietet eine Lernplattform für angehende Triebfahrzeugführer*innen mit Karteikarten, 
                Übungen und Fortschrittsverfolgung. Die Inhalte dienen der Prüfungsvorbereitung und ersetzen 
                keine offizielle Ausbildung.
              </p>
              
              <h2>§ 3 Nutzerkonto</h2>
              <p>
                Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich. 
                Sie sind verpflichtet, wahrheitsgemäße Angaben zu machen und Ihr Passwort geheim zu halten.
              </p>
              
              <h2>§ 4 Nutzungsrechte</h2>
              <p>
                Die Inhalte der Plattform sind urheberrechtlich geschützt. 
                Sie erhalten ein einfaches, nicht übertragbares Nutzungsrecht für den persönlichen Gebrauch.
              </p>
              
              <h2>§ 5 Verhaltensregeln</h2>
              <p>
                Bei der Nutzung der Plattform sind Sie verpflichtet, geltendes Recht zu beachten und 
                keine rechtswidrigen oder anderen Nutzern schadende Inhalte zu erstellen oder zu verbreiten.
              </p>
              
              <h2>§ 6 Haftung</h2>
              <p>
                Wir haften nur für Vorsatz und grobe Fahrlässigkeit. 
                Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit gesetzlich zulässig.
              </p>
              
              <h2>§ 7 Kündigung</h2>
              <p>
                Das Nutzungsverhältnis kann jederzeit von beiden Seiten gekündigt werden. 
                Bei Verstößen gegen diese AGB können wir das Konto ohne Vorankündigung sperren.
              </p>
              
              <h2>§ 8 Schlussbestimmungen</h2>
              <p>
                Es gilt deutsches Recht. Sollten einzelne Bestimmungen unwirksam sein, 
                bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
      <BottomNavigation />
    </div>
  );
}
