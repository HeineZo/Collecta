// Adapted from Amicro "Mono Stat KPI Card"
// (https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedKpiCardChart.tsx).

import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface MonoStatKpiCardProps {
  label: string;
  // Undefined while loading: the card keeps its height.
  value: ReactNode;
  hint?: string;
  children?: ReactNode;
  className?: string;
}

export function MonoStatKpiCard({ label, value, hint, children, className }: MonoStatKpiCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-3xl border border-border bg-surface p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="min-h-[1lh] text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{value}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      {children}
    </div>
  );
}
