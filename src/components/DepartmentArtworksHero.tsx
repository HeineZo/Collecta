import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef, useState } from "react";
import { Link } from "react-router";
import { useDepartmentCover } from "../hooks/useDepartmentCover";
import { toWebLarge } from "../lib/toWebLarge";
import { ArtworkControlsDock, CONTROL_SELECTOR } from "./ArtworkControlsDock";

const DOCK_PROGRESS = 0.4;

interface DepartmentArtworksHeroProps {
  departmentId: number;
  title: string | undefined;
  description: string | undefined;
  search: ReactNode;
  filters: ReactNode;
}

export function DepartmentArtworksHero({ departmentId, title, description, search, filters }: DepartmentArtworksHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { highlight } = useDepartmentCover(departmentId);
  
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.78]);
  const borderRadius = useTransform(scrollYProgress, (progress) =>
    reduceMotion ? "0px" : `calc(${Math.min(progress * 2, 1)} * min(180px, 22vw))`,
  );
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 160]);
  const contentOpacity = useTransform(scrollYProgress, [0, DOCK_PROGRESS, DOCK_PROGRESS + 0.1], [1, 0.4, 0]);
  const creditOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  const controlsRef = useRef<HTMLDivElement>(null);
  const [isDocked, setIsDocked] = useState(false);

  const [dockFocusIndex, setDockFocusIndex] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const docked = progress > DOCK_PROGRESS;
    if (docked && !isDocked) {
      const focusables = [...(controlsRef.current?.querySelectorAll(CONTROL_SELECTOR) ?? [])];
      setDockFocusIndex(focusables.indexOf(document.activeElement as Element));
    }
    setIsDocked(docked);
  });
  const [isLargeImageLoaded, setIsLargeImageLoaded] = useState(false);

  const controls = (
    <>
      <div className="min-w-0 flex-1">{search}</div>
      {filters}
    </>
  );

  return (
    <section
      ref={ref}
      className="department-artworks-hero relative mx-[calc(50%-50vw)] -mt-24 flex h-svh min-h-[560px] items-center justify-center px-6 text-center text-white md:-mt-32 lg:-mt-36"
    >
      <motion.div
        className="department-artworks-hero__image absolute inset-0 overflow-hidden bg-zinc-900"
        style={{ scale, borderRadius }}
      >
        {highlight?.primaryImageSmall && !isLargeImageLoaded && (
          <img src={highlight.primaryImageSmall} alt="" className="absolute inset-0 size-full object-cover" />
        )}
        {highlight?.primaryImage && (
          <img
            src={toWebLarge(highlight.primaryImage)}
            alt=""
            onLoad={() => setIsLargeImageLoaded(true)}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-black/50 [background-image:radial-gradient(ellipse_at_center,transparent_20%,rgb(0_0_0/0.45))]" />
        {highlight && (
          <motion.p
            className="department-artworks-hero__credit absolute inset-x-6 bottom-6 truncate text-left text-sm text-white/70 md:inset-x-10"
            style={{ opacity: creditOpacity }}
          >
            Highlight ·{" "}
            <Link to={`artworks/${highlight.objectID}`} className="text-white underline-offset-4 hover:underline">
              {highlight.title}
            </Link>
          </motion.p>
        )}
      </motion.div>

      <motion.div
        className="department-artworks-hero__content relative z-10 flex w-full max-w-2xl flex-col items-center gap-5"
        style={{ y: contentY, opacity: contentOpacity }}
        inert={isDocked}
      >
        <Link to="/" className="text-xs uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-white md:text-sm">
          Departments
        </Link>
        <h1 className="min-h-[1lh] text-[42px] leading-[1.02] tracking-[-0.035em] md:text-[72px]">{title}</h1>
        <p className="min-h-[1lh] text-[15px] text-white/75 md:text-[17px]">{description}</p>
        <div ref={controlsRef} className="mt-4 flex w-full max-w-md items-center gap-2">
          {controls}
        </div>
      </motion.div>

      <ArtworkControlsDock isVisible={isDocked} focusIndex={dockFocusIndex}>{controls}</ArtworkControlsDock>
    </section>
  );
}
