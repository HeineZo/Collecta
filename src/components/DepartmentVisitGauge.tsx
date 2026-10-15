import { formatDuration } from "../lib/formatDuration";
import { MonoSpeedometerGauge } from "./ui/mono-speedometer-gauge";

const SECONDS_PER_WORK = 30;
const ONE_WEEK = 7 * 24 * 60 * 60;

interface DepartmentVisitGaugeProps {
  // Undefined while loading: the gauge stays empty.
  onView: number | undefined;
}

export function DepartmentVisitGauge({ onView }: DepartmentVisitGaugeProps) {
  const visitSeconds = onView === undefined ? undefined : onView * SECONDS_PER_WORK;

  return (
    <MonoSpeedometerGauge
      className="department-visit-gauge"
      title="Time to see it all"
      summary="full gauge = 1 week"
      fraction={(visitSeconds ?? 0) / ONE_WEEK}
      readout={visitSeconds === undefined ? "" : formatDuration(visitSeconds)}
      caption={`non-stop, ${SECONDS_PER_WORK} s per work on view`}
    />
  );
}
