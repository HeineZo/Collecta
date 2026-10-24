import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";

interface LanternRevealProps {
  imageUrl: string | undefined;
  alt: string;
  className?: string;
}

const IDLE_DELAY_MS = 2500;

// An image kept in the dark: only a lantern following the pointer lights it up.
export function LanternReveal({ imageUrl, alt, className }: LanternRevealProps) {
  const darknessRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const darkness = darknessRef.current;
    if (!darkness) return;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, movedAt: -Infinity };
    const lantern = { x: 0.5, y: 0.5 };
    let frame = 0;

    const followPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
      pointer.movedAt = performance.now();
    };
    const moveLantern = (now: number) => {
      const isWandering = !isReducedMotion && now - pointer.movedAt > IDLE_DELAY_MS;
      // Left alone, the light drifts around like someone looking for the exit.
      const target = isWandering
        ? { x: 0.5 + 0.32 * Math.sin(now / 3100), y: 0.5 + 0.28 * Math.sin(now / 2300 + 1) }
        : pointer;
      const ease = isWandering ? 0.02 : 0.12;
      lantern.x += (target.x - lantern.x) * ease;
      lantern.y += (target.y - lantern.y) * ease;
      darkness.style.setProperty("--lantern-x", `${lantern.x * 100}%`);
      darkness.style.setProperty("--lantern-y", `${lantern.y * 100}%`);
      frame = requestAnimationFrame(moveLantern);
    };

    window.addEventListener("pointermove", followPointer);
    frame = requestAnimationFrame(moveLantern);
    return () => {
      window.removeEventListener("pointermove", followPointer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={cn("lantern-reveal overflow-hidden bg-black", className)}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          onLoad={() => setIsImageLoaded(true)}
          className={cn(
            "lantern-reveal__image size-full object-cover transition-opacity duration-1000",
            !isImageLoaded && "opacity-0",
          )}
        />
      )}
      <div ref={darknessRef} aria-hidden className="lantern-reveal__darkness absolute inset-0" />
    </div>
  );
}
