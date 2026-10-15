import { type RefObject, useEffect, useState } from "react";

// True while the element's content is wider than the element itself
export function useHasOverflow(ref: RefObject<HTMLElement | null>) {
  const [hasOverflow, setHasOverflow] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setHasOverflow(element.scrollWidth > element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return hasOverflow;
}
