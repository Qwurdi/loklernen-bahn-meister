
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

type NavItem = {
  name: string;
  path: string;
  requiresAuth?: boolean;
};

type DesktopNavigationProps = {
  navItems: NavItem[];
  isActive: (path: string) => boolean;
};

const DesktopNavigation = ({ navItems, isActive }: DesktopNavigationProps) => {
  const { user } = useAuth();

  return (
    <nav className="hidden md:flex flex-1 items-center justify-center space-x-1">
      {navItems.map((item) => (
        (!item.requiresAuth || user) && (
          <Link key={item.path} to={item.path}>
            <Button 
              variant={isActive(item.path) ? "default" : "ghost"} 
              className={isActive(item.path) 
                ? "bg-loklernen-ultramarine text-white" 
                : "text-white hover:bg-gray-800"
              }
            >
              {item.name}
            </Button>
          </Link>
        )
      ))}
    </nav>
  );
};

export default DesktopNavigation;
