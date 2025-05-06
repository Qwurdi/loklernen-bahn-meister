
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.css";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

console.log("Main: Starting application initialization");

// Detect any existing router instances (debugging)
const anyExistingRouter = document.querySelector('[data-reactroot]') !== null;
if (anyExistingRouter) {
  console.warn("Warning: Detected existing React root element before initialization");
}

console.log("Main: Creating React root element");
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found, cannot mount application");
} else {
  console.log("Main: Setting up single BrowserRouter instance");
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log("Main: Application rendered successfully");
}
