
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Logo = () => {
  const isMobile = useIsMobile();
  
  return (
    <Link to="/" className="flex items-center">
      <span className={cn(
        "font-bold text-center",
        isMobile ? "text-3xl" : "text-4xl"
      )}>
        <span className="text-white">Lok</span>
        <span className="text-loklernen-ultramarine">Lernen</span>
      </span>
    </Link>
  );
};

export default Logo;
