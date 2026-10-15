// Adapted from Amicro "Mono Concentric Radial Rings"
// (https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedRadialGaugeChart.tsx).

import { useReducedMotion } from "motion/react";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, Cell } from "recharts";
import { MonoChartCard } from "./mono-chart-card";

export interface MonoRing {
  label: string;
  // Percentage, 0–100.
  value: number;
}

interface MonoConcentricRadialRingsProps {
  title: string;
  summary?: string;
  rings: MonoRing[];
  className?: string;
}

const RING_TONES = [1, 0.65, 0.32];
const formatPercent = (value: number) => `${value < 1 ? value.toFixed(1) : Math.round(value)}%`;

export function MonoConcentricRadialRings({ title, summary, rings, className }: MonoConcentricRadialRingsProps) {
  const reduceMotion = useReducedMotion();
  // Recharts draws the first row as the inner ring: reversed so the first ring is the outer one.
  const innerToOuter = [...rings].reverse();

  return (
    <MonoChartCard title={title} summary={summary} className={className} stageClassName="flex items-center gap-4">
      <div className="size-36 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={innerToOuter}
            innerRadius="35%"
            outerRadius="100%"
            barSize={10}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: "currentColor", fillOpacity: 0.06 }}
              isAnimationActive={!reduceMotion}
              animationDuration={800}
            >
              {innerToOuter.map((ring, index) => (
                <Cell key={ring.label} fill="currentColor" fillOpacity={RING_TONES[rings.length - 1 - index]} />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col gap-2 text-sm">
        {rings.map((ring, index) => (
          <li key={ring.label} className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-foreground" style={{ opacity: RING_TONES[index] }} />
            <span className="font-semibold tabular-nums">{formatPercent(ring.value)}</span>
            <span className="text-muted">{ring.label}</span>
          </li>
        ))}
      </ul>
    </MonoChartCard>
  );
}
