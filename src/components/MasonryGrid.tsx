import { type ReactNode, useSyncExternalStore } from "react";

export function MasonryGrid({ items }: { items: ReactNode[] }) {
  const columnCount = useColumnCount();
  const columns = Array.from({ length: columnCount }, (_, column) =>
    items.filter((_, index) => index % columnCount === column),
  );
  return (
    <div className="masonry-grid flex items-start gap-3 md:gap-5">
      {columns.map((column, index) => (
        <div key={index} className="masonry-grid__column flex min-w-0 flex-1 flex-col">
          {column}
        </div>
      ))}
    </div>
  );
}

// Same breakpoints as Tailwind's md (48rem) and lg (64rem).
function useColumnCount() {
  return useSyncExternalStore(subscribeToResize, () =>
    window.matchMedia("(min-width: 64rem)").matches ? 4 : window.matchMedia("(min-width: 48rem)").matches ? 3 : 2,
  );
}

function subscribeToResize(onResize: () => void) {
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}
