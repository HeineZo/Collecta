import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ViewTransition } from "react";
import { Link } from "react-router";
import { formatNumber } from "../lib/formatNumber";
import type { MuseumObject } from "../models/MuseumObject";

const CURRENT_YEAR = new Date().getFullYear();
const CARD_CLASS = "oldest-artwork-card relative flex min-h-64 flex-col justify-end overflow-hidden rounded-artwork border border-border";

interface OldestArtworkCardProps {
  departmentId: number;
  artwork: MuseumObject | null | undefined;
}

export function OldestArtworkCard({ departmentId, artwork }: OldestArtworkCardProps) {
  const reduceMotion = useReducedMotion();
  if (!artwork) {
    return (
      <div className={`${CARD_CLASS} bg-surface p-4`}>
        <OldestArtworkLabel className="bg-default text-muted" />
        {artwork === null && <p className="text-muted">No dated work with an image.</p>}
      </div>
    );
  }

  const age = CURRENT_YEAR - artwork.objectEndDate;
  const hasImage = Boolean(artwork.primaryImageSmall);

  return (
    <Link
      to={`/departments/${departmentId}/artworks/${artwork.objectID}`}
      className={`${CARD_CLASS} group bg-surface ${hasImage ? "text-white" : "text-foreground"}`}
    >
      <AnimatePresence initial={false}>
        {hasImage && (
          <motion.div
            key={artwork.objectID}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
          >
            <ViewTransition name={`artwork-image-${artwork.objectID}`} share="artwork-image">
              <img
                src={artwork.primaryImageSmall}
                alt=""
                className="oldest-artwork-card__image absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
            </ViewTransition>
          </motion.div>
        )}
      </AnimatePresence>
      {hasImage && (
        <div aria-hidden className="oldest-artwork-card__overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      )}
      <OldestArtworkLabel
        className={`oldest-artwork-card__overlay ${hasImage ? "bg-black/45 text-white backdrop-blur-sm" : "bg-default text-muted"}`}
      />
      <div className="oldest-artwork-card__caption oldest-artwork-card__overlay relative flex flex-col gap-1 p-4">
        <p className="text-5xl font-bold leading-none tracking-tight tabular-nums">{formatNumber(age)}+</p>
        <p className="line-clamp-2 text-sm font-medium">years old · {artwork.title}</p>
        {artwork.objectDate && (
          <p className={`font-mono text-xs ${hasImage ? "text-white/70" : "text-muted"}`}>{artwork.objectDate}</p>
        )}
      </div>
    </Link>
  );
}

function OldestArtworkLabel({ className }: { className: string }) {
  return (
    <p className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      One of its oldest works
    </p>
  );
}
