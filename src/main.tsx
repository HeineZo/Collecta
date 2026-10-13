import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import "./bones/registry";
import "./index.css";
import { DepartmentListPage } from "./pages/DepartmentListPage";

// Flag set by `npm run bones` (boneyard's headless capture) in the page it snapshots.
const isSkeletonCapture = () => (window as { __BONEYARD_BUILD?: boolean }).__BONEYARD_BUILD === true;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* The boneyard capture only needs the skeleton fixtures: pausing SWR keeps it from flooding the Met API. */}
    <SWRConfig value={{ revalidateOnFocus: false, errorRetryCount: 1, isPaused: isSkeletonCapture }}>
      <DepartmentListPage />
    </SWRConfig>
  </StrictMode>,
);
