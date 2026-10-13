import { useEffect, useState } from "react";

export function useRotatingValue<T>(
  values: T[] | undefined,
  intervalMs: number,
) {
  const [index, setIndex] = useState(0);
  const valueCount = values?.length ?? 0;
  useEffect(() => {
    if (!valueCount) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % valueCount),
      intervalMs,
    );
    return () => clearInterval(timer);
  }, [valueCount, intervalMs]);
  return values?.[index % valueCount];
}
