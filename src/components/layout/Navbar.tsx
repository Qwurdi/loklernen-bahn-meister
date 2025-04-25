
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Book, Home, Menu, User, BarChart } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path));
  };

  const navItems = [
    { 
      name: "Home", 
      path: "/", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: "Karteikarten", 
      path: "/karteikarten", 
      icon: <Book className="h-5 w-5" /> 
    },
    { 
      name: "Fortschritt", 
      path: "/fortschritt", 
      icon: <BarChart className="h-5 w-5" />,
      requiresAuth: true
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center font-bold text-lg">
          <span className="text-black">Lok</span>
          <span className="text-loklernen-ultramarine">Lernen</span>
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

        {/* Mobile Navigation */}
        <div className="md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 py-4">
                {navItems.map((item) => (
                  (!item.requiresAuth || user) && (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-3 rounded-md ${
                        isActive(item.path) 
                          ? "bg-loklernen-ultramarine text-white" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )
                ))}
                
                {user ? (
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
                ) : (
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
