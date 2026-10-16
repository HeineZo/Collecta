import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

const SPAWN_DISTANCE_PX = 90;
const LIFETIME_MS = 850;
const MAX_ITEMS = 10;

const EXIT_TRANSITION = { duration: 0.5 };

interface TrailItem {
  key: number;
  x: number;
  y: number;
  imageUrl: string;
  rotate: number;
}

interface ImageTrailProps {
  imageUrls: string[];
  className?: string;
  children: ReactNode;
}

// Images pop along the mouse path inside the container, then fade away (ReactBits "Image trail").
export function ImageTrail({ imageUrls, className = "", children }: ImageTrailProps) {
  const isReducedMotion = useReducedMotion();
  const [items, setItems] = useState<TrailItem[]>([]);
  const lastSpawn = useRef<{ x: number; y: number } | null>(null);
  const nextKey = useRef(0);
  const timers = useRef(new Set<number>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const spawn = (x: number, y: number) => {
    const key = nextKey.current++;
    const item = {
      key,
      x,
      y,
      imageUrl: imageUrls[key % imageUrls.length],
      rotate: Math.random() * 16 - 8,
    };
    setItems((current) => [...current.slice(1 - MAX_ITEMS), item]);
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      setItems((current) => current.filter((other) => other.key !== key));
    }, LIFETIME_MS);
    timers.current.add(timer);
  };

  return (
    <div
      className={`image-trail relative ${className}`}
      onPointerMove={(event) => {
        if (isReducedMotion || event.pointerType !== "mouse" || !imageUrls.length) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const last = lastSpawn.current;
        if (last && Math.hypot(x - last.x, y - last.y) < SPAWN_DISTANCE_PX) return;
        lastSpawn.current = { x, y };
        spawn(x, y);
      }}
      onPointerLeave={() => (lastSpawn.current = null)}
    >
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <AnimatePresence>
          {items.map((item) => (
            <motion.img
              key={item.key}
              src={item.imageUrl}
              alt=""
              draggable={false}
              className="absolute h-44 w-36 max-w-none -translate-1/2 rounded-2xl object-cover shadow-xl"
              style={{ left: item.x, top: item.y }}
              initial={{ opacity: 0, scale: 0.3, rotate: item.rotate }}
              animate={{ opacity: 1, scale: 1, rotate: item.rotate }}
              exit={{ opacity: 0, scale: 0.6, rotate: item.rotate, filter: "blur(8px)", transition: EXIT_TRANSITION }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
