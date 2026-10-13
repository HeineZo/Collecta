import type { MuseumObject } from "../models/MuseumObject";

// "Greek, Attic · ca. 590–580 BCE"; empty when the Met gives neither.
export const formatArtworkOrigin = (artwork: Pick<MuseumObject, "culture" | "objectDate">) =>
  [artwork.culture, artwork.objectDate].filter(Boolean).join(" · ");
