import { type RefObject, useEffect, useState } from "react";

interface ScrollEdges {
  canScrollBack: boolean;
  canScrollForward: boolean;
}

// Whether a horizontal scroller has hidden content before and after its visible part
export function useScrollEdges(ref: RefObject<HTMLElement | null>) {
  const [edges, setEdges] = useState<ScrollEdges>({ canScrollBack: false, canScrollForward: false });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const canScrollBack = element.scrollLeft > 0;
      const canScrollForward = element.scrollLeft + element.clientWidth < element.scrollWidth - 1;

      setEdges((previous) =>
        previous.canScrollBack === canScrollBack && previous.canScrollForward === canScrollForward
          ? previous
          : { canScrollBack, canScrollForward },
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [ref]);
  return edges;
}
