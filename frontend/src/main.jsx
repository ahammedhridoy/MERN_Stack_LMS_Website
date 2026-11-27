import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import MissingKeyNotice from "./components/common/MissingKeyNotice.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const rootElement = document.getElementById("root");

if (!PUBLISHABLE_KEY) {
  createRoot(rootElement).render(
    <StrictMode>
      <MissingKeyNotice />
    </StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={"/"}>
        <AppProvider>
          <App />
        </AppProvider>
      </ClerkProvider>
    </BrowserRouter>
  );
}
