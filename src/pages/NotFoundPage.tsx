import { buttonVariants } from "@heroui/styles";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { LanternReveal } from "../components/common/LanternReveal";
import { useArtwork } from "../hooks/useArtwork";

// Piranesi's "The Drawbridge", from the Imaginary Prisons.
const LOST_ARTWORK_ID = 337060;
const LOST_ARTWORK_DEPARTMENT_ID = 9;

export function NotFoundPage() {
  const { data: artwork } = useArtwork(LOST_ARTWORK_ID);

  useEffect(() => {
    document.title = "Page not found · Collecta";
  }, []);

  return (
    <main
      tabIndex={-1}
      className="not-found-page relative h-dvh touch-none overflow-hidden bg-black text-white outline-none"
    >
      <LanternReveal
        imageUrl={artwork?.primaryImage}
        alt={artwork?.title ?? ""}
        className="absolute inset-0"
      />

      <div className="not-found-page__content pointer-events-none relative flex h-full flex-col justify-end gap-5 p-6 [text-shadow:0_2px_16px_rgb(0_0_0/0.9)] md:p-16">
        <p className="text-sm uppercase tracking-widest text-white/60">
          Error 404
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
          You took a staircase to nowhere.
        </h1>
        <p className="max-w-lg text-lg text-white/70">
          This page does not exist, like most bridges in Piranesi’s imaginary
          prisons
        </p>
        <div className="pointer-events-auto flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            to="/"
            className={`not-found-page__home ${buttonVariants({ size: "lg" })}`}
          >
            Find the way out
          </Link>
          {artwork && (
            <Link
              to={`/departments/${LOST_ARTWORK_DEPARTMENT_ID}/artworks/${LOST_ARTWORK_ID}`}
              className="not-found-page__artwork group inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
            >
              {artwork.title}, {artwork.objectDate}
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
