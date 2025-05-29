
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ImprintPage() {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 pb-24">
        <div className="container max-w-4xl px-4">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Impressum</h1>
              <p className="text-muted-foreground mt-2">
                Angaben gemäß § 5 TMG
              </p>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <h2>Anbieter</h2>
              <p>
                LokLernen<br/>
                E-Mail: info@loklernen.de
              </p>
              
              <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p>
                LokLernen<br/>
                E-Mail: info@loklernen.de
              </p>
              
              <h2>Haftungsausschluss</h2>
              <h3>Haftung für Inhalte</h3>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. 
                Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen.
              </p>
              
              <h3>Haftung für Links</h3>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              </p>
              
              <h2>Urheberrecht</h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. 
                Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
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
