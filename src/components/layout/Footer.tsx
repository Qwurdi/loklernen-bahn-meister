
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="text-lg font-bold">
              <span className="text-black">Lok</span>
              <span className="text-loklernen-ultramarine">Lernen</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Die Lern-App für angehende Triebfahrzeugführer*innen
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Lernen</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/signale" className="text-muted-foreground transition-colors hover:text-foreground">
                    Signale
                  </Link>
                </li>
                <li>
                  <Link to="/betriebsdienst" className="text-muted-foreground transition-colors hover:text-foreground">
                    Betriebsdienst
                  </Link>
                </li>
                <li>
                  <Link to="/fortschritt" className="text-muted-foreground transition-colors hover:text-foreground">
                    Mein Fortschritt
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Rechtliches</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/datenschutz" className="text-muted-foreground transition-colors hover:text-foreground">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link to="/impressum" className="text-muted-foreground transition-colors hover:text-foreground">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link to="/agb" className="text-muted-foreground transition-colors hover:text-foreground">
                    AGB
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Kontakt</h4>
            <p className="text-sm text-muted-foreground">
              Fragen oder Anregungen? Schreib uns eine Mail an 
              <a href="mailto:info@loklernen.de" className="ml-1 text-loklernen-ultramarine hover:underline">
                info@loklernen.de
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LokLernen. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
