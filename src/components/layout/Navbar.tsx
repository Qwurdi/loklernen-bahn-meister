
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center">
            <span className="text-lg font-bold">
              <span className="text-black">Lok</span>
              <span className="text-loklernen-ultramarine">Lernen</span>
            </span>
          </Link>
        </div>
        
        {!isMobile && (
          <nav className="flex flex-1 items-center justify-between">
            <div className="flex gap-6 md:gap-10">
              <Link to="/signale" className="text-sm font-medium transition-colors hover:text-loklernen-ultramarine">
                Signale
              </Link>
              <Link to="/betriebsdienst" className="text-sm font-medium transition-colors hover:text-loklernen-ultramarine">
                Betriebsdienst
              </Link>
              <Link to="/fortschritt" className="text-sm font-medium transition-colors hover:text-loklernen-ultramarine">
                Mein Fortschritt
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Anmelden</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Registrieren</Button>
              </Link>
            </div>
          </nav>
        )}
        
        {isMobile && (
          <div className="flex flex-1 items-center justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-2"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="container pb-4">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/signale" 
              className="py-2 text-sm font-medium transition-colors hover:text-loklernen-ultramarine"
              onClick={() => setIsMenuOpen(false)}
            >
              Signale
            </Link>
            <Link 
              to="/betriebsdienst" 
              className="py-2 text-sm font-medium transition-colors hover:text-loklernen-ultramarine"
              onClick={() => setIsMenuOpen(false)}
            >
              Betriebsdienst
            </Link>
            <Link 
              to="/fortschritt" 
              className="py-2 text-sm font-medium transition-colors hover:text-loklernen-ultramarine"
              onClick={() => setIsMenuOpen(false)}
            >
              Mein Fortschritt
            </Link>
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm">Anmelden</Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button size="sm">Registrieren</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
