import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useIsFooterInView } from "../hooks/useIsFooterInView";

interface ArtworkControlsDockProps {
  isVisible: boolean;
  children: ReactNode;
}

// Search and filters pinned to the bottom of the screen once the hero has scrolled away
export function ArtworkControlsDock({
  isVisible,
  children,
}: ArtworkControlsDockProps) {
  const reduceMotion = useReducedMotion();
  const isFooterInView = useIsFooterInView();
  const isShown = isVisible && !isFooterInView;
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
