// Adapted from Amicro "Mono Curved Wave Area"
// (https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedAreaChart.tsx).

import { useReducedMotion } from "motion/react";
import { useId } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { MONO_TICK, MonoChartCard, MonoChartTooltip } from "./mono-chart-card";

export interface MonoAreaPoint {
  label: string;
  value: number;
}

interface MonoCurvedWaveAreaProps {
  title: string;
  summary?: string;
  data: MonoAreaPoint[];
  valueName: string;
  formatValue: (value: number) => string;
  className?: string;
}

export function MonoCurvedWaveArea({ title, summary, data, valueName, formatValue, className }: MonoCurvedWaveAreaProps) {
  const reduceMotion = useReducedMotion();
  const gradientId = `mono-area-gradient-${useId().replace(/[^\w-]/g, "")}`;

  return (
    <MonoChartCard title={title} summary={summary} className={className}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.28} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={MONO_TICK} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={formatValue} tick={MONO_TICK} width={44} />
            <Tooltip
              cursor={{ stroke: "currentColor", strokeOpacity: 0.2 }}
              content={(props) => <MonoChartTooltip {...props} formatValue={formatValue} />}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={valueName}
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${gradientId})`}
              isAnimationActive={!reduceMotion}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </MonoChartCard>
  );
}
