import { Link } from "react-router";
import { useDepartmentCover } from "../../hooks/useDepartmentCover";
import { formatNumber } from "../../lib/formatNumber";
import type { DepartmentWithTotal } from "../../models/DepartmentWithTotal";

interface DepartmentListRowProps {
  department: DepartmentWithTotal;
  position: number;
  onHover?: () => void;
  isPlaceholder?: boolean;
}

export function DepartmentListRow({ department, position, onHover, isPlaceholder = false }: DepartmentListRowProps) {
  const { coverUrl } = useDepartmentCover(isPlaceholder ? undefined : department.departmentId);
  return (
    <Link
      to={`/departments/${department.departmentId}`}
      onPointerEnter={onHover}
      className="department-list-row group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-separator py-4 last:border-b-0 transition-colors duration-300 md:gap-8 md:py-6"
    >
      <span className="w-8 text-sm tabular-nums text-muted md:w-12">{String(position).padStart(2, "0")}</span>
      <span className="flex min-w-0 items-center gap-3">
        {/* Touch screens get a thumbnail instead of the cover following the cursor. */}
        {coverUrl && (
          <img src={coverUrl} alt="" loading="lazy" className="size-12 shrink-0 rounded-xl object-cover [@media(hover:hover)]:hidden" />
        )}
        <h2 className="truncate text-xl font-medium tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 md:text-5xl md:leading-[1.2]">
          {department.displayName}
        </h2>
      </span>
      <span className="text-right text-sm tabular-nums text-muted md:text-base">
        {formatNumber(department.totalWorks)}
        <span className="hidden md:inline"> works</span>
      </span>
    </Link>
  );
}
