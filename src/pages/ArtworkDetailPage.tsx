import { Breadcrumbs, Chip } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { Skeleton } from "boneyard-js/react";
import { ExternalLink, Star } from "lucide-react";
import { useParams } from "react-router";
import useSWR from "swr";
import { fetchMuseumObject } from "../api/objectsApi";
import { AppLayout } from "../components/AppLayout";
import { ArtworkGallery } from "../components/ArtworkGallery";
import { ErrorState } from "../components/ErrorState";
import type { MuseumObject } from "../models/MuseumObject";

const LAYOUT_CLASS = "artwork-detail__layout flex flex-wrap items-start gap-8 md:gap-14";
const GALLERY_COLUMN_CLASS = "min-w-0 flex-[1_1_480px] md:max-w-[560px]";
const INFO_COLUMN_CLASS = "artwork-detail__info flex min-w-0 flex-[1_1_420px] flex-col gap-8 md:gap-10";

export function ArtworkDetailPage() {
  const { departmentId, objectId } = useParams();
  const artworkQuery = useSWR(["museum-object", Number(objectId)], ([, id]) => fetchMuseumObject(id));
  const artwork = artworkQuery.data;

  return (
    <AppLayout>
      <Breadcrumbs className="artwork-detail__breadcrumbs flex-wrap">
        <Breadcrumbs.Item href="/">Departments</Breadcrumbs.Item>
        <Breadcrumbs.Item href={`/departments/${departmentId}`}>{artwork?.department}</Breadcrumbs.Item>
        <Breadcrumbs.Item className="shrink">{artwork?.title}</Breadcrumbs.Item>
      </Breadcrumbs>

      {artworkQuery.error ? (
        <ErrorState
          message="This artwork could not be loaded from the Met collection."
          onRetry={() => void artworkQuery.mutate()}
        />
      ) : (
        <Skeleton
          name="artwork-detail"
          loading={!artwork}
          fixture={<ArtworkDetailFixture />}
          select="viewport"
          className="mt-6 md:mt-8"
        >
          {artwork && <ArtworkDetail artwork={artwork} />}
        </Skeleton>
      )}
    </AppLayout>
  );
}

function ArtworkDetail({ artwork }: { artwork: MuseumObject }) {
  const origin = [artwork.culture, artwork.objectDate].filter(Boolean).join(" · ");
  const imageUrls = [artwork.primaryImage, ...artwork.additionalImages].filter(Boolean);
  const facts = [
    ["Period", artwork.period],
    ["Medium", artwork.medium],
    ["Classification", artwork.classification],
    // The Met lists every measurement on its own line; the first one is the overall size.
    ["Dimensions", artwork.dimensions.split(/\r?\n/)[0]],
    ["Accession no.", artwork.accessionNumber],
    ["Credit", artwork.creditLine],
  ].filter(([, value]) => value);
  const tags = artwork.tags ?? [];

  return (
    <div className={LAYOUT_CLASS}>
      <ArtworkGallery
        key={artwork.objectID}
        title={artwork.title}
        imageUrls={imageUrls}
        className={GALLERY_COLUMN_CLASS}
      />

      <article className={INFO_COLUMN_CLASS}>
        <header className="flex flex-col gap-3 md:gap-3.5">
          {(artwork.isHighlight || artwork.GalleryNumber) && (
            <div className="flex items-center gap-3">
              {artwork.isHighlight && (
                <Chip className="artwork-detail__highlight bg-(--highlight-background) text-(--highlight)">
                  <Star aria-hidden fill="currentColor" className="size-3.5" />
                  Highlight
                </Chip>
              )}
              {artwork.GalleryNumber && <span className="text-sm text-muted">Gallery {artwork.GalleryNumber}</span>}
            </div>
          )}
          <h1 className="text-[34px] leading-[1.06] tracking-[-0.03em] md:text-[52px] md:tracking-[-0.035em]">
            {artwork.title}
          </h1>
          {origin && <p className="text-[15px] md:text-lg">{origin}</p>}
        </header>

        {facts.length > 0 && (
          <section className="artwork-detail__facts flex flex-col gap-3 md:gap-3.5">
            <h2 className="text-xl font-medium tracking-tight md:text-[22px]">Details</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-3xl bg-surface p-5 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:p-6">
              {facts.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="text-[13px] text-muted">{label}</dt>
                  <dd className="text-[15px] md:text-base">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {tags.length > 0 && (
          <section className="artwork-detail__tags flex flex-col gap-3 md:gap-3.5">
            <h2 className="text-xl font-medium tracking-tight md:text-[22px]">Tags</h2>
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag.term}>
                  <Chip>{tag.term}</Chip>
                </li>
              ))}
            </ul>
          </section>
        )}

        <a
          href={artwork.objectURL}
          target="_blank"
          rel="noreferrer"
          className={`artwork-detail__met-link ${buttonVariants({ size: "lg" })} self-start`}
        >
          View on metmuseum.org
          <ExternalLink aria-hidden className="size-4.5" />
        </a>
      </article>
    </div>
  );
}

function ArtworkDetailFixture() {
  return (
    <div className={LAYOUT_CLASS}>
      <div className={`flex flex-col gap-4 ${GALLERY_COLUMN_CLASS}`}>
        <div className="aspect-[4/5] rounded-3xl md:rounded-[28px]" />
        <div className="flex gap-2.5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-[84px] w-16 shrink-0 rounded-[14px] md:h-[92px] md:w-[72px]" />
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
