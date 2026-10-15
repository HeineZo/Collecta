import { useMemo } from "react";
import type { CollectionOverview } from "../models/CollectionOverview";
import { useCollectionCounts } from "./useCollectionCounts";

const OVERVIEW_QUERIES = [
  {},
  { isHighlight: true },
  { isOnView: true },
  { hasImages: true },
];

// The whole collection, or one department when an id is given
export function useCollectionOverview(departmentId: number | null = null) {
  const queries = useMemo(
    () => (departmentId === null ? OVERVIEW_QUERIES : OVERVIEW_QUERIES.map((query) => ({ departmentId, ...query }))),
    [departmentId],
  );
  const { counts, isRefreshing, hasError, retry } = useCollectionCounts(queries);
  const overview = useMemo<CollectionOverview | undefined>(() => {
    if (!counts) return undefined;
    const [totalWorks, highlights, onView, withImages] = counts;
    return { totalWorks, highlights, onView, withImages };
  }, [counts]);

  return { overview, isRefreshing, hasError, retry };
}
