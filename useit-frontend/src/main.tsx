import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./index.css";
import "./style.css";
import { AuthProvider } from "./Components/AuthContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
