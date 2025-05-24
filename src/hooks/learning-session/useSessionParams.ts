
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useRegulationFilter } from "@/hooks/useRegulationFilter";

interface SessionParams {
  category?: string | null;
  subcategory?: string | null;
  regulation?: string | null;
  mode?: string | null;
  box?: number | null;
  regulationParam?: string | null;
  searchParams?: URLSearchParams;
  mainCategoryForHook?: string | null;
  subCategoryParam?: string | null;
  setRegulationFilter?: (value: string) => void;
  categoryParam?: string | null;
  sessionTitle?: string;
  isDueCardsView: boolean;
  boxParam?: string | null;
  stripRegulationInfo?: (name: string) => string;
}

export function useSessionParams(): SessionParams {
  const [searchParams, setSearchParams] = useSearchParams();
  const { stripRegulationInfo } = useRegulationFilter();
  
  // Updated to use unified parameter structure
  const categoryParam = searchParams.get('category') || searchParams.get('parent_category');
  const subcategoryParam = searchParams.get('subcategory') || searchParams.get('subcategory');
  const regulationParam = searchParams.get('regulation') || searchParams.get('regelwerk');
  const modeParam = searchParams.get('mode');
  const boxParam = searchParams.get('box');

  // Convert legacy format to new format
  const normalizedCategory = categoryParam ? stripRegulationInfo(categoryParam) : null;
  
  const sessionParams = useMemo(() => ({
    category: normalizedCategory,
    subcategory: subcategoryParam,
    regulation: regulationParam || 'all',
    mode: modeParam || 'review',
    box: boxParam ? parseInt(boxParam) : undefined,
    
    // Legacy compatibility fields
    regulationParam: regulationParam || 'all',
    searchParams,
    mainCategoryForHook: normalizedCategory,
    subCategoryParam: subcategoryParam,
    categoryParam,
    sessionTitle: subcategoryParam || normalizedCategory || 'Lerneinheit',
    boxParam,
    stripRegulationInfo,
    
    setRegulationFilter: (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (value === 'all') {
        newSearchParams.delete('regulation');
      } else {
        newSearchParams.set('regulation', value);
      }
      setSearchParams(newSearchParams);
    }
  }), [normalizedCategory, subcategoryParam, regulationParam, modeParam, boxParam, categoryParam, searchParams, setSearchParams, stripRegulationInfo]);

  const isDueCardsView = !categoryParam && !subcategoryParam;

  return {
    ...sessionParams,
    isDueCardsView
  };
}
