import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
type DesktopAuthButtonsProps = {
  isActive: (path: string) => boolean;
};
const DesktopAuthButtons = ({
  isActive
}: DesktopAuthButtonsProps) => {
  const {
    user,
    signOut
  } = useAuth();
  return <div className="hidden md:flex ml-auto space-x-2">
      {user ? <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={signOut} className="border-gray-600 text-white hover:bg-gray-800">
            Abmelden
          </Button>
          <Link to="/admin">
            <Button variant={isActive("/admin") ? "default" : "outline"} size="sm" className={isActive("/admin") ? "bg-loklernen-ultramarine" : "border-gray-600 text-white hover:bg-gray-800"}>
              Admin
            </Button>
          </Link>
        </div> : <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-800 text-zinc-300">
              Anmelden
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="bg-loklernen-ultramarine hover:bg-loklernen-ultramarine/90">
              Registrieren
            </Button>
          </Link>
        </div>}
    </div>;
};
export default DesktopAuthButtons;