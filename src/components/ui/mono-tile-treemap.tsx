// Adapted from Amicro "Mono Tile Treemap"
// (https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/src/components/mono-charts/MonoRoundedTreemapChart.tsx).

import { useReducedMotion } from "motion/react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { MonoChartCard, MonoChartTooltip } from "./mono-chart-card";

export interface MonoTile {
  id: string | number;
  name: string;
  value: number;
}

interface MonoTileTreemapProps {
  title: string;
  summary?: string;
  tiles: MonoTile[];
  formatValue: (value: number) => string;
  onTileClick?: (tile: MonoTile) => void;
  className?: string;
}

const TILE_GAP = 3;
const MIN_TONE = 0.18;
const TONE_GAP_START = 0.38;
const TONE_GAP = 0.22;

export function MonoTileTreemap({ title, summary, tiles, formatValue, onTileClick, className }: MonoTileTreemapProps) {
  const reduceMotion = useReducedMotion();
  const total = tiles.reduce((sum, tile) => sum + tile.value, 0);
  // Darker ink for the larger tiles, by rank.
  const sorted = [...tiles].sort((a, b) => b.value - a.value);
  const data = sorted.map((tile, index) => {
    const tone = 1 - TONE_GAP - (index / Math.max(sorted.length - 1, 1)) * (1 - TONE_GAP - MIN_TONE);
    return { ...tile, tone: tone > TONE_GAP_START ? tone + TONE_GAP : tone };
  });

  return (
    <MonoChartCard title={title} summary={summary} className={className}>
      <div className="h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="value"
            nameKey="name"
            aspectRatio={4 / 3}
            isAnimationActive={!reduceMotion}
            animationDuration={600}
            content={(props) => <Tile {...(props as unknown as TileProps)} total={total} formatValue={formatValue} onTileClick={onTileClick} />}
          >
            <Tooltip content={(props) => <MonoChartTooltip {...props} formatValue={formatValue} />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </MonoChartCard>
  );
}

interface TileProps {
  id: string | number;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  value: number;
  tone: number;
  depth: number;
}

function Tile({ id, x, y, width, height, name, value, tone, depth, total, formatValue, onTileClick }: TileProps & {
  total: number;
  formatValue: (value: number) => string;
  onTileClick?: (tile: MonoTile) => void;
}) {
  // Depth 0 is the root rectangle wrapping every tile.
  if (depth === 0 || width <= TILE_GAP * 2 || height <= TILE_GAP * 2) return null;
  const isDark = tone > 0.5;
  const showLabel = width > 76 && height > 40;

  const select = () => onTileClick?.({ id, name, value });

  return (
    <g
      {...(onTileClick && {
        role: "link",
        tabIndex: 0,
        "aria-label": `${name}, ${formatValue(value)}`,
        className: "cursor-pointer outline-none [&:focus-visible>rect]:stroke-accent [&:focus-visible>rect]:stroke-2",
        onClick: select,
        onKeyDown: (event: React.KeyboardEvent) => event.key === "Enter" && select(),
      })}
    >
      <rect
        x={x + TILE_GAP / 2}
        y={y + TILE_GAP / 2}
        width={width - TILE_GAP}
        height={height - TILE_GAP}
        rx={10}
        fill="currentColor"
        fillOpacity={tone}
      />
      {showLabel && (
        <text
          x={x + 10}
          y={y + 20}
          style={{ fill: isDark ? "var(--surface)" : "var(--foreground)" }}
          fontSize={11}
          fontWeight={600}
        >
          {name.length * 6 > width - 16 ? `${name.slice(0, Math.max(Math.floor((width - 16) / 6) - 1, 1))}…` : name}
          <tspan x={x + 10} dy={15} fontSize={10} fontWeight={400}>
            {formatValue(value)} · {Math.round((value / total) * 100)}%
          </tspan>
        </text>
      )}
    </g>
  );
}
