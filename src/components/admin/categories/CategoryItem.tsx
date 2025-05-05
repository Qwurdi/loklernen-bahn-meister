
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/api/categories/types";

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onEdit, onDelete }) => {
  return (
    <li className="p-4 hover:bg-gray-50 transition-colors duration-150 flex justify-between items-center">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 flex items-center gap-2">
          {category.name}
          {category.isPro && (
            <Badge className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black">
              PRO
            </Badge>
          )}
        </div>
        {category.description && (
          <div className="mt-1 text-sm text-gray-500 truncate">{category.description}</div>
        )}
      </div>
      <div className="flex space-x-2 ml-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(category)}
          className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Bearbeiten</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(category)}
          className="hover:bg-red-50 hover:text-red-700 hover:border-red-200"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Löschen</span>
        </Button>
      </div>
    </li>
  );
};

export default CategoryItem;
