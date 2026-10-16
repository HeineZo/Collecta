import { motion } from "motion/react";
import { ViewTransition } from "react";
import { Link } from "react-router";
import { useMagnetic } from "../hooks/useMagnetic";
import { useMuseumObject } from "../hooks/useMuseumObject";
import { formatArtworkOrigin } from "../lib/formatArtworkOrigin";
import { NoImageNotice } from "./NoImageNotice";
import { ParallaxImage } from "./ParallaxImage";

export function ArtworkCard({ objectId }: { objectId: number }) {
  const { data: artwork } = useMuseumObject(objectId);
  const origin = artwork && formatArtworkOrigin(artwork);
  const { x, y, onPointerMove, onPointerLeave } = useMagnetic();

  return (
    <Link
      to={`artworks/${objectId}`}
      className="artwork-card mb-5 block md:mb-7"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div style={{ x, y }}>
        {artwork?.primaryImageSmall ? (
          <ViewTransition name={`artwork-image-${objectId}`} share="artwork-image" default="none">
            <ParallaxImage
              src={artwork.primaryImageSmall}
              alt={artwork.title}
              className="artwork-card__frame rounded-artwork bg-surface-tertiary"
              imageClassName="artwork-card__image min-h-40"
            />
          </ViewTransition>
        ) : artwork ? (
          <NoImageNotice className="artwork-card__no-image aspect-[4/5] rounded-artwork bg-surface-tertiary text-muted" />
        ) : (
          <div className="artwork-card__loading aspect-[4/5] rounded-artwork bg-surface-tertiary" />
        )}
        {artwork && (
          <div className="artwork-card__caption mt-3 flex flex-col gap-1">
            <h2 className="line-clamp-2 text-[15px] font-medium leading-tight md:text-base">{artwork.title}</h2>
            {origin && <p className="text-[13px] text-muted md:text-sm">{origin}</p>}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
