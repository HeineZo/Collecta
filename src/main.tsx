import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { SWRConfig } from "swr";
import "./bones/registry";
import { AppRoutes } from "./components/AppRoutes";
import "./index.css";

// Flag set by `npm run bones` (boneyard's headless capture) in the page it snapshots.
const isSkeletonCapture = () => (window as { __BONEYARD_BUILD?: boolean }).__BONEYARD_BUILD === true;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ revalidateOnFocus: false, errorRetryCount: 1, isPaused: isSkeletonCapture }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SWRConfig>
  </StrictMode>,
);
