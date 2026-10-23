import type { CollectionQuery } from "../models/CollectionQuery";
import type { SearchResult } from "../models/SearchResult";
import { fetchJson } from "./metMuseumClient";

// Oldest date the Met uses (prehistoric tools are dated in the hundreds of thousands of years BC).
export const EARLIEST_YEAR = -1_000_000;

export function searchCollection(query: CollectionQuery, limit = 1, offset = 0): Promise<SearchResult> {
  const params = new URLSearchParams({ q: "*", limit: String(limit), offset: String(offset) });
  for (const [key, value] of Object.entries(query)) params.set(key, String(value));
  return fetchJson<SearchResult>(`/v1.1/search?${params}`);
}

const counts = new Map<string, Promise<number>>();

export function fetchCollectionCount(query: CollectionQuery): Promise<number> {
  const key = JSON.stringify(query);
  let count = counts.get(key);
  if (!count) {
    count = searchCollection(query).then((result) => result.total);
    counts.set(key, count);
    count.catch(() => counts.delete(key));
  }
  return count;
}

// The search cannot sort by date: ever-later cut-off years are probed until one holds a work.
// The work returned is among the oldest of its department, not necessarily the very oldest.
const OLDEST_WORK_CUTOFF_YEARS = [-10000, -3000, -1000, -1, 1000, 1500, 1700, 1800, 1900, 2100];

export async function findOldestArtworkId(departmentId: number): Promise<number | null> {
  for (const cutoffYear of OLDEST_WORK_CUTOFF_YEARS) {
    const result = await searchCollection({
      departmentId,
      hasImages: true,
      // Undated works are stored as 0–0: windows after year 0 start at year 1 to leave them out.
      dateBegin: cutoffYear < 0 ? EARLIEST_YEAR : 1,
      dateEnd: cutoffYear,
    });
    const artworkId = result.objectIDs?.[0];
    if (artworkId) return artworkId;
  }
  return null;
}
