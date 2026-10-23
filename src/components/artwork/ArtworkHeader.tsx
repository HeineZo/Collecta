import { formatArtworkOrigin } from "../../lib/formatArtworkOrigin";
import type { Artwork } from "../../models/Artwork";
import { HighlightBadge } from "./HighlightBadge";

export function ArtworkHeader({ artwork }: { artwork: Artwork }) {
  const origin = formatArtworkOrigin(artwork);
  return (
    <header className="artwork-header flex flex-col gap-3 md:gap-3.5">
      {(artwork.isHighlight || artwork.GalleryNumber) && (
        <div className="flex items-center gap-3">
          {artwork.isHighlight && <HighlightBadge />}
          {artwork.GalleryNumber && <span className="text-sm text-muted">Gallery {artwork.GalleryNumber}</span>}
        </div>
      )}
      <h1 className="text-[34px] leading-[1.06] tracking-[-0.03em] md:text-[52px] md:tracking-[-0.035em]">
        {artwork.title}
      </h1>
      {origin && <p className="text-[15px] md:text-lg">{origin}</p>}
    </header>
  );
}
