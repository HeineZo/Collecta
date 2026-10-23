import type { Artwork } from "../models/Artwork";

// "Greek, Attic · ca. 590–580 BCE"; empty when the Met gives neither.
export const formatArtworkOrigin = (artwork: Pick<Artwork, "culture" | "objectDate">) =>
  [artwork.culture, artwork.objectDate].filter(Boolean).join(" · ");
