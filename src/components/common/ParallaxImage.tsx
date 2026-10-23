import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "../../lib/cn";

const PARALLAX_SCALE = 1.2;

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}

// Image sliding inside its frame while the frame crosses the viewport
export function ParallaxImage({ src, alt, className, imageClassName }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-8%", "8%"]);
  return (
    <div ref={ref} className={cn("parallax-image overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale: reduceMotion ? 1 : PARALLAX_SCALE }}
        className={cn("block w-full object-cover", imageClassName)}
      />
    </div>
  );
}
