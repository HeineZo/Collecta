import { ImageOff, Maximize2 } from "lucide-react";
import { useState } from "react";

interface ArtworkGalleryProps {
  title: string;
  imageUrls: string[];
  className?: string;
}

// shortcut: relies on the Met's "/original/" → "/web-large/" URL convention; switch to the originals if it breaks.
const toWebLarge = (imageUrl: string) => imageUrl.replace("/original/", "/web-large/");

export function ArtworkGallery({ title, imageUrls, className = "" }: ArtworkGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedUrl = imageUrls[selectedIndex];

  return (
    <section aria-label="Images of this work" className={`artwork-gallery flex flex-col gap-4 ${className}`}>
      <figure className="artwork-gallery__main relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-tertiary md:rounded-[28px]">
        {selectedUrl ? (
          <>
            <img src={toWebLarge(selectedUrl)} alt={title} className="size-full object-contain" />
            <a
              href={selectedUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open the full-size image"
              className="artwork-gallery__full-size absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md"
            >
              <Maximize2 aria-hidden className="size-5" strokeWidth={1.8} />
            </a>
            {imageUrls.length > 1 && (
              <span className="artwork-gallery__counter absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-[13px] text-white backdrop-blur-md">
                {selectedIndex + 1} / {imageUrls.length}
              </span>
            )}
          </>
        ) : (
          <div className="artwork-gallery__no-image flex size-full flex-col items-center justify-center gap-2 text-sm text-muted">
            <ImageOff aria-hidden className="size-8" strokeWidth={1.5} />
            No public image
          </div>
        )}
      </figure>

      {imageUrls.length > 1 && (
        <div className="artwork-gallery__thumbnails flex gap-2.5 overflow-x-auto pb-1">
          {imageUrls.map((imageUrl, index) => (
            <button
              key={imageUrl}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
              className={`h-[84px] w-16 shrink-0 overflow-hidden rounded-[14px] border-2 bg-surface-tertiary md:h-[92px] md:w-[72px] ${
                index === selectedIndex ? "border-accent" : "border-transparent"
              }`}
            >
              <img src={toWebLarge(imageUrl)} alt="" loading="lazy" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
