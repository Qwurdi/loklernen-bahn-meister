import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SessionType } from "@/hooks/spaced-repetition/types";
import { AccessStatus } from "./types";

interface UseSessionInitializationProps {
  userId?: string;
  practiceMode: boolean;
  accessStatus: AccessStatus;
  categoryIdentifiers: string[];
  regulationParam?: string;
  boxParam?: number;
  initializeSession: (sessionType: SessionType, categoryName?: string, regulation?: string, cardIdsToLoad?: number[]) => Promise<void>;
}

export function useSessionInitialization({
  userId,
  practiceMode,
  accessStatus,
  categoryIdentifiers,
  regulationParam,
  boxParam,
  initializeSession
}: UseSessionInitializationProps) {
  const location = useLocation();
  
  useEffect(() => {
    const determineSessionTypeAndLoad = async () => {
      let sessionType: SessionType = 'due'; // Default for logged-in users
      let categoryNameToLoad: string | undefined = undefined;
      let cardIdsToLoad: number[] | undefined = undefined;

      const params = new URLSearchParams(location.search);
      const specificCardIdsParam = params.get('card_ids');

      if (specificCardIdsParam) {
        sessionType = 'specific_ids';
        cardIdsToLoad = specificCardIdsParam.split(',').map(Number).filter(id => !isNaN(id));
      } else if (!userId && !practiceMode) { // Guest user learning (not practice mode)
        sessionType = 'guest';
        if (categoryIdentifiers.length > 0) {
          categoryNameToLoad = categoryIdentifiers.join(',');
        } else {
          // This case is typically for the "Signale kostenlos lernen" button
          // which should pass ?category=Signale in the URL
          categoryNameToLoad = "Signale"; // Default if somehow not passed via categoryIdentifiers
        }
      } else if (practiceMode) { // Practice mode (can be for logged-in or guest if category allows)
        sessionType = 'all'; // Load all relevant cards for practice (can be filtered by category)
        if (categoryIdentifiers.length > 0) {
          categoryNameToLoad = categoryIdentifiers.join(',');
          // sessionType could also be 'category' if practice is always category-specific
        }
      } else if (userId) { // Logged-in user, not practice mode, no specific_ids
        if (boxParam !== undefined) {
          sessionType = 'all'; // Signifying all cards in a specific box
        } else if (categoryIdentifiers.length > 0) {
          sessionType = 'category';
          categoryNameToLoad = categoryIdentifiers.join(',');
        }
        // else, it remains 'due' (all due cards for the logged-in user)
      }

      // Session initialization should proceed if access is allowed or no specific selection is made yet (which might resolve to allowed)
      if (accessStatus === "allowed" || accessStatus === "no_selection") {
        console.log(`Initializing session with type: ${sessionType}, category: ${categoryNameToLoad}, regulation: ${regulationParam}, cardIds: ${cardIdsToLoad}`);
        await initializeSession(sessionType, categoryNameToLoad, regulationParam, cardIdsToLoad);
      } else {
        console.log(`Session initialization skipped. AccessStatus: ${accessStatus}, SessionType: ${sessionType}, UserID: ${userId}, Category: ${categoryNameToLoad}`);
      }
    };

    // Trigger session loading if:
    // 1. User is logged in (userId is present)
    // 2. It's practice mode (practiceMode is true; accessStatus will determine if allowed)
    // 3. It's a guest user and access is allowed (e.g., for "Signale" category)
    if (userId || practiceMode || (!userId && accessStatus === "allowed")) {
      determineSessionTypeAndLoad();
    }
  }, [accessStatus, userId, practiceMode, categoryIdentifiers, regulationParam, boxParam, location.search, initializeSession]);

  return {};
}
