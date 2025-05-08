
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { toast } from "sonner";

export type AccessStatus =
  | "loading"
  | "allowed"
  | "denied_category"
  | "denied_auth"
  | "no_selection";

interface UseSessionAccessProps {
  singleCategoryIdentifier?: string;
  multipleCategoryIdentifiers?: string[];
  isParentCategory?: boolean;
  resolvedCategoryIdentifiers?: string[];
  practiceMode?: boolean;
}

export function useSessionAccess({
  singleCategoryIdentifier,
  multipleCategoryIdentifiers,
  isParentCategory = false,
  resolvedCategoryIdentifiers = [],
  practiceMode = false
}: UseSessionAccessProps) {
  const { user, loading: userLoading } = useAuth();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("loading");
  const [resolvedSessionTitle, setResolvedSessionTitle] = useState<string>("");

  useEffect(() => {
    // Wait for user and categories to load
    if (userLoading || categoriesLoading) {
      setAccessStatus("loading");
      return;
    }

    // If practice mode is enabled, access is allowed
    if (practiceMode) {
      setAccessStatus("allowed");
      return;
    }

    // If no category is selected, set special status
    if (
      (!singleCategoryIdentifier || singleCategoryIdentifier === "") &&
      (!multipleCategoryIdentifiers || multipleCategoryIdentifiers.length === 0) &&
      (!resolvedCategoryIdentifiers || resolvedCategoryIdentifiers.length === 0)
    ) {
      setAccessStatus("no_selection");
      return;
    }

    // Helper function to check if a category requires authentication
    const categoryRequiresAuth = (categoryName: string) => {
      const category = categories.find((c) => c.name === categoryName);
      return category?.requiresAuth || category?.isPro;
    };

    // Check if any selected category requires authentication
    let anyRequiresAuth = false;
    
    if (resolvedCategoryIdentifiers && resolvedCategoryIdentifiers.length > 0) {
      anyRequiresAuth = resolvedCategoryIdentifiers.some(categoryRequiresAuth);
    } else if (multipleCategoryIdentifiers && multipleCategoryIdentifiers.length > 0) {
      anyRequiresAuth = multipleCategoryIdentifiers.some(categoryRequiresAuth);
    } else if (singleCategoryIdentifier) {
      anyRequiresAuth = categoryRequiresAuth(singleCategoryIdentifier);
    }

    // Determine access status
    if (anyRequiresAuth && !user) {
      setAccessStatus("denied_auth");
      toast("Anmeldung erforderlich", {
        description: "Für diese Kategorie ist eine Anmeldung erforderlich."
      });
    } else {
      setAccessStatus("allowed");
    }
  }, [
    user,
    userLoading,
    categories,
    categoriesLoading,
    singleCategoryIdentifier,
    multipleCategoryIdentifiers,
    resolvedCategoryIdentifiers,
    practiceMode
  ]);

  return { 
    accessStatus,
    resolvedSessionTitle,
    setResolvedSessionTitle,
    categoriesLoading
  };
}
