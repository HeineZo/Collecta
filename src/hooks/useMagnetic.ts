import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";

const MAGNET_SPRING = { stiffness: 200, damping: 20, mass: 0.5 };
const MAGNET_STRENGTH = 0.06;

// Pulls an element slightly toward the mouse cursor
export function useMagnetic() {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * MAGNET_STRENGTH);
    y.set((event.clientY - bounds.top - bounds.height / 2) * MAGNET_STRENGTH);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { x: useSpring(x, MAGNET_SPRING), y: useSpring(y, MAGNET_SPRING), onPointerMove, onPointerLeave };
}
