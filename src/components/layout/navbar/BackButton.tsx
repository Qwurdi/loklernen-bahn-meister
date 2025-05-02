
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type BackButtonProps = {
  previousPath: string;
};

const BackButton = ({ previousPath }: BackButtonProps) => {
  return (
    <Link to={previousPath} className="mr-3">
      <Button variant="ghost" size="icon" className="h-10 w-10 text-white hover:text-white hover:bg-gray-800">
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Zurück</span>
      </Button>
    </Link>
  );
};

export default BackButton;
