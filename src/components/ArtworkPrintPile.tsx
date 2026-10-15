import { Button, ScrollShadow } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type CSSProperties, type KeyboardEvent, useEffect, useRef } from "react";
import { useScrollEdges } from "../hooks/useScrollEdges";
import { toWebLarge } from "../lib/toWebLarge";

interface ArtworkPrintPileProps {
  imageUrls: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

const TILTS = [-8, 5, -3, 9, -6, 3, -10, 6];
const PRINTS_PER_SCROLL = 3;
const ARROW_CLASS = "size-11 shrink-0 rounded-full";

export function ArtworkPrintPile({ imageUrls, selectedIndex, onSelect, className = "" }: ArtworkPrintPileProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { canScrollBack, canScrollForward } = useScrollEdges(scrollerRef);
  const hasOverflow = canScrollBack || canScrollForward;
  const indexAt = (offset: number) => (selectedIndex + offset + imageUrls.length) % imageUrls.length;

  // Scrolls only the pile
  useEffect(() => {
    const scroller = scrollerRef.current!;
    const print = scroller.children[selectedIndex] as HTMLElement;
    scroller.scrollTo({ left: print.offsetLeft - (scroller.clientWidth - print.offsetWidth) / 2, behavior: "smooth" });
  }, [selectedIndex]);

  const scrollByPrints = (direction: number) => {
    const scroller = scrollerRef.current!;
    const printStep = (scroller.children[1] as HTMLElement).offsetLeft - (scroller.children[0] as HTMLElement).offsetLeft;
    scroller.scrollBy({ left: direction * PRINTS_PER_SCROLL * printStep, behavior: "smooth" });
  };

  const selectFromKeyboard = (event: KeyboardEvent, offset: number) => {
    event.preventDefault();
    event.stopPropagation();
    const index = indexAt(offset);
    onSelect(index);
    (scrollerRef.current!.children[index] as HTMLElement).focus({ preventScroll: true });
  };

  return (
    <div className={`artwork-print-pile flex items-center gap-2 ${className}`}>
      {hasOverflow && (
        <Button
          isIconOnly
          variant="tertiary"
          aria-label="Scroll back"
          onPress={() => scrollByPrints(-1)}
          className={`${ARROW_CLASS} ${canScrollBack ? "" : "invisible"}`}
        >
          <ChevronLeft aria-hidden className="size-5" strokeWidth={1.8} />
        </Button>
      )}
      <ScrollShadow
        ref={scrollerRef}
        orientation="horizontal"
        hideScrollBar
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") selectFromKeyboard(event, -1);
          if (event.key === "ArrowRight") selectFromKeyboard(event, 1);
        }}
        className="artwork-print-pile__scroller relative mx-auto flex w-fit max-w-full min-w-0 py-3 pr-2 pl-5"
      >
        {imageUrls.map((imageUrl, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={imageUrl}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(index)}
              style={{ "--tilt": `${TILTS[index % TILTS.length]}deg` } as CSSProperties}
              className={`artwork-print-pile__print group relative h-[84px] w-16 shrink-0 -ml-3 overflow-hidden rounded-lg border-[3px] border-white bg-surface-tertiary shadow-md outline-none transition-[rotate,scale,translate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] rotate-(--tilt) hover:z-20 hover:rotate-0 hover:scale-110 focus-visible:z-20 focus-visible:rotate-0 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none md:h-[92px] md:w-[72px] ${
                isSelected ? "z-10 -translate-y-1.5" : ""
              }`}
            >
              <img
                src={toWebLarge(imageUrl)}
                alt=""
                loading="lazy"
                className={`size-full object-cover transition-[filter,opacity] duration-300 motion-reduce:transition-none ${
                  isSelected
                    ? ""
                    : "opacity-45 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
                }`}
              />
            </button>
          );
        })}
      </ScrollShadow>
      {hasOverflow && (
        <Button
          isIconOnly
          variant="tertiary"
          aria-label="Scroll forward"
          onPress={() => scrollByPrints(1)}
          className={`${ARROW_CLASS} ${canScrollForward ? "" : "invisible"}`}
        >
          <ChevronRight aria-hidden className="size-5" strokeWidth={1.8} />
        </Button>
      )}
    </div>
  );
}
