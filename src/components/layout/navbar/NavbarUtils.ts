
export const defaultNavItems = [
  { name: "Karteikarten", path: "/karteikarten" },
  { name: "Fortschritt", path: "/fortschritt" },
];

export const getPreviousPath = (currentPath: string): string => {
  // Map common paths to their logical previous paths
  const pathMap: { [key: string]: string } = {
    '/karteikarten/lernen': '/karteikarten',
    '/fortschritt': '/',
    '/einstellungen': '/',
    '/dashboard': '/',
    '/login': '/',
    '/register': '/',
  };

  return pathMap[currentPath] || '/';
};
