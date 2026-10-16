import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { useEffect } from "react";

const FOLLOW_SPRING = { stiffness: 260, damping: 28, mass: 0.6 };

// Image floating next to the mouse cursor; decorative, so hidden on touch screens.
export function CursorImagePreview({ src }: { src: string | undefined }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, FOLLOW_SPRING);
  const springY = useSpring(y, FOLLOW_SPRING);
  // The image leans in the direction the cursor moves.
  const rotate = useTransform(useVelocity(springX), [-1500, 1500], [-10, 10], { clamp: true });

  useEffect(() => {
    let hasPosition = false;
    const follow = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      // The first position is jumped to, so the image does not fly in from the corner.
      if (!hasPosition) {
        springX.jump(event.clientX);
        springY.jump(event.clientY);
        hasPosition = true;
      }
    };
    window.addEventListener("pointermove", follow);
    return () => window.removeEventListener("pointermove", follow);
  }, [x, y, springX, springY]);

  return (
    <motion.div
      aria-hidden
      className="cursor-image-preview pointer-events-none fixed left-0 top-0 z-40 hidden [@media(hover:hover)]:block"
      style={{ x: springX, y: springY, rotate }}
    >
      <AnimatePresence>
        {src && (
          <motion.img
            key={src}
            src={src}
            alt=""
            initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-10 top-0 h-80 w-64 max-w-none -translate-y-1/2 rounded-artwork object-cover shadow-2xl"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
