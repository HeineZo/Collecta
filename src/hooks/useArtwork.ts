import useSWR, { type SWRConfiguration } from "swr";
import { fetchArtwork } from "../api/artworksApi";

// Shared cache key: an artwork loaded by its card is shown instantly on its detail page.
export function useArtwork(artworkId: number | null | undefined, config?: SWRConfiguration) {
  return useSWR(artworkId === null || artworkId === undefined ? null : ["artwork", artworkId],([, id]) => fetchArtwork(id), config);
}
