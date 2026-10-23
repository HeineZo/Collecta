import { Link } from "react-router";
import { formatNumber } from "../../lib/formatNumber";
import { formatShare } from "../../lib/formatShare";
import type { CollectionOverview } from "../../models/CollectionOverview";
import { AnimatedNumber } from "../common/AnimatedNumber";
import { MonoStatKpiCard } from "../ui/mono-stat-kpi-card";

interface CollectionKeyFiguresProps {
  overview: CollectionOverview | undefined;
  departmentId?: number;
}

export function CollectionKeyFigures({ overview, departmentId }: CollectionKeyFiguresProps) {
  const figures = [
    { label: "Works", value: overview?.totalWorks, filter: "" },
    { label: "Highlights", value: overview?.highlights, filter: "isHighlight" },
    { label: "On view", value: overview?.onView, filter: "isOnView" },
    { label: "With an image", value: overview?.withImages, filter: "hasImages" },
  ];
  const scope = departmentId === undefined ? "the collection" : "its works";

  return (
    <div className="collection-key-figures grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {figures.map((figure, index) => (
        <MonoStatKpiCard
          key={figure.label}
          label={figure.label}
          value={figure.value === undefined ? undefined : <AnimatedNumber value={figure.value} format={formatNumber} />}
          hint={
            overview && figure.value !== undefined
              ? index === 0
                ? departmentId === undefined
                  ? "in the Met collection"
                  : "in this department"
                : `${formatShare(figure.value / overview.totalWorks)} of ${scope}`
              : undefined
          }
          className="relative transition-colors has-[a:hover]:border-muted"
        >
          {departmentId !== undefined && (
            <Link
              to={`/departments/${departmentId}?filters=${figure.filter}`}
              aria-label={`${figure.label} in this department`}
              className="collection-key-figures__link absolute inset-0 rounded-3xl"
            />
          )}
        </MonoStatKpiCard>
      ))}
    </div>
  );
}
