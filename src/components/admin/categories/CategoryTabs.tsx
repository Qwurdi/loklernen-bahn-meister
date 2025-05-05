
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/api/categories/types";
import CategoryList from "@/components/admin/categories/CategoryList";
import CategoryForm from "@/components/admin/categories/CategoryForm";

interface CategoryTabsProps {
  activeTab: "signal" | "betriebsdienst";
  onTabChange: (value: string) => void;
  signalCategories: Category[];
  betriebsdienstCategories: Category[];
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onTabChange,
  signalCategories,
  betriebsdienstCategories
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange}
      className="space-y-6"
    >
      <TabsList className="w-full sm:w-auto bg-white border border-gray-200 p-1">
        <TabsTrigger 
          value="signal" 
          className="relative px-4 py-2 data-[state=active]:bg-loklernen-ultramarine/10 data-[state=active]:text-loklernen-ultramarine"
        >
          <span className="flex items-center gap-2">
            Signale
            <span className="rounded-full bg-loklernen-ultramarine/10 px-2 py-0.5 text-xs text-loklernen-ultramarine">
              {signalCategories.length}
            </span>
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="betriebsdienst" 
          className="relative px-4 py-2 data-[state=active]:bg-loklernen-betriebsdienst/10 data-[state=active]:text-loklernen-betriebsdienst"
        >
          <span className="flex items-center gap-2">
            Betriebsdienst
            <span className="rounded-full bg-loklernen-betriebsdienst/10 px-2 py-0.5 text-xs text-loklernen-betriebsdienst">
              {betriebsdienstCategories.length}
            </span>
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="signal" className="space-y-6 mt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CategoryList 
              categories={signalCategories} 
              parentCategory="Signale" 
            />
          </div>
          <div>
            <CategoryForm parentCategory="Signale" />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="betriebsdienst" className="space-y-6 mt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CategoryList 
              categories={betriebsdienstCategories} 
              parentCategory="Betriebsdienst" 
            />
          </div>
          <div>
            <CategoryForm parentCategory="Betriebsdienst" />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CategoryTabs;
