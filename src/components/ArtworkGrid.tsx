import { Skeleton } from "boneyard-js/react";
import { ArtworkCard } from "./ArtworkCard";
import { MasonryGrid } from "./MasonryGrid";

const SKELETON_IMAGE_RATIOS = ["2 / 3", "4 / 5", "5 / 4", "4 / 5", "3 / 2", "2 / 3", "3 / 4", "1 / 1"];

interface ArtworkGridProps {
  objectIds: number[] | undefined;
  emptyMessage: string;
}

export function ArtworkGrid({ objectIds, emptyMessage }: ArtworkGridProps) {
  return (
    <Skeleton name="artwork-grid" loading={!objectIds} fixture={<ArtworkGridFixture />} select="viewport">
      {objectIds &&
        (objectIds.length > 0 ? (
          <MasonryGrid items={objectIds.map((objectId) => <ArtworkCard key={objectId} objectId={objectId} />)} />
        ) : (
          <p className="artwork-grid__empty text-muted">{emptyMessage}</p>
        ))}
    </Skeleton>
  );
}

function ArtworkGridFixture() {
  return (
    <MasonryGrid
      items={SKELETON_IMAGE_RATIOS.map((aspectRatio, index) => (
        <div key={index} className="mb-5 md:mb-7">
          <div className="rounded-[20px]" style={{ aspectRatio }} />
          <div className="mt-3 h-4 w-4/5 rounded-full" />
          <div className="mt-2 h-3.5 w-1/2 rounded-full" />
        </div>
      ))}
    />
  );
}
