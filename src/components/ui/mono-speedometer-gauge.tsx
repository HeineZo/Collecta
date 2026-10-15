// Adapted from Amicro "Mono Speedometer Gauge Arc"
// (https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedGaugeArc.tsx).

import { useReducedMotion } from "motion/react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MonoChartCard } from "./mono-chart-card";

interface MonoSpeedometerGaugeProps {
  title: string;
  summary?: string;
  // How full the gauge is, 0–1 (clamped).
  fraction: number;
  readout: string;
  caption: string;
  className?: string;
}

export function MonoSpeedometerGauge({ title, summary, fraction, readout, caption, className }: MonoSpeedometerGaugeProps) {
  const reduceMotion = useReducedMotion();
  const filled = Math.min(Math.max(fraction, 0), 1);
  // A tiny remainder keeps both ends rounded when the gauge is full or empty.
  const data = [{ value: Math.max(filled, 0.005) }, { value: Math.max(1 - filled, 0.005) }];

  return (
    <MonoChartCard title={title} summary={summary} className={className} stageClassName="flex flex-col items-center">
      <div className="h-36 w-full" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="80%"
              startAngle={210}
              endAngle={-30}
              innerRadius={58}
              outerRadius={74}
              cornerRadius={8}
              paddingAngle={4}
              stroke="none"
              isAnimationActive={!reduceMotion}
            >
              <Cell fill="currentColor" />
              <Cell fill="currentColor" fillOpacity={0.1} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="-mt-8 flex flex-col items-center pb-1 text-center">
        <span className="text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{readout}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted">{caption}</span>
      </div>
    </MonoChartCard>
  );
}
