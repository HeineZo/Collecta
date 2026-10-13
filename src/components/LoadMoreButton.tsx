import { Button } from "@heroui/react";
import { useEffect, useEffectEvent, useRef } from "react";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading: boolean;
  // Also loads when the button comes near the screen, without waiting for a press.
  autoLoad?: boolean;
}

export function LoadMoreButton({ onLoadMore, isLoading, autoLoad = false }: LoadMoreButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMore = useEffectEvent(onLoadMore);
  const canAutoLoad = autoLoad && !isLoading;

  useEffect(() => {
    const container = containerRef.current;
    if (!canAutoLoad || !container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "0px 0px 400px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [canAutoLoad]);

  return (
    <div ref={containerRef} className="load-more mt-4 flex justify-center">
      <Button variant="outline" isPending={isLoading} onPress={onLoadMore}>
        Load more
      </Button>
    </div>
  );
}
