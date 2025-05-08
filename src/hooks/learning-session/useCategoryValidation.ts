
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Category } from "@/api/categories/types";
import { QuestionCategory } from "@/types/questions";

export function useCategoryValidation(
  categories: Category[],
  categoriesLoading: boolean,
  categoryParam: string | null,
  isDueCardsView: boolean
) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [categoryRequiresAuth, setCategoryRequiresAuth] = useState<boolean | null>(null);
  const [categoryFound, setCategoryFound] = useState<boolean | null>(null);
  const [isParentCategory, setIsParentCategory] = useState<boolean>(false);

  // Helper function to strip regulation info from category name
  const stripRegulationInfo = (categoryName: string | null): string | null => {
    if (!categoryName) return null;
    
    // Remove patterns like " (DS 301)" or " (DV 301)" from category name
    return categoryName.replace(/\s*\((?:DS|DV)\s+301\)$/i, "");
  };

  useEffect(() => {
    if (categoriesLoading) {
      setCategoryFound(null);
      setCategoryRequiresAuth(null);
      setIsParentCategory(false);
      return;
    }

    // If we're in a due cards view, we don't need to validate category existence
    if (isDueCardsView) {
      console.log("Due cards view - skipping category validation");
      setCategoryFound(true);
      setCategoryRequiresAuth(false);
      setIsParentCategory(false);
      return;
    }

    // Only validate if we have a specific categoryParam
    if (categoryParam) {
      // Strip regulation information for comparing with database categories
      const cleanCategoryName = stripRegulationInfo(categoryParam);
      console.log("Clean category name for comparison:", cleanCategoryName);
      
      // Check if this is a parent category (Signale or Betriebsdienst)
      if (cleanCategoryName === "Signale" || cleanCategoryName === "Betriebsdienst") {
        console.log("Parent category detected:", cleanCategoryName);
        setCategoryFound(true);
        setIsParentCategory(true);
        
        // For parent categories, check auth requirements
        const requiresAuth = cleanCategoryName === "Betriebsdienst";
        setCategoryRequiresAuth(requiresAuth);
        
        // If authentication is required but user is not logged in
        if (requiresAuth && !user) {
          toast.info("Für diese Kategorie ist eine Anmeldung erforderlich.", {
            description: "Bitte melde dich an, um auf diese Lernkarten zuzugreifen.",
          });
          navigate("/login", { replace: true, state: { from: location.pathname } });
        }
        return;
      }
      
      // Look for the category in the database
      const currentCategory = categories.find(
        (cat: Category) => 
          cat.name === cleanCategoryName || 
          cat.id === cleanCategoryName
      );

      if (currentCategory) {
        setCategoryFound(true);
        setIsParentCategory(false);
        const requiresAuth = !!currentCategory.requiresAuth;
        setCategoryRequiresAuth(requiresAuth);
        
        if (requiresAuth && !user) {
          toast.info("Für diese Kategorie ist eine Anmeldung erforderlich.", {
            description: "Bitte melde dich an, um auf diese Lernkarten zuzugreifen.",
          });
          navigate("/login", { replace: true, state: { from: location.pathname } });
        }
      } else {
        setCategoryFound(false);
        setCategoryRequiresAuth(null);
        setIsParentCategory(false);
      }
    } else {
      // No category provided but not in a due cards view
      // This is an edge case that should be handled
      setCategoryFound(true);
      setCategoryRequiresAuth(false);
      setIsParentCategory(false);
    }
  }, [categories, categoriesLoading, categoryParam, user, navigate, location, isDueCardsView]);

  // Fix: Properly cast the stripped category name to QuestionCategory when it's a parent category
  const getCategoryForSpacedRepetition = (): QuestionCategory | null => {
    if (isDueCardsView) {
      return null;
    }
    
    if (isParentCategory && categoryParam) {
      const cleanCategoryName = stripRegulationInfo(categoryParam);
      // Only return if it's actually "Signale" or "Betriebsdienst"
      if (cleanCategoryName === "Signale" || cleanCategoryName === "Betriebsdienst") {
        return cleanCategoryName as QuestionCategory;
      }
    }
    
    // For non-parent categories, just use the categoryParam directly
    return categoryParam as QuestionCategory;
  };

  return {
    categoryRequiresAuth,
    categoryFound,
    isParentCategory,
    stripRegulationInfo,
    getCategoryForSpacedRepetition
  };
}
