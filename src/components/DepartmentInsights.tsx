import { useCollectionOverview } from "../hooks/useCollectionOverview";
import { useOldestArtwork } from "../hooks/useOldestArtwork";
import { staleClass } from "../lib/staleClass";
import { DepartmentProfileChart } from "./DepartmentProfileChart";
import { DepartmentVisitGauge } from "./DepartmentVisitGauge";
import { ErrorState } from "./ErrorState";
import { OldestArtworkCard } from "./OldestArtworkCard";

export function DepartmentInsights({ departmentId }: { departmentId: number }) {
  const profile = useCollectionOverview(departmentId);
  const oldest = useOldestArtwork(departmentId);
  const { totalWorks, onView, highlights, withImages } = profile.overview ?? {};

  if (profile.hasError || oldest.hasError) {
    const retry = () => {
      profile.retry();
      oldest.retry();
    };
    return <ErrorState message="This department could not be loaded." onRetry={retry} />;
  }

  return (
    <div
      className="department-insights grid gap-3 md:grid-cols-3 md:gap-4"
      aria-busy={profile.isRefreshing || oldest.isRefreshing}
    >
      <div className={staleClass(profile.isRefreshing)}>
        <DepartmentProfileChart totalWorks={totalWorks} onView={onView} highlights={highlights} withImages={withImages} />
      </div>
      <div className={staleClass(profile.isRefreshing)}>
        <DepartmentVisitGauge onView={onView} />
      </div>
      <div className={staleClass(oldest.isRefreshing)}>
        <OldestArtworkCard departmentId={departmentId} artwork={oldest.objectId === null ? null : oldest.artwork} />
      </div>
    </div>
  );
}
