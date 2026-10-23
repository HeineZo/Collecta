import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { useIsFooterInView } from "../hooks/useIsFooterInView";

export const CONTROL_SELECTOR = "input, button";

interface ArtworkControlsDockProps {
  isVisible: boolean;
  focusIndex: number;
  children: ReactNode;
}

// Search and filters pinned to the bottom of the screen once the hero has scrolled away
export function ArtworkControlsDock({
  isVisible,
  focusIndex,
  children,
}: ArtworkControlsDockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isFooterInView = useIsFooterInView();
  const isShown = isVisible && !isFooterInView;
  useEffect(() => {
    if (isShown && focusIndex >= 0) ref.current?.querySelectorAll<HTMLElement>(CONTROL_SELECTOR)[focusIndex]?.focus();
  }, [isShown, focusIndex]);
  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          key="backdrop"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="artwork-controls-dock__backdrop pointer-events-none fixed inset-x-0 bottom-0 z-20 h-40 bg-background/40 backdrop-blur-xs [mask-image:radial-gradient(ellipse_60%_100%_at_50%_100%,black_45%,transparent_100%)] md:h-48"
        />
      )}
      {isShown && (
        <motion.div
          key="controls"
          ref={ref}
          role="search"
          aria-label="Search and filter artworks"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="artwork-controls-dock fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-md items-center gap-2 md:bottom-6"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
