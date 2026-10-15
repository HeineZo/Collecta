import { useEffect, useEffectEvent } from "react";

// Calls `onStep(-1 | 1)` for ← and → pressed anywhere on the page
export function useArrowKeyNavigation(onStep: (offset: number) => void, isEnabled: boolean) {
  const step = useEffectEvent(onStep);

  useEffect(() => {
    if (!isEnabled) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if ((event.target as Element).closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEnabled]);
}
