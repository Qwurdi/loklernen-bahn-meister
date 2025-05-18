
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

type DesktopAuthButtonsProps = {
  isActive: (path: string) => boolean;
};

const DesktopAuthButtons = ({ isActive }: DesktopAuthButtonsProps) => {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error("Fehler beim Abmelden: " + error.message);
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="hidden md:flex ml-auto space-x-2">
      {user ? (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="border-gray-600 text-white bg-black hover:text-white hover:bg-gray-800"
          >
            {isLoggingOut ? "Wird abgemeldet..." : "Abmelden"}
          </Button>
          <Link to="/admin">
            <Button 
              variant={isActive("/admin") ? "default" : "outline"} 
              size="sm"
              className={isActive("/admin") 
                ? "bg-loklernen-ultramarine text-white" 
                : "border-gray-600 text-white bg-black hover:text-white hover:bg-gray-800"
              }
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
              className="border-gray-600 text-white bg-black hover:text-white hover:bg-gray-800"
            >
              Anmelden
            </Button>
          </Link>
          <Link to="/register">
            <Button 
              size="sm"
              className="bg-loklernen-ultramarine text-white hover:bg-loklernen-ultramarine/80"
            >
              Registrieren
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DesktopAuthButtons;
