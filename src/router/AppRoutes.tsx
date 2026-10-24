import { RouterProvider } from "@heroui/react";
import { useLayoutEffect, ViewTransition } from "react";
import { NavigationType, Route, Routes, useHref, useLocation, useNavigate, useNavigationType } from "react-router";
import { restoreScroll } from "./browserHistory";
import { ArtworkDetailPage } from "../pages/ArtworkDetailPage";
import { DepartmentArtworksPage } from "../pages/DepartmentArtworksPage";
import { DepartmentListPage } from "../pages/DepartmentListPage";
import { InsightsPage } from "../pages/InsightsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  useLayoutEffect(() => {
    // Filters kept in the URL replace the entry: the page must stay where it is.
    if (navigationType === NavigationType.Replace) return;
    restoreScroll(location.key);
    if (location.key !== "default") document.querySelector("main")?.focus({ preventScroll: true });
  }, [location.key, navigationType]);
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <ViewTransition key={location.pathname}>
        <Routes>
          <Route path="/" element={<DepartmentListPage />} />
          <Route path="/departments/:departmentId" element={<DepartmentArtworksPage />} />
          <Route path="/departments/:departmentId/artworks/:artworkId" element={<ArtworkDetailPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ViewTransition>
    </RouterProvider>
  );
}
