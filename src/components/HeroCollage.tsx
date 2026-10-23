import { motion, useReducedMotion } from "motion/react";

const SPOTS = [
  "left-[4%] top-[8%] h-28 w-22 -rotate-8 md:left-[6%] md:top-[12%] md:h-40 md:w-32",
  "right-[4%] top-[6%] h-24 w-20 rotate-6 md:right-[8%] md:top-[10%] md:h-36 md:w-28",
  "bottom-[6%] left-[6%] h-24 w-20 rotate-5 md:bottom-[10%] md:left-[12%] md:h-36 md:w-28",
  "bottom-[8%] right-[5%] h-28 w-22 -rotate-6 md:bottom-[12%] md:right-[6%] md:h-44 md:w-34",
  "hidden lg:block left-[2%] top-[46%] h-32 w-24 rotate-3",
  "hidden lg:block right-[2%] top-[44%] h-28 w-22 -rotate-4",
];

export function HeroCollage({ imageUrls }: { imageUrls: string[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {imageUrls.slice(0, SPOTS.length).map((imageUrl, index) => (
        <motion.img
          key={imageUrl}
          src={imageUrl}
          alt=""
          draggable={false}
          className={`absolute max-w-none rounded-2xl object-cover opacity-90 shadow-lg ${SPOTS[index]}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={reduceMotion ? { opacity: 0.9, scale: 1 } : { opacity: 0.9, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: index * 0.08 },
            scale: { duration: 0.8, delay: index * 0.08 },
            y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}
    </div>
  );
}
