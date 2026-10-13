import useSWRInfinite from "swr/infinite";
import { searchDepartmentObjects } from "../api/departmentsApi";
import type { ArtworkFilter } from "../models/ArtworkFilter";

const PAGE_SIZE = 20;
const AUTO_LOAD_PAGE_LIMIT = 3;

export function useDepartmentArtworks(departmentId: number, searchQuery: string, filters: ArtworkFilter[]) {
  const artworksQuery = useSWRInfinite(
    (pageIndex) => ["department-artworks", departmentId, searchQuery, filters, pageIndex] as const,
    ([, , query, activeFilters, pageIndex]) =>
      searchDepartmentObjects(departmentId, {
        searchQuery: query,
        filters: activeFilters,
        offset: pageIndex * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { revalidateFirstPage: false },
  );
  const { data: pages, size: pageCount, setSize: setPageCount } = artworksQuery;
  const objectIds = pages?.flatMap((page) => page.objectIDs ?? []);
  const resultCount = pages?.[0].total ?? 0;

  return {
    objectIds,
    resultCount,
    hasMore: (objectIds?.length ?? 0) < resultCount,
    isLoadingMore: artworksQuery.isLoading || (pages !== undefined && pages.length < pageCount),
    canAutoLoad: pageCount < AUTO_LOAD_PAGE_LIMIT,
    loadMore: () => void setPageCount(pageCount + 1),
    hasError: Boolean(artworksQuery.error),
    retry: () => void artworksQuery.mutate(),
  };
}
