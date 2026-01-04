import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthInit from "./poviders/AuthInit.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
  <BrowserRouter>
    <AuthInit>
      <App />
    </AuthInit>
  </BrowserRouter>
  </StrictMode>
);
