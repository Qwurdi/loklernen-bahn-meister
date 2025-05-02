
import { Link, useLocation } from "react-router-dom";
import { Home, Book, BarChart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function BottomNavigation() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path));
  };

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-6 w-6" />,
    },
    {
      name: "Karten",
      path: "/karteikarten",
      icon: <Book className="h-6 w-6" />,
    },
    {
      name: "Fortschritt",
      path: "/fortschritt",
      icon: <BarChart className="h-6 w-6" />,
    },
    {
      name: user ? "Profil" : "Anmelden",
      path: user ? "/einstellungen" : "/login",
      icon: <User className="h-6 w-6" />,
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t border-gray-200 z-50 h-18 py-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center justify-center h-full w-full text-xs",
            isActive(item.path) 
              ? "text-loklernen-ultramarine font-medium" 
              : "text-gray-500"
          )}
        >
          <div className={cn(
            "rounded-full p-2 mb-1",
            isActive(item.path) ? "bg-blue-100" : ""
          )}>
            {item.icon}
          </div>
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
