import type { ArtworkFilter } from "../models/ArtworkFilter";
import type { Department } from "../models/Department";
import type { DepartmentListResult } from "../models/DepartmentListResult";
import type { SearchResult } from "../models/SearchResult";
import { searchCollection } from "./collectionSearchApi";
import { fetchJson } from "./metMuseumClient";

export async function fetchDepartments(): Promise<Department[]> {
  const result = await fetchJson<DepartmentListResult>("/v1/departments");
  return result.departments;
}

export async function fetchDepartmentHighlightId(
  departmentId: number,
): Promise<number | null> {
  const result = await searchCollection({ departmentId, isHighlight: true, hasImages: true });
  return result.objectIDs?.[0] ?? null;
}

interface DepartmentSearchOptions {
  searchQuery?: string;
  filters?: ArtworkFilter[];
  offset?: number;
  limit: number;
}

export function searchDepartmentArtworks(
  departmentId: number,
  { searchQuery = "", filters = [], offset = 0, limit }: DepartmentSearchOptions,
): Promise<SearchResult> {
  const filterQuery = Object.fromEntries(filters.map((filter) => [filter, true]));
  return searchCollection({ ...filterQuery, q: searchQuery.trim() || "*", departmentId }, limit, offset);
}
