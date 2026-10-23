import { Children, type ReactNode, useLayoutEffect, useRef, useState } from "react";

const ROW_HEIGHT_PX = 4;

export function MasonryGrid({ items }: { items: ReactNode[] }) {
  return (
    <div
      className="masonry-grid grid grid-cols-2 items-start gap-x-3 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4"
      style={{ gridAutoRows: ROW_HEIGHT_PX }}
    >
      {Children.map(items, (item) => (
        <MasonryCell>{item}</MasonryCell>
      ))}
    </div>
  );
}

function MasonryCell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rowSpan, setRowSpan] = useState(1);

  useLayoutEffect(() => {
    const cell = ref.current!;
    const measure = () => setRowSpan(Math.ceil(cell.getBoundingClientRect().height / ROW_HEIGHT_PX));
    measure();
    // Images load after the first render and change the height.
    const observer = new ResizeObserver(measure);
    observer.observe(cell);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="masonry-grid__cell flow-root min-w-0" style={{ gridRowEnd: `span ${rowSpan}` }}>
      {children}
    </div>
  );
}
