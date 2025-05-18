
import React, { useEffect } from "react";
import { Routes, useLocation } from "react-router-dom";

// Import route definitions
import { mainRoutes } from "./routes/main-routes";
import { authRoutes } from "./routes/auth-routes";
import { userRoutes } from "./routes/user-routes";
import { adminRoutes } from "./routes/admin-routes";

export default function AppRoutes() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {mainRoutes}
      {authRoutes}
      {userRoutes}
      {adminRoutes}
    </Routes>
  );
}
