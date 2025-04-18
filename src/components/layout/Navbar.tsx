
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const AuthButtons = () => {
    if (loading) {
      return <div className="text-sm text-muted-foreground">Lädt...</div>;
    }

    if (user) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            <span className="text-sm">{user.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Abmelden
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="outline" size="sm">Anmelden</Button>
        </Link>
        <Link to="/register">
          <Button size="sm">Registrieren</Button>
        </Link>
      </div>
    );
  };

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
            
            <AuthButtons />
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
            <div className="pt-2">
              <AuthButtons />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
