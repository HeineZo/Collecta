import type { Department } from "../models/Department";
import type { DepartmentListResult } from "../models/DepartmentListResult";
import type { SearchResult } from "../models/SearchResult";
import { fetchJson } from "./metMuseumClient";

export async function fetchDepartments(): Promise<Department[]> {
  const result = await fetchJson<DepartmentListResult>("/v1/departments");
  return result.departments;
}

export async function fetchDepartmentTotal(
  departmentId: number,
): Promise<number> {
  const result = await fetchJson<SearchResult>(
    `/v1.1/search?q=*&departmentId=${departmentId}&limit=1`,
  );
  return result.total;
}

export async function fetchDepartmentHighlightId(
  departmentId: number,
): Promise<number | null> {
  const result = await fetchJson<SearchResult>(
    `/v1.1/search?q=*&departmentId=${departmentId}&isHighlight=true&hasImages=true&limit=1`,
  );
  return result.objectIDs?.[0] ?? null;
}
