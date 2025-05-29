
import SafeLink from "@/components/navigation/SafeLink";
import { ROUTES } from "@/constants/routes";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="text-lg font-bold">
              <span className="text-white">Lok</span>
              <span className="text-loklernen-ultramarine">Lernen</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Die Lern-App für angehende Triebfahrzeugführer*innen
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Lernen</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <SafeLink to={ROUTES.CARDS} className="text-gray-400 transition-colors hover:text-white">
                    Signale
                  </SafeLink>
                </li>
                <li>
                  <SafeLink to={ROUTES.CARDS} className="text-gray-400 transition-colors hover:text-white">
                    Betriebsdienst
                  </SafeLink>
                </li>
                <li>
                  <SafeLink to={ROUTES.PROGRESS} className="text-gray-400 transition-colors hover:text-white">
                    Mein Fortschritt
                  </SafeLink>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <SafeLink to={ROUTES.PRIVACY} className="text-gray-400 transition-colors hover:text-white">
                    Datenschutz
                  </SafeLink>
                </li>
                <li>
                  <SafeLink to={ROUTES.IMPRINT} className="text-gray-400 transition-colors hover:text-white">
                    Impressum
                  </SafeLink>
                </li>
                <li>
                  <SafeLink to={ROUTES.TERMS} className="text-gray-400 transition-colors hover:text-white">
                    AGB
                  </SafeLink>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Kontakt</h4>
            <p className="text-sm text-gray-400">
              Fragen oder Anregungen? Schreib uns eine Mail an 
              <a href="mailto:info@loklernen.de" className="ml-1 text-loklernen-ultramarine hover:underline">
                info@loklernen.de
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} LokLernen. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
