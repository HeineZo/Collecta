import useSWR from "swr";
import { findOldestArtworkId } from "../api/collectionSearchApi";
import { useArtwork } from "./useArtwork";

const KEEP_PREVIOUS = { keepPreviousData: true };

export function useOldestArtwork(departmentId: number) {
  const artworkIdQuery = useSWR(["oldest-artwork-id", departmentId], () => findOldestArtworkId(departmentId), KEEP_PREVIOUS);
  const artworkQuery = useArtwork(artworkIdQuery.data, KEEP_PREVIOUS);

  return {
    artwork: artworkQuery.data,
    artworkId: artworkIdQuery.data,
    isRefreshing: artworkIdQuery.isValidating || artworkQuery.isValidating,
    hasError: Boolean(artworkIdQuery.error || artworkQuery.error),
    retry: () => {
      void artworkIdQuery.mutate();
      void artworkQuery.mutate();
    },
  };
}
