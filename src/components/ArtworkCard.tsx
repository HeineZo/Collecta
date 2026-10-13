import { ImageOff } from "lucide-react";
import useSWR from "swr";
import { fetchMuseumObject } from "../api/objectsApi";

export function ArtworkCard({ objectId }: { objectId: number }) {
  const { data: artwork } = useSWR(["museum-object", objectId], ([, id]) => fetchMuseumObject(id));
  const details = [artwork?.culture, artwork?.objectDate].filter(Boolean).join(" · ");

  return (
    <article className="artwork-card mb-5 break-inside-avoid md:mb-7">
      {artwork?.primaryImageSmall ? (
        <img
          src={artwork.primaryImageSmall}
          alt={artwork.title}
          loading="lazy"
          className="artwork-card__image min-h-40 w-full rounded-[20px] bg-surface-tertiary object-cover"
        />
      ) : (
        <div className="artwork-card__no-image flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-[20px] bg-surface-tertiary text-sm text-muted">
          {artwork && (
            <>
              <ImageOff aria-hidden className="size-8" strokeWidth={1.5} />
              No public image
            </>
          )}
        </div>
      )}
      {artwork && (
        <div className="artwork-card__caption mt-3 flex flex-col gap-1">
          <h2 className="line-clamp-2 text-[15px] font-medium leading-tight md:text-base">{artwork.title}</h2>
          {details && <p className="text-[13px] text-muted md:text-sm">{details}</p>}
        </div>
      )}
    </article>
  );
}
