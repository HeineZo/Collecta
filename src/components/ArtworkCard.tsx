import { Link } from "react-router";
import { useMuseumObject } from "../hooks/useMuseumObject";
import { formatArtworkOrigin } from "../lib/formatArtworkOrigin";
import { NoImageNotice } from "./NoImageNotice";

export function ArtworkCard({ objectId }: { objectId: number }) {
  const { data: artwork } = useMuseumObject(objectId);
  const origin = artwork && formatArtworkOrigin(artwork);

  return (
    <Link to={`artworks/${objectId}`} className="artwork-card mb-5 block md:mb-7">
      {artwork?.primaryImageSmall ? (
        <img
          src={artwork.primaryImageSmall}
          alt={artwork.title}
          loading="lazy"
          className="artwork-card__image min-h-40 w-full rounded-[20px] bg-surface-tertiary object-cover"
        />
      ) : artwork ? (
        <NoImageNotice className="artwork-card__no-image aspect-[4/5] rounded-[20px] bg-surface-tertiary text-muted" />
      ) : (
        <div className="artwork-card__loading aspect-[4/5] rounded-[20px] bg-surface-tertiary" />
      )}
      {artwork && (
        <div className="artwork-card__caption mt-3 flex flex-col gap-1">
          <h2 className="line-clamp-2 text-[15px] font-medium leading-tight md:text-base">{artwork.title}</h2>
          {origin && <p className="text-[13px] text-muted md:text-sm">{origin}</p>}
        </div>
      )}
    </Link>
  );
}
