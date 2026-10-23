import { formatNumber } from "../../lib/formatNumber";

interface ResultCountProps {
  // Undefined while results are loading: nothing is announced yet.
  count: number | undefined;
  noun: string;
  className?: string;
}

export function ResultCount({ count, noun, className = "" }: ResultCountProps) {
  return (
    <p aria-live="polite" className={`result-count text-sm text-muted ${className}`}>
      {count !== undefined && `${formatNumber(count)} ${noun}`}
    </p>
  );
}
