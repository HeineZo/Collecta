import useSWR from "swr";
import { fetchCollectionCount } from "../api/collectionSearchApi";
import type { CollectionQuery } from "../models/CollectionQuery";

export function useCollectionCounts(queries: CollectionQuery[] | null) {
  const countsQuery = useSWR(
    queries && ["collection-counts", JSON.stringify(queries)],
    () => Promise.all(queries!.map(fetchCollectionCount)),
    // When the queries change, the previous counts stay shown so charts animate to the new ones.
    { keepPreviousData: true },
  );

  return {
    counts: countsQuery.data,
    isRefreshing: countsQuery.isValidating,
    hasError: Boolean(countsQuery.error),
    retry: () => void countsQuery.mutate(),
  };
}
