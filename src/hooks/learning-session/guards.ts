
import { RegulationFilterType } from '@/types/regulation';

export function validateRegulation(value: string | null): RegulationFilterType {
  if (!value) return 'all';
  
  const decoded = decodeURIComponent(value);
  
  switch (decoded) {
    case 'DS 301':
    case 'DV 301':
    case 'both':
      return decoded;
    default:
      return 'all';
  }
}

export function validateCategory(value: string | null): 'Signale' | 'Betriebsdienst' | null {
  if (!value) return null;
  
  const decoded = decodeURIComponent(value);
  
  if (decoded === 'Signale' || decoded === 'Betriebsdienst') {
    return decoded;
  }
  
  return null;
}

export function validateMode(value: string | null): 'review' | 'practice' | 'boxes' {
  if (!value) return 'review';
  
  switch (value) {
    case 'practice':
    case 'boxes':
      return value;
    default:
      return 'review';
  }
}

export function validateBoxNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  
  const num = parseInt(value, 10);
  return isNaN(num) || num < 1 || num > 5 ? undefined : num;
}
