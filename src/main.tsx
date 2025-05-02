
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.css";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
