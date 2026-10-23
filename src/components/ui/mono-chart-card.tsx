// Shared frame of the Amicro mono charts (https://amicro.vercel.app/mono-charts): card, caption, stage and tooltip.

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import type { TooltipContentProps } from "recharts";
import { cn } from "../../lib/cn";

interface MonoChartCardProps {
  title: string;
  summary?: ReactNode;
  children: ReactNode;
  className?: string;
  stageClassName?: string;
}

// Charts draw with `currentColor`: the stage's text colour is the ink, opacity gives the tones.
export const MONO_TICK = { fontSize: 10, fill: "currentColor", fillOpacity: 0.65 };

export function MonoChartCard({ title, summary, children, className, stageClassName }: MonoChartCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] sm:p-4",
        className,
      )}
    >
      <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-2 px-0.5">
        <span className="text-base font-semibold tracking-tight">{title}</span>
        {summary && <span className="text-xs text-muted">{summary}</span>}
      </figcaption>
      <div className={cn("relative w-full flex-1 touch-pan-y rounded-[14px] bg-surface-secondary p-2 text-foreground", stageClassName)}>
        {children}
      </div>
    </motion.figure>
  );
}

export function MonoChartTooltip({
  active,
  payload,
  label,
  formatValue,
}: TooltipContentProps & { formatValue: (value: number) => string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="pointer-events-none rounded-xl border border-border bg-overlay px-3 py-2 text-xs text-foreground shadow-lg">
      {label !== undefined && (
        <div className="mb-1.5 border-b border-separator pb-1 font-medium tracking-tight text-muted">{label}</div>
      )}
      {payload.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-3">
          <span className="text-muted">{item.name}:</span>
          <span className="font-semibold tabular-nums">{formatValue(Number(item.value))}</span>
        </div>
      ))}
    </div>
  );
}
