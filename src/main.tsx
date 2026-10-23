import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router";
import { SWRConfig } from "swr";
import "./bones/registry";
import { AppRoutes } from "./router/AppRoutes";
import { browserHistory } from "./router/browserHistory";
import "./index.css";

// Flag set by `npm run bones` (boneyard's headless capture) in the page it snapshots.
const isSkeletonCapture = () =>
  (window as { __BONEYARD_BUILD?: boolean }).__BONEYARD_BUILD === true;

const swrConfig = {
  /* The collection rarely changes: cached data is reused rather than refetched, sparing the Met's rate limit. */
  revalidateOnFocus: false,
  revalidateIfStale: false,
  errorRetryCount: 1,
  isPaused: isSkeletonCapture,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={swrConfig}>
      <HistoryRouter history={browserHistory}>
        <AppRoutes />
      </HistoryRouter>
    </SWRConfig>
  </StrictMode>,
);
