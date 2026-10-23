import { useEffect, useRef } from "react";

// Smoothly brings the returned element into view whenever `key` changes, but not on first render.
export function useScrollIntoViewOnChange<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);
  const previousKey = useRef(key);
  useEffect(() => {
    if (key === previousKey.current) return;
    previousKey.current = key;
    let frame = 0;
    // A closing menu still locks page scroll for a few frames, and would cancel the scroll.
    const scroll = () => {
      if (document.documentElement.style.overflow === "hidden") frame = requestAnimationFrame(scroll);
      else ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    scroll();
    return () => cancelAnimationFrame(frame);
  }, [key]);
  return ref;
}
