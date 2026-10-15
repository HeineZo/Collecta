import { MonoConcentricRadialRings } from "./ui/mono-concentric-radial-rings";

interface DepartmentProfileChartProps {
  // Undefined while loading: the rings stay empty.
  totalWorks: number | undefined;
  onView: number | undefined;
  highlights: number | undefined;
  withImages: number | undefined;
}

export function DepartmentProfileChart({ totalWorks, onView, highlights, withImages }: DepartmentProfileChartProps) {
  const isLoaded = totalWorks && onView !== undefined && highlights !== undefined && withImages !== undefined;
  const rings = isLoaded
    ? [
        { label: "on view", value: (onView / totalWorks) * 100 },
        { label: "with an image", value: (withImages / totalWorks) * 100 },
        { label: "Highlights", value: (highlights / totalWorks) * 100 },
      ]
    : [];

  return (
    <MonoConcentricRadialRings
      className="department-profile-chart"
      title="Profile"
      summary="share of its works"
      rings={rings}
    />
  );
}
