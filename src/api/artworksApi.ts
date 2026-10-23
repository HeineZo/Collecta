import type { Artwork } from "../models/Artwork";
import { fetchJson } from "./metMuseumClient";

export function fetchArtwork(artworkId: number): Promise<Artwork> {
  return fetchJson<Artwork>(`/v1/objects/${artworkId}`);
}
