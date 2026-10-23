import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { use, useLayoutEffect, useRef, ViewTransition } from "react";
import { loadImageRatio } from "../../lib/loadImageRatio";
import { stepIndex } from "../../lib/stepIndex";
import { toWebLarge } from "../../lib/toWebLarge";
import { ArtworkPrintPile } from "./ArtworkPrintPile";

interface ArtworkLightboxProps {
  title: string;
  imageUrls: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  // Shared with the gallery image so it morphs into full screen and back.
  viewTransitionName: string;
  onClose: () => void;
}

// HeroUI's ghost button, recoloured to stay readable on the dark backdrop.
const ROUND_BUTTON_CLASS =
  "size-11 shrink-0 rounded-full text-white backdrop-blur-md [--button-bg-hover:rgb(255_255_255/0.25)] [--button-bg-pressed:rgb(255_255_255/0.25)] [--button-bg:rgb(255_255_255/0.15)]";

export function ArtworkLightbox({
  title,
  imageUrls,
  selectedIndex,
  onSelect,
  viewTransitionName,
  onClose,
}: ArtworkLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageUrl = imageUrls[selectedIndex];
  const previewUrl = toWebLarge(imageUrl);
  const aspectRatios = imageUrls.map((url) => use(loadImageRatio(toWebLarge(url))));
  const aspectRatio = aspectRatios[selectedIndex];
  const hasSeveralImages = imageUrls.length > 1;
  const showOffset = (offset: number) => onSelect(stepIndex(selectedIndex, offset, imageUrls.length));

  // Layout effect so the dialog is already open when the view transition snapshots the new state
  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="artwork-lightbox fixed inset-0 size-full max-h-none max-w-none bg-transparent backdrop:bg-transparent"
    >
      <div
        onClick={(event) => {
          if (!(event.target as Element).closest("button, img")) onClose();
        }}
        className="artwork-lightbox__backdrop flex size-full flex-col gap-4 bg-black/90 p-4 md:p-6"
      >
        <Button isIconOnly variant="ghost" aria-label="Close full screen" onPress={onClose} className={`self-end ${ROUND_BUTTON_CLASS}`}>
          <X aria-hidden className="size-5" strokeWidth={1.8} />
        </Button>

        <div className="flex min-h-0 flex-1 items-center gap-2 md:gap-4">
          {hasSeveralImages && (
            <Button isIconOnly variant="ghost" aria-label="Previous image" onPress={() => showOffset(-1)} className={ROUND_BUTTON_CLASS}>
              <ChevronLeft aria-hidden className="size-5" strokeWidth={1.8} />
            </Button>
          )}
          <div className="flex min-w-0 flex-1 items-center justify-center self-stretch [container-type:size]">
            <ViewTransition name={viewTransitionName} share="artwork-lightbox-image" default="none">
              <img
                key={imageUrl}
                src={imageUrl}
                alt={title}
                loading="lazy"
                className="artwork-lightbox__image rounded-artwork bg-cover"
                style={{
                  width: `min(100cqw, ${100 * aspectRatio}cqh)`,
                  aspectRatio,
                  backgroundImage: `url(${previewUrl})`,
                }}
              />
            </ViewTransition>
          </div>
          {hasSeveralImages && (
            <Button isIconOnly variant="ghost" aria-label="Next image" onPress={() => showOffset(1)} className={ROUND_BUTTON_CLASS}>
              <ChevronRight aria-hidden className="size-5" strokeWidth={1.8} />
            </Button>
          )}
        </div>

        {hasSeveralImages && (
          <ArtworkPrintPile
            imageUrls={imageUrls}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
            className="artwork-lightbox__thumbnails max-w-full self-center"
          />
        )}
      </div>
    </dialog>
  );
}
