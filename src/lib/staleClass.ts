import { cn } from "./cn";

// Dims a block that still shows previous values while the next ones load, and blocks its links meanwhile.
export const staleClass = (isStale: boolean) =>
  cn("transition-opacity duration-300 [&>*]:h-full", isStale && "pointer-events-none opacity-50");
