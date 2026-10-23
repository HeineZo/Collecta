import { Skeleton } from "boneyard-js/react";
import type { Artwork } from "../../models/Artwork";
import { ArtworkFacts } from "./ArtworkFacts";
import { ArtworkGallery } from "./ArtworkGallery";
import { ArtworkHeader } from "./ArtworkHeader";
import { ArtworkOrigin } from "./ArtworkOrigin";
import { ArtworkTags } from "./ArtworkTags";
import { ExternalLinkButton } from "../common/ExternalLinkButton";

const LAYOUT_CLASS =
  "artwork-detail flex flex-wrap items-start gap-8 md:gap-14";
const GALLERY_COLUMN_CLASS = "min-w-0 flex-[1_1_480px] md:max-w-[560px]";
const INFO_COLUMN_CLASS =
  "artwork-detail__info flex min-w-0 flex-[1_1_420px] flex-col gap-8 md:gap-10";

export function ArtworkDetailView({
  artwork,
}: {
  artwork: Artwork | undefined;
}) {
  return (
    <Skeleton
      name="artwork-detail"
      loading={!artwork}
      fixture={<ArtworkDetailFixture />}
      select="viewport"
      className="mt-6 md:mt-8"
    >
      {artwork && (
        <div className={LAYOUT_CLASS}>
          <ArtworkGallery
            key={artwork.objectID}
            title={artwork.title}
            viewTransitionName={`artwork-image-${artwork.objectID}`}
            imageUrls={[
              artwork.primaryImage,
              ...artwork.additionalImages,
            ].filter(Boolean)}
            className={`${GALLERY_COLUMN_CLASS} xl:sticky xl:top-28`}
          />
          <article className={INFO_COLUMN_CLASS}>
            <ArtworkHeader artwork={artwork} />
            <ArtworkFacts artwork={artwork} />
            <ArtworkOrigin artwork={artwork} />
            <ArtworkTags tags={artwork.tags} />
            <ExternalLinkButton href={artwork.objectURL} className="self-start">
              View on metmuseum.org
            </ExternalLinkButton>
          </article>
        </div>
      )}
    </Skeleton>
  );
}

function ArtworkDetailFixture() {
  return (
    <div className={LAYOUT_CLASS}>
      <div className={`flex flex-col gap-4 ${GALLERY_COLUMN_CLASS}`}>
        <div className="aspect-[4/5] rounded-artwork" />
        <div className="flex h-[140px] items-center justify-center gap-2.5">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="h-[84px] w-16 shrink-0 rounded-[14px] md:h-[92px] md:w-[72px]"
            />
          ))}
        </div>
      </div>
      <div className={INFO_COLUMN_CLASS}>
        <div className="flex flex-col gap-3 md:gap-3.5">
          <div className="h-7 w-28 rounded-full" />
          {/* Two lines of title. */}
          <div className="h-[72px] rounded-2xl md:h-[108px]" />
          <div className="h-5 w-1/2 rounded-full" />
        </div>
        <div className="h-64 rounded-3xl" />
        <div className="h-12 w-56 rounded-full" />
      </div>
    </div>
  );
}
