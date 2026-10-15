import useSWR, { type SWRConfiguration } from "swr";
import { fetchMuseumObject } from "../api/objectsApi";

// Shared cache key: an artwork loaded by its card is shown instantly on its detail page.
export function useMuseumObject(objectId: number | null | undefined, config?: SWRConfiguration) {
  return useSWR(objectId ? ["museum-object", objectId] : null, ([, id]) => fetchMuseumObject(id), config);
}
