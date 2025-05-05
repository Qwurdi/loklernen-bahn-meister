
import React from "react";
import { Link } from "react-router-dom";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Database, Loader2, Tags, ChevronRight, Info } from "lucide-react";

interface CategoryPageHeaderProps {
  isEmpty: boolean;
  isInitializing: boolean;
  showHelp: boolean;
  onInitialize: () => void;
  onHideHelp: () => void;
}

const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  isEmpty,
  isInitializing,
  showHelp,
  onInitialize,
  onHideHelp
}) => {
  return (
    <>
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Kategorieverwaltung</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {isEmpty && (
          <Button 
            onClick={onInitialize}
            className="flex items-center bg-gradient-to-r from-loklernen-ultramarine to-loklernen-sapphire text-white"
            disabled={isInitializing}
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initialisiere...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Standardkategorien initialisieren
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Tags className="h-8 w-8" />
          Kategorieverwaltung
        </h1>
        
        {showHelp && !isEmpty && (
          <div className="relative">
            <div className="absolute -top-12 right-0 w-64 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800 shadow-lg animate-fade-in-up">
              <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  Wechseln Sie zwischen Signal- und Betriebsdienst-Kategorien mit den Tabs
                  <button 
                    className="absolute top-1 right-1 text-blue-500 hover:text-blue-700"
                    onClick={onHideHelp}
                  >
                    <span className="text-xs">×</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPageHeader;
