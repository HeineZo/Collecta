import { useInView } from "motion/react";
import { useRef } from "react";
import { EARLIEST_YEAR } from "../../api/collectionSearchApi";
import { useCollectionCounts } from "../../hooks/useCollectionCounts";
import { formatNumber } from "../../lib/formatNumber";
import { pluralize } from "../../lib/pluralize";
import { ErrorState } from "../common/ErrorState";
import { MonoCurvedWaveArea } from "../ui/mono-curved-wave-area";

const PERIODS = [
  { label: "< 3000 BC", endYear: -3000 },
  { label: "3000 BC", endYear: -1000 },
  { label: "1000 BC", endYear: 0 },
  { label: "1 AD", endYear: 500 },
  { label: "500", endYear: 1000 },
  { label: "1000", endYear: 1300 },
  { label: "1300", endYear: 1500 },
  { label: "1500", endYear: 1600 },
  { label: "1600", endYear: 1700 },
  { label: "1700", endYear: 1800 },
  { label: "1800", endYear: 1900 },
  { label: "1900", endYear: 2100 },
];
// Cumulative counts (works dated up to each period's end): every dated work is counted once, by its latest year.
// Undated works are stored as 0–0: counted apart to be taken out of every period ending after year 0.
const QUERIES = [
  ...PERIODS.map((period) => ({ dateBegin: EARLIEST_YEAR, dateEnd: period.endYear })),
  { dateBegin: 0, dateEnd: 0 },
];

const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact" });
const formatCompact = (value: number) => compactNumber.format(value);

export function CollectionPeriodsChart() {
  const ref = useRef<HTMLDivElement>(null);
  // Loaded once on screen: spreads the Met API calls instead of sending them all on page load.
  const isInView = useInView(ref, { once: true, margin: "200px" });
  const { counts, hasError, retry } = useCollectionCounts(isInView ? QUERIES : null);
  const undated = counts?.at(-1) ?? 0;
  const datedUpTo = (index: number) => counts![index] - (PERIODS[index].endYear >= 0 ? undated : 0);
  const datedTotal = counts ? datedUpTo(PERIODS.length - 1) : 0;
  const data =
    counts &&
    PERIODS.map((period, index) => ({
      label: period.label,
      value: datedUpTo(index) - (index > 0 ? datedUpTo(index - 1) : 0),
    }));

  return (
    <div ref={ref} className="collection-periods-chart min-h-64">
      {hasError ? (
        <ErrorState message="The periods could not be loaded." onRetry={retry} />
      ) : (
        data && (
          <MonoCurvedWaveArea
            title="Works through the ages"
            summary={`${formatNumber(datedTotal)} dated ${pluralize(datedTotal, "work")}`}
            data={data}
            valueName="Works"
            formatValue={formatCompact}
          />
        )
      )}
    </div>
  );
}
