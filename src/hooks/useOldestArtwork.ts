import useSWR from "swr";
import { findOldestObjectId } from "../api/collectionSearchApi";
import { useMuseumObject } from "./useMuseumObject";

const KEEP_PREVIOUS = { keepPreviousData: true };

export function useOldestArtwork(departmentId: number) {
  const objectIdQuery = useSWR(["oldest-object-id", departmentId], () => findOldestObjectId(departmentId), KEEP_PREVIOUS);
  const objectQuery = useMuseumObject(objectIdQuery.data, KEEP_PREVIOUS);

  return {
    artwork: objectQuery.data,
    objectId: objectIdQuery.data,
    isRefreshing: objectIdQuery.isValidating || objectQuery.isValidating,
    hasError: Boolean(objectIdQuery.error || objectQuery.error),
    retry: () => {
      void objectIdQuery.mutate();
      void objectQuery.mutate();
    },
  };
}
