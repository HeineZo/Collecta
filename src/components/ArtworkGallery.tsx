import { Button } from "@heroui/react";
import { Maximize2 } from "lucide-react";
import { startTransition, useState, ViewTransition } from "react";
import { useArrowKeyNavigation } from "../hooks/useArrowKeyNavigation";
import { stepIndex } from "../lib/stepIndex";
import { toWebLarge } from "../lib/toWebLarge";
import { ArtworkLightbox } from "./ArtworkLightbox";
import { ArtworkPrintPile } from "./ArtworkPrintPile";
import { NoImageNotice } from "./NoImageNotice";
import { Lens } from "./ui/lens";

interface ArtworkGalleryProps {
  title: string;
  // Shared with the artwork's card so the image morphs between the two pages.
  viewTransitionName: string;
  imageUrls: string[];
  className?: string;
}

const MAIN_IMAGE_CLASS = "block h-auto max-h-[calc(100dvh-19rem)] w-auto max-w-full";

export function ArtworkGallery({ title, viewTransitionName, imageUrls, className = "" }: ArtworkGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const selectedUrl = imageUrls[selectedIndex];
  const fullScreenTransitionName = `${viewTransitionName}-full-screen`;

  const openFullScreen = () => startTransition(() => setIsFullScreen(true));
  const closeFullScreen = () => startTransition(() => setIsFullScreen(false));

  useArrowKeyNavigation(
    (offset) => setSelectedIndex((index) => stepIndex(index, offset, imageUrls.length)),
    imageUrls.length > 1,
  );

  return (
    <section aria-label="Images of this work" className={`artwork-gallery flex flex-col gap-4 ${className}`}>
      <ViewTransition name={viewTransitionName} share="artwork-image">
        <figure
          className={`artwork-gallery__main relative overflow-hidden rounded-artwork bg-surface-tertiary ${selectedUrl ? "w-fit max-w-full self-center" : "aspect-[4/5]"}`}
        >
          {selectedUrl ? (
            <>
              {isFullScreen ? (
                // Keeps the figure's height while the image is shown full screen.
                <img src={toWebLarge(selectedUrl)} alt="" className={`invisible ${MAIN_IMAGE_CLASS}`} />
              ) : (
                <ViewTransition name={fullScreenTransitionName} default="none" share="artwork-lightbox-image">
                  <Lens zoomFactor={2} lensSize={180} className="artwork-gallery__lens rounded-none">
                    <img src={toWebLarge(selectedUrl)} alt={title} className={MAIN_IMAGE_CLASS} />
                  </Lens>
                </ViewTransition>
              )}
              <Button
                isIconOnly
                variant="ghost"
                onPress={openFullScreen}
                aria-label="View full screen"
                className="artwork-gallery__full-size absolute right-4 top-4 z-30 size-11 rounded-full text-white backdrop-blur-md [--button-bg-hover:rgb(0_0_0/0.65)] [--button-bg-pressed:rgb(0_0_0/0.65)] [--button-bg:rgb(0_0_0/0.5)]"
              >
                <Maximize2 aria-hidden className="size-5" strokeWidth={1.8} />
              </Button>
              {imageUrls.length > 1 && (
                <span className="artwork-gallery__counter absolute bottom-4 right-4 z-30 rounded-full bg-black/50 px-3 py-1 text-[13px] text-white backdrop-blur-md">
                  {selectedIndex + 1} / {imageUrls.length}
                </span>
              )}
            </>
          ) : (
            <NoImageNotice className="artwork-gallery__no-image size-full text-muted" />
          )}
        </figure>
      </ViewTransition>

      {isFullScreen && (
        <ArtworkLightbox
          title={title}
          imageUrls={imageUrls}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          viewTransitionName={fullScreenTransitionName}
          onClose={closeFullScreen}
        />
      )}

      {imageUrls.length > 1 && (
        <ArtworkPrintPile
          imageUrls={imageUrls}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          className="artwork-gallery__thumbnails"
        />
      )}
    </section>
  );
}
