
import { COLORS } from './constants';
import { QuestionCategory } from '@/types/questions';

/**
 * Extract signal category abbreviation from sub_category text
 * Examples: "Hp 0 (Halt)" -> "Hp", "El 6" -> "El", "Zs 1" -> "Zs"
 */
export function extractSignalCategory(subCategory: string): string {
  // Match common signal abbreviations at the start of the string
  const signalPattern = /^(Hp|Vr|Ks|El|Zs|Lf|Sh|Ra|Wn|So|Ne|Bü|Bl|Zg)\b/i;
  const match = subCategory.match(signalPattern);
  return match ? match[1] : 'default';
}

/**
 * Extract Betriebsdienst category from sub_category text
 * Maps various subcategory names to color categories
 */
export function extractBetriebsdienstCategory(subCategory: string): string {
  const category = subCategory.toLowerCase();
  
  if (category.includes('grundlagen') || category.includes('bahnbetrieb')) {
    return 'grundlagen';
  }
  if (category.includes('uvv') || category.includes('arbeitsschutz') || category.includes('sicherheit')) {
    return 'uvv';
  }
  if (category.includes('rangier')) {
    return 'rangieren';
  }
  if (category.includes('fahren') || category.includes('züge')) {
    return 'fahren';
  }
  if (category.includes('pzb') || category.includes('sicherungsanlagen')) {
    return 'pzb';
  }
  if (category.includes('kommunikation') || category.includes('funk')) {
    return 'kommunikation';
  }
  if (category.includes('besonderheiten') || category.includes('spezial')) {
    return 'besonderheiten';
  }
  if (category.includes('unregelmäßig') || category.includes('störung') || category.includes('notfall')) {
    return 'unregelmäßigkeiten';
  }
  
  return 'default';
}

/**
 * Get border color for a question based on its category and subcategory
 */
export function getCategoryBorderColor(category: QuestionCategory, subCategory: string): [number, number, number] {
  if (category === 'Signale') {
    const signalCategory = extractSignalCategory(subCategory);
    const color = COLORS.signalCategories[signalCategory as keyof typeof COLORS.signalCategories];
    return color ? color as [number, number, number] : COLORS.signalCategories.default as [number, number, number];
  } else if (category === 'Betriebsdienst') {
    const betriebsCategory = extractBetriebsdienstCategory(subCategory);
    const color = COLORS.betriebsdienstCategories[betriebsCategory as keyof typeof COLORS.betriebsdienstCategories];
    return color ? color as [number, number, number] : COLORS.betriebsdienstCategories.default as [number, number, number];
  }
  
  return COLORS.borders.card as [number, number, number];
}
