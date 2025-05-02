
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, User, Settings, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Check if we're on a subpage that needs a back button
  const showBackButton = location.pathname !== "/" && 
                         location.pathname !== "/karteikarten" && 
                         location.pathname !== "/fortschritt" &&
                         location.pathname !== "/einstellungen";

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path));
  };

  const navItems = [
    { 
      name: "Home", 
      path: "/", 
    },
    { 
      name: "Karteikarten", 
      path: "/karteikarten", 
    },
    { 
      name: "Fortschritt", 
      path: "/fortschritt", 
      requiresAuth: true
    },
    { 
      name: "Einstellungen", 
      path: "/einstellungen", 
      requiresAuth: true
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  // Get previous page for back button
  const getPreviousPath = () => {
    if (location.pathname.includes("/karteikarten/lernen")) return "/karteikarten";
    if (location.pathname.includes("/karteikarten/signale/")) return "/karteikarten";
    if (location.pathname.includes("/karteikarten/betriebsdienst/")) return "/karteikarten/betriebsdienst";
    return "/";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        {isMobile && showBackButton ? (
          <Link to={getPreviousPath()} className="mr-3">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Zurück</span>
            </Button>
          </Link>
        ) : null}
        
        <Link to="/" className="flex items-center">
          <span className={cn(
            "font-bold text-center",
            isMobile ? "text-xl" : "text-2xl"
          )}>
            <span className="text-black">Lok</span>
            <span className="text-loklernen-ultramarine">Lernen</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-1">
          {navItems.map((item) => (
            (!item.requiresAuth || user) && (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive(item.path) ? "default" : "ghost"} 
                  className={isActive(item.path) ? "bg-loklernen-ultramarine text-white" : ""}
                >
                  {item.name}
                </Button>
              </Link>
            )
          ))}
        </nav>
        
        <div className="hidden md:flex ml-auto space-x-2">
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Abmelden
              </Button>
              <Link to="/admin">
                <Button 
                  variant={isActive("/admin") ? "default" : "outline"} 
                  size="sm"
                  className={isActive("/admin") ? "bg-loklernen-ultramarine" : ""}
                >
                  Admin
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  Anmelden
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  size="sm"
                  className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90"
                >
                  Registrieren
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation - Only Show Menu Button (No Bottom Nav Duplication) */}
        <div className="md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 py-4">
                <div className="text-xl font-bold mb-4">
                  <span className="text-black">Lok</span>
                  <span className="text-loklernen-ultramarine">Lernen</span>
                </div>
                
                {user ? (
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-500">Angemeldet als</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                ) : null}
                
                {user && (
                  <>
                    <Link 
                      to="/admin" 
                      className={`flex items-center gap-2 px-4 py-3 rounded-md ${
                        isActive("/admin") 
                          ? "bg-loklernen-ultramarine text-white" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Admin
                    </Link>
                    <Button variant="outline" className="mt-4" onClick={handleSignOut}>
                      Abmelden
                    </Button>
                  </>
                )}
                
                {!user && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Anmelden
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
                        Registrieren
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
