import { RouterProvider } from "@heroui/react";
import { useLayoutEffect, ViewTransition } from "react";
import { NavigationType, Route, Routes, useHref, useLocation, useNavigate, useNavigationType } from "react-router";
import { restoreScroll } from "../lib/browserHistory";
import { ArtworkDetailPage } from "../pages/ArtworkDetailPage";
import { DepartmentArtworksPage } from "../pages/DepartmentArtworksPage";
import { DepartmentListPage } from "../pages/DepartmentListPage";
import { InsightsPage } from "../pages/InsightsPage";

export function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  useLayoutEffect(() => {
    // Filters kept in the URL replace the entry: the page must stay where it is.
    if (navigationType !== NavigationType.Replace) restoreScroll(location.key);
  }, [location.key, navigationType]);
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <ViewTransition key={location.pathname}>
        <Routes>
          <Route path="/" element={<DepartmentListPage />} />
          <Route path="/departments/:departmentId" element={<DepartmentArtworksPage />} />
          <Route path="/departments/:departmentId/artworks/:objectId" element={<ArtworkDetailPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Routes>
      </ViewTransition>
    </RouterProvider>
  );
}
