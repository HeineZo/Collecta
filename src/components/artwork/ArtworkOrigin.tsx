import { lazy, Suspense } from "react";
import { findArtworkLocation } from "../../data/artworkLocations";
import type { Artwork } from "../../models/Artwork";
import { InfoSection } from "../common/InfoSection";

const ArtworkOriginMap = lazy(() =>
  import("./ArtworkOriginMap").then((module) => ({ default: module.ArtworkOriginMap })),
);

export function ArtworkOrigin({ artwork }: { artwork: Artwork }) {
  const location = findArtworkLocation(artwork);
  if (!location) return null;

  return (
    <InfoSection title="Where it was made" className="artwork-origin">
      <Suspense fallback={<div className="h-[200px] rounded-3xl bg-surface-tertiary md:h-[240px]" />}>
        <ArtworkOriginMap location={location} />
      </Suspense>
      <p className="text-[13px] text-muted md:text-sm">
        Approximate location, based on the {location.basis} “{location.basisValue}”.
      </p>
    </InfoSection>
  );
}
