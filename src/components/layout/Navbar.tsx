
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "./navbar/Logo";
import BackButton from "./navbar/BackButton";
import DesktopNavigation from "./navbar/DesktopNavigation";
import DesktopAuthButtons from "./navbar/DesktopAuthButtons";
import { defaultNavItems, getPreviousPath } from "./navbar/NavbarUtils";

const Navbar = () => {
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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        {isMobile && showBackButton ? (
          <BackButton previousPath={getPreviousPath(location.pathname)} />
        ) : null}
        
        <Logo />
        
        <DesktopNavigation 
          navItems={defaultNavItems}
          isActive={isActive}
        />
        
        <DesktopAuthButtons isActive={isActive} />
      </div>
    </header>
  );
}

export default Navbar;
