
export const getPreviousPath = (pathname: string): string => {
  if (pathname.includes("/karteikarten/lernen")) return "/karteikarten";
  if (pathname.includes("/karteikarten/signale/")) return "/karteikarten";
  if (pathname.includes("/karteikarten/betriebsdienst/")) return "/karteikarten/betriebsdienst";
  return "/";
};

export const defaultNavItems = [
  { 
    name: "Home", 
    path: "/", 
  },
  { 
    name: "Karteikarten", 
    path: "/karteikarten", 
  },
  { 
    name: "Fortschritt", 
    path: "/fortschritt", 
    requiresAuth: true
  },
  { 
    name: "Einstellungen", 
    path: "/einstellungen", 
    requiresAuth: true
  }
];
