
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Category } from "@/api/categories/types";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { QuestionCategory } from "@/types/questions";

// Define a type for access status
export type AccessStatus = "pending" | "allowed" | "denied_auth" | "denied_pro" | "not_found" | "no_selection";

interface UseSessionAccessProps {
  singleCategoryIdentifier?: string;
  multipleCategoryIdentifiers?: string[];
  isParentCategory: boolean;
  resolvedCategoryIdentifiers: string[];
  practiceMode: boolean;
}

export function useSessionAccess({
  singleCategoryIdentifier,
  multipleCategoryIdentifiers,
  isParentCategory,
  resolvedCategoryIdentifiers,
  practiceMode
}: UseSessionAccessProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast: manageCustomToast, toasts: customToastList } = useToast();
  const { categories, isLoading: categoriesLoading, error: categoriesDbError } = useCategories();
  
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("pending");
  const [resolvedSessionTitle, setResolvedSessionTitle] = useState<string>("");

  useEffect(() => {
    if (categoriesLoading) {
      setAccessStatus("pending");
      return;
    }
    
    if (categoriesDbError) {
      manageCustomToast({
        title: "Fehler beim Laden der Kategoriedaten.",
        description: categoriesDbError.message,
        variant: "destructive",
      });
      setAccessStatus("not_found");
      return;
    }

    // If no specific category is selected (e.g., for global due cards review)
    // Or if we're handling a parent category with resolved subcategories
    if ((!singleCategoryIdentifier && (!multipleCategoryIdentifiers || multipleCategoryIdentifiers.length === 0)) ||
        (isParentCategory && resolvedCategoryIdentifiers.length > 0)) {
      setAccessStatus("allowed");
      return;
    }

    let targetCategories: Category[] = [];
    let notFoundIdentifiers: string[] = [];

    if (multipleCategoryIdentifiers && multipleCategoryIdentifiers.length > 0) {
      targetCategories = multipleCategoryIdentifiers.map(idOrName => {
        const found = categories.find(cat => cat.name === idOrName || cat.id === idOrName);
        if (!found) notFoundIdentifiers.push(idOrName);
        return found;
      }).filter(Boolean) as Category[];
      
      if (notFoundIdentifiers.length > 0) {
        manageCustomToast({
          title: "Einige Kategorien wurden nicht gefunden:",
          description: notFoundIdentifiers.join(', '),
          variant: "destructive",
        });
        setAccessStatus("not_found");
        return;
      }
      
      setResolvedSessionTitle(`Auswahl (${targetCategories.length} Kategorien)`);
    } else if (singleCategoryIdentifier) {
      // If we already handled it as a parent category, skip this block
      if (isParentCategory) return;
      
      const foundCat = categories.find(cat => cat.name === singleCategoryIdentifier || cat.id === singleCategoryIdentifier);
      if (foundCat) {
        targetCategories = [foundCat];
        setResolvedSessionTitle(foundCat.name);
      } else {
        notFoundIdentifiers.push(singleCategoryIdentifier);
        manageCustomToast({
          title: "Kategorie nicht gefunden:",
          description: singleCategoryIdentifier,
          variant: "destructive",
        });
        setAccessStatus("not_found");
        return;
      }
    }

    if (targetCategories.length === 0 && (singleCategoryIdentifier || multipleCategoryIdentifiers)) {
      const existingToast = customToastList.some((toast) => toast.id === "cat_not_found" && toast.open);
      if (!existingToast) { 
        manageCustomToast({
          id: "cat_not_found",
          title: "Die angeforderten Lernkategorien wurden nicht gefunden.",
          variant: "destructive",
        });
      }
      setAccessStatus("not_found");
      return;
    }

    let requiresAuthNeeded = false;
    let proRequired = false;

    for (const cat of targetCategories) {
      if (cat.requiresAuth) {
        requiresAuthNeeded = true;
      }
      if (cat.isPro) {
        proRequired = true;
      }
    }

    const isUserPro = !!user?.user_metadata?.is_pro_member;

    if (requiresAuthNeeded && !user) {
      manageCustomToast({
        title: "Für diese Auswahl ist eine Anmeldung erforderlich.",
        description: "Bitte melde dich an, um auf diese Lernkarten zuzugreifen.",
        variant: "default",
      });
      const returnTo = location.pathname + location.search;
      navigate("/login", { replace: true, state: { from: returnTo } });
      setAccessStatus("denied_auth");
      return;
    }

    if (proRequired && !isUserPro) {
      manageCustomToast({
        title: "Premium-Funktion erforderlich.",
        description: "Einige der ausgewählten Kategorien sind nur für Premium-Mitglieder verfügbar.",
        variant: "destructive",
      });
      navigate("/dashboard", { replace: true, state: { showProUpsell: true } });
      setAccessStatus("denied_pro");
      return;
    }

    setAccessStatus("allowed");
  }, [categories, categoriesLoading, categoriesDbError, singleCategoryIdentifier, multipleCategoryIdentifiers, user, navigate, location, manageCustomToast, customToastList, isParentCategory, resolvedCategoryIdentifiers]);

  return { 
    accessStatus, 
    resolvedSessionTitle, 
    setResolvedSessionTitle,
    categoriesLoading
  };
}
