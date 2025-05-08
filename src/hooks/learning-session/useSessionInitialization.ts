
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
      let sessionType: SessionType = 'due';
      let categoryNameToLoad: string | undefined = undefined;
      let cardIdsToLoad: number[] | undefined = undefined;

      const params = new URLSearchParams(location.search);
      const specificCardIdsParam = params.get('card_ids');

      if (specificCardIdsParam) {
        sessionType = 'specific_ids';
        cardIdsToLoad = specificCardIdsParam.split(',').map(Number).filter(id => !isNaN(id));
      } else if (boxParam !== undefined) {
        sessionType = 'all';
      } else if (categoryIdentifiers.length > 0) {
        sessionType = 'category';
        categoryNameToLoad = categoryIdentifiers.join(',');
      } else if (practiceMode) {
        sessionType = 'guest';
        if (categoryIdentifiers.length > 0) categoryNameToLoad = categoryIdentifiers.join(',');
      }

      if (accessStatus === "allowed" || accessStatus === "no_selection" || (practiceMode && accessStatus !== "denied_auth")) {
        console.log(`Initializing session with type: ${sessionType}, category: ${categoryNameToLoad}, regulation: ${regulationParam}, cardIds: ${cardIdsToLoad}`);
        await initializeSession(sessionType, categoryNameToLoad, regulationParam, cardIdsToLoad);
      }
    };

    if (userId || practiceMode) {
      determineSessionTypeAndLoad();
    }
  }, [accessStatus, userId, practiceMode, categoryIdentifiers, regulationParam, boxParam, location.search, initializeSession]);

  return {};
}
