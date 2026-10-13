import type { ArtworkFilter } from "../models/ArtworkFilter";
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

interface DepartmentSearchOptions {
  searchQuery?: string;
  filters?: ArtworkFilter[];
  offset?: number;
  limit: number;
}

export function searchDepartmentObjects(
  departmentId: number,
  { searchQuery = "", filters = [], offset = 0, limit }: DepartmentSearchOptions,
): Promise<SearchResult> {
  const params = new URLSearchParams({
    q: searchQuery.trim() || "*",
    departmentId: String(departmentId),
    limit: String(limit),
    offset: String(offset),
  });
  for (const filter of filters) params.set(filter, "true");
  return fetchJson<SearchResult>(`/v1.1/search?${params}`);
}
