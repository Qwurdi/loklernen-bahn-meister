
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 pb-24">
        <div className="container max-w-4xl px-4">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
              <p className="text-muted-foreground mt-2">
                Informationen zum Umgang mit Ihren Daten
              </p>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <h2>1. Verantwortlicher</h2>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br/>
                LokLernen<br/>
                E-Mail: info@loklernen.de
              </p>
              
              <h2>2. Erhebung und Speicherung personenbezogener Daten</h2>
              <p>
                Wir erheben und verwenden Ihre personenbezogenen Daten nur im Rahmen der gesetzlichen Bestimmungen. 
                Nachfolgend informieren wir Sie über Art, Umfang und Zweck der Erhebung und Verwendung personenbezogener Daten.
              </p>
              
              <h2>3. Verwendung von Cookies</h2>
              <p>
                Diese Website verwendet Cookies, um die Nutzerfreundlichkeit zu verbessern. 
                Durch die weitere Nutzung der Website stimmen Sie der Verwendung von Cookies zu.
              </p>
              
              <h2>4. Ihre Rechte</h2>
              <p>
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung Ihrer gespeicherten Daten, 
                ein Widerspruchsrecht gegen die Verarbeitung sowie ein Recht auf Datenübertragbarkeit.
              </p>
              
              <h2>5. Kontakt</h2>
              <p>
                Bei Fragen zum Datenschutz wenden Sie sich bitte an: info@loklernen.de
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
