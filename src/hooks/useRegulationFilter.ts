
import { RegulationFilterType } from '@/types/regulation';

export function useRegulationFilter() {
  const stripRegulationInfo = (name: string): string => {
    // Remove regulation prefixes from category names
    return name
      .replace(/^(DS 301|DV 301)\s*[-–]\s*/i, '')
      .replace(/\s*\((DS 301|DV 301)\)$/i, '')
      .trim();
  };

  const getRegulationFromName = (name: string): RegulationFilterType => {
    if (name.includes('DS 301')) return 'DS 301';
    if (name.includes('DV 301')) return 'DV 301';
    return 'all';
  };

  return {
    stripRegulationInfo,
    getRegulationFromName
  };
}
