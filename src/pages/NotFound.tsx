
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Navbar from "@/components/layout/Navbar";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center pb-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Seite nicht gefunden</p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
      
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default NotFound;
