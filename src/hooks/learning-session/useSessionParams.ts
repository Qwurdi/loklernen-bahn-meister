import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useRegulationFilter } from "@/hooks/useRegulationFilter";

interface SessionParams {
  category?: string | null;
  subcategory?: string | null;
  regulation?: string | null;
  mode?: string | null;
  box?: number | null;
}

export function useSessionParams() {
  const [searchParams] = useSearchParams();
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
    box: boxParam ? parseInt(boxParam) : undefined
  }), [normalizedCategory, subcategoryParam, regulationParam, modeParam, boxParam]);

  const isDueCardsView = !categoryParam && !subcategoryParam;

  return {
    ...sessionParams,
    isDueCardsView,
    stripRegulationInfo
  };
}
