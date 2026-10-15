export const ARTWORK_FILTERS = ["isHighlight", "isOnView", "hasImages"] as const;

export type ArtworkFilter = (typeof ARTWORK_FILTERS)[number];
