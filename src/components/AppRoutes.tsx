import { RouterProvider } from "@heroui/react";
import { Route, Routes, useHref, useNavigate } from "react-router";
import { DepartmentArtworksPage } from "../pages/DepartmentArtworksPage";
import { DepartmentListPage } from "../pages/DepartmentListPage";

export function AppRoutes() {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <Routes>
        <Route path="/" element={<DepartmentListPage />} />
        <Route path="/departments/:departmentId" element={<DepartmentArtworksPage />} />
      </Routes>
    </RouterProvider>
  );
}
