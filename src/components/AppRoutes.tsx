import { RouterProvider } from "@heroui/react";
import { useLayoutEffect, ViewTransition } from "react";
import { Route, Routes, useHref, useLocation, useNavigate } from "react-router";
import { restoreScroll } from "../lib/browserHistory";
import { ArtworkDetailPage } from "../pages/ArtworkDetailPage";
import { DepartmentArtworksPage } from "../pages/DepartmentArtworksPage";
import { DepartmentListPage } from "../pages/DepartmentListPage";

export function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  useLayoutEffect(() => {
    restoreScroll(location.key);
  }, [location.key]);
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <ViewTransition key={location.pathname}>
        <Routes>
          <Route path="/" element={<DepartmentListPage />} />
          <Route path="/departments/:departmentId" element={<DepartmentArtworksPage />} />
          <Route path="/departments/:departmentId/artworks/:objectId" element={<ArtworkDetailPage />} />
        </Routes>
      </ViewTransition>
    </RouterProvider>
  );
}
