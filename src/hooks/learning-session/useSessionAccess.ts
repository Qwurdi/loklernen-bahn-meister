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
    if (userLoading || categoriesLoading) {
      setAccessStatus("loading");
      return;
    }

    if (practiceMode) {
      setAccessStatus("allowed");
      return;
    }

    if (
      (!singleCategoryIdentifier || singleCategoryIdentifier === "") &&
      (!multipleCategoryIdentifiers || multipleCategoryIdentifiers.length === 0) &&
      (!resolvedCategoryIdentifiers || resolvedCategoryIdentifiers.length === 0)
    ) {
      setAccessStatus("no_selection");
      return;
    }

    let finalAnyRequiresAuth = false;

    // Check if the request is for the "Signale" parent category by a guest user
    const isGuestAccessingSignaleParent = !user && isParentCategory && singleCategoryIdentifier === "Signale";

    if (isGuestAccessingSignaleParent) {
      finalAnyRequiresAuth = false; // Signale parent category is explicitly free for guests
    } else {
      const categoryRequiresAuthFn = (catIdOrName: string): boolean => {
        const category = categories.find((c) => c.name === catIdOrName || c.id === catIdOrName);
        if (category && category.parent_category === 'Signale') {
          return false; // Subcategories of "Signale" are free
        }
        return category?.requiresAuth || category?.isPro;
      };

      const identifiersToCheck = resolvedCategoryIdentifiers?.length ? resolvedCategoryIdentifiers :
                                multipleCategoryIdentifiers?.length ? multipleCategoryIdentifiers :
                                singleCategoryIdentifier ? [singleCategoryIdentifier] : [];

      if (identifiersToCheck.length > 0) {
        // If it's a guest and all identifiers are sub-categories of "Signale"
        if (!user && identifiersToCheck.every(id => {
            const cat = categories.find(c => c.id === id || c.name === id);
            return cat?.parent_category === 'Signale' ? false : (cat?.requiresAuth || cat?.isPro);
        })) {
             finalAnyRequiresAuth = false; // All checked signal subcategories are free for guests
        } else {
            // For logged-in users, or if not all categories are free signal subcategories for guests
            finalAnyRequiresAuth = identifiersToCheck.some(categoryRequiresAuthFn);
        }
      }
    }

    if (finalAnyRequiresAuth && !user) {
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
    practiceMode,
    isParentCategory
  ]);

  return { 
    accessStatus,
    resolvedSessionTitle,
    setResolvedSessionTitle,
    categoriesLoading
  };
}
