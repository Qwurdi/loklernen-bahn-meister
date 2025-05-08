
/**
 * Builds a filter string for category queries based on provided identifiers
 * which can be category IDs or names
 */
export function buildCategoryFilter(categoryIdentifiers: string | string[]): string {
  const identifiersArray = Array.isArray(categoryIdentifiers) ? categoryIdentifiers : [categoryIdentifiers];
  if (identifiersArray.length === 0) {
    return ""; 
  }

  const ids: string[] = [];
  const names: string[] = [];

  identifiersArray.forEach(idOrName => {
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(idOrName)) {
      ids.push(idOrName);
    } else {
      names.push(idOrName);
    }
  });

  const filterParts: string[] = [];
  if (ids.length > 0) {
    filterParts.push(`category_id.in.(${ids.map(id => `"${id}"`).join(',')})`);
  }
  if (names.length > 0) {
    filterParts.push(`category.in.(${names.map(name => `"${name}"`).join(',')})`);
  }
  
  return filterParts.join(',');
}
